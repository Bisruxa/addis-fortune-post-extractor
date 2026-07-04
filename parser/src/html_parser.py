"""
Extract post fields from a single local HTML file.

Returns dict with: title, author, content, images, source_file
Content is preserved as-is from the source (no rewriting).
"""

from __future__ import annotations

import re
from pathlib import Path
from typing import Any
from urllib.parse import unquote

from bs4 import BeautifulSoup, Tag

# Navigation / layout images — not article content
_NAV_IMAGE_PATTERNS = re.compile(
    r"(fortuneoff|fortuneon|fortunetopbanner|addisvirtical|ad\s*here|"
    r"top\s*right\s*banner|fortunebtn|home\d*\.gif|\.swf)",
    re.IGNORECASE,
)

_TITLE_PREFIX_RE = re.compile(
    r"^Addis Fortune[-\s]*Content Matters:\s*",
    re.IGNORECASE,
)

_AUTHOR_PATTERNS = [
    re.compile(
        r"<i>\s*By\s*</i>\s*<[^>]+>\s*<[^>]+>\s*([A-Z][A-Z\s]+?)(?:<br|FORTUNE)",
        re.IGNORECASE | re.DOTALL,
    ),
    re.compile(
        r"By\s+([A-Z][A-Za-z\u00C0-\u024F\s\.\-']+?)"
        r"(?:\s*<br\s*/?>|\s*FORTUNE\s+STAFF|\s*</)",
        re.IGNORECASE,
    ),
    re.compile(
        r"By\s+([A-Z][A-Za-z\u00C0-\u024F\s\.\-']{2,60})",
        re.IGNORECASE,
    ),
    re.compile(
        r"Source:\s*(.+?)(?:,\s*\w+\s+\d{1,2},?\s+\d{4}|\s*</)",
        re.IGNORECASE,
    ),
    re.compile(
        r"Compiled from a press release by\s+(.+?)(?:\)|</)",
        re.IGNORECASE,
    ),
]

_MIN_CONTENT_CHARS = 80


def parse_html_file(file_path: Path, archive_root: Path | None = None) -> dict[str, Any] | None:
    """Parse one HTML file. Returns None if unusable or not a post."""
    archive_root = archive_root or file_path.parent
    source_file = file_path.relative_to(archive_root).as_posix()

    try:
        raw_html = _read_file(file_path)
    except OSError:
        return None

    if not raw_html.strip():
        return None

    try:
        soup = BeautifulSoup(raw_html, "lxml")
    except Exception:
        try:
            soup = BeautifulSoup(raw_html, "html.parser")
        except Exception:
            return None

    title = _extract_title(soup, file_path.name)
    content_block = _find_content_block(soup)
    if content_block is None:
        return None

    content = str(content_block)
    if len(_visible_text(content)) < _MIN_CONTENT_CHARS:
        return None

    author = _extract_author(soup, content)
    images = _extract_images(content_block, file_path, archive_root)

    return {
        "title": title,
        "author": author,
        "content": content,
        "images": images,
        "source_file": source_file,
    }


def _read_file(file_path: Path) -> str:
    for encoding in ("windows-1252", "utf-8", "iso-8859-1", "latin-1"):
        try:
            return file_path.read_text(encoding=encoding)
        except UnicodeDecodeError:
            continue
    return file_path.read_text(encoding="latin-1", errors="replace")


def _visible_text(html: str) -> str:
    soup = BeautifulSoup(html, "html.parser")
    return re.sub(r"\s+", " ", soup.get_text()).strip()


def _extract_title(soup: BeautifulSoup, filename: str) -> str:
    title_tag = soup.find("title")
    if title_tag and title_tag.string:
        title = title_tag.get_text(strip=True)
        title = _TITLE_PREFIX_RE.sub("", title).strip()
        if title and title.lower() not in {"untitled-1", "untitled"}:
            return title[:500]

    headline = soup.find(["h1", "h2"])
    if headline:
        text = headline.get_text(strip=True)
        if text:
            return text[:500]

    bold_headline = soup.find(
        "b",
        string=re.compile(r".{10,}", re.DOTALL),
    )
    if bold_headline:
        text = bold_headline.get_text(" ", strip=True)
        if len(text) >= 10:
            return text[:500]

    # Fallback: filename without extension
    stem = Path(filename).stem
    return stem[:500]


def _find_content_block(soup: BeautifulSoup) -> Tag | None:
    """Locate the main article body container."""
    fieldsets = soup.find_all("fieldset")
    if fieldsets:
        return max(fieldsets, key=lambda tag: len(tag.get_text(strip=True)))

    candidates: list[Tag] = []

    for table in soup.find_all("table"):
        bgcolor = (table.get("bgcolor") or "").lower().replace("#", "")
        if bgcolor in {"b3c7e3", "e4ebf5", "cedbed"}:
            candidates.append(table)

    if candidates:
        return max(candidates, key=lambda tag: len(tag.get_text(strip=True)))

    body = soup.find("body")
    if body:
        paragraphs = body.find_all("p")
        if paragraphs:
            wrapper = soup.new_tag("div")
            for paragraph in paragraphs:
                if len(paragraph.get_text(strip=True)) > 40:
                    wrapper.append(paragraph)
            if len(wrapper.get_text(strip=True)) >= _MIN_CONTENT_CHARS:
                return wrapper

    return None


def _extract_author(soup: BeautifulSoup, content_html: str) -> str | None:
    for pattern in _AUTHOR_PATTERNS:
        match = pattern.search(content_html)
        if match:
            author = re.sub(r"\s+", " ", match.group(1)).strip(" .,;")
            if len(author) >= 3:
                return author[:255]

    for element in soup.find_all(["td", "p", "span"]):
        align = (element.get("align") or "").lower()
        text = element.get_text(" ", strip=True)
        if align == "right" and text.lower().startswith("by "):
            author = re.sub(r"^by\s+", "", text, flags=re.IGNORECASE)
            author = re.sub(r"\s*FORTUNE\s+STAFF\s+WRITER.*", "", author, flags=re.IGNORECASE)
            author = author.strip(" .,;")
            if 3 <= len(author) <= 120:
                return author[:255]

    return None


def _resolve_image_path(src: str, file_path: Path, archive_root: Path) -> str:
    """Return archive-relative path, remapping legacy volume folders when possible."""
    src = unquote(src.strip())
    if not src or src.startswith(("http://", "https://", "data:")):
        return src.replace("\\", "/")

    resolved = (file_path.parent / src).resolve()
    try:
        relative = resolved.relative_to(archive_root.resolve()).as_posix()
        if resolved.is_file():
            return relative
    except ValueError:
        relative = src.replace("\\", "/")

    basename = Path(relative).name
    if basename and re.search(r"vol\s+7\s+no\s+\d+\s+images", relative, re.I):
        for folder in (
            "vol 7 No 364 images/images",
            "vol 7 No 364 images",
        ):
            candidate = archive_root / folder / basename
            if candidate.is_file():
                return candidate.relative_to(archive_root.resolve()).as_posix()

    return relative


def _extract_images(
    content_block: Tag,
    file_path: Path,
    archive_root: Path,
) -> list[str]:
    images: list[str] = []
    seen: set[str] = set()

    for img in content_block.find_all("img"):
        src = unquote((img.get("src") or "").strip())
        if not src or src.startswith(("http://", "https://", "data:")):
            continue
        if _NAV_IMAGE_PATTERNS.search(src):
            continue

        relative = _resolve_image_path(src, file_path, archive_root)

        if relative not in seen:
            seen.add(relative)
            images.append(relative)

    return images
