"""Discover HTML files in the archive."""

from __future__ import annotations

from pathlib import Path

from config import ARCHIVE_DIR, HTML_EXTENSIONS, SKIP_FILES, SKIP_PATTERNS


def should_skip(file_path: Path, archive_root: Path) -> bool:
    name = file_path.name.lower()
    if name in SKIP_FILES:
        return True

    relative = file_path.relative_to(archive_root).as_posix().lower()
    for pattern in SKIP_PATTERNS:
        if pattern in relative:
            return True

    return False


def discover_html_files(archive_dir: Path | None = None) -> list[Path]:
    """Return sorted list of HTML files to process."""
    root = (archive_dir or ARCHIVE_DIR).resolve()
    if not root.is_dir():
        raise FileNotFoundError(f"Archive directory not found: {root}")

    files: list[Path] = []
    for path in root.rglob("*"):
        if not path.is_file():
            continue
        if path.suffix.lower() not in HTML_EXTENSIONS:
            continue
        if should_skip(path, root):
            continue
        files.append(path)

    return sorted(files)
