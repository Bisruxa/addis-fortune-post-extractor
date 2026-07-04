"""
CLI entry point for HTML ingestion.

Pipeline: discover files → parse → classify → write to MySQL (with deduplication)
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

# Allow running as `python main.py` from parser/
sys.path.insert(0, str(Path(__file__).resolve().parent))

from config import ARCHIVE_DIR, DB_CONFIG  # noqa: E402
from src.classifier import classify  # noqa: E402
from src.db_writer import DatabaseWriter, content_hash  # noqa: E402
from src.file_discovery import discover_html_files  # noqa: E402
from src.html_parser import parse_html_file  # noqa: E402


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Import Addis Fortune HTML archive into MySQL",
    )
    parser.add_argument(
        "--archive-dir",
        type=Path,
        default=ARCHIVE_DIR,
        help="Path to HTML archive (default: data/archive)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Parse and classify without writing to the database",
    )
    parser.add_argument(
        "--json",
        action="store_true",
        help="Print parsed posts as JSON (implies --dry-run)",
    )
    parser.add_argument(
        "--verbose",
        "-v",
        action="store_true",
        help="Print per-file status",
    )
    return parser


def safe_print(message: str) -> None:
    """Print safely on Windows consoles that lack full Unicode support."""
    encoding = getattr(sys.stdout, "encoding", None) or "utf-8"
    try:
        print(message)
    except UnicodeEncodeError:
        print(message.encode(encoding, errors="replace").decode(encoding))


def process_file(file_path: Path, archive_root: Path) -> dict | None:
    parsed = parse_html_file(file_path, archive_root)
    if parsed is None:
        return None

    parsed["category"] = classify(parsed["source_file"], parsed["title"] or "")
    parsed["content_hash"] = content_hash(parsed["content"])
    return parsed


def main() -> int:
    args = build_parser().parse_args()
    dry_run = args.dry_run or args.json
    archive_root = args.archive_dir.resolve()

    try:
        files = discover_html_files(archive_root)
    except FileNotFoundError as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 1

    stats = {"total": len(files), "parsed": 0, "skipped": 0, "inserted": 0, "duplicates": 0, "errors": 0}
    results: list[dict] = []

    writer: DatabaseWriter | None = None
    if not dry_run:
        writer = DatabaseWriter(DB_CONFIG)
        try:
            writer.connect()
        except Exception as exc:
            print(f"Database connection failed: {exc}", file=sys.stderr)
            print("Tip: run `mysql -u root -p < database/schema.sql` first", file=sys.stderr)
            return 1

    try:
        for file_path in files:
            try:
                post = process_file(file_path, archive_root)
            except Exception as exc:
                stats["errors"] += 1
                if args.verbose:
                    safe_print(f"ERROR  {file_path.name}: {exc}")
                continue

            if post is None:
                stats["skipped"] += 1
                if args.verbose:
                    safe_print(f"SKIP   {file_path.name}")
                continue

            stats["parsed"] += 1

            if dry_run:
                preview = {**post, "content": f"<{len(post['content'])} chars>"}
                results.append(preview)
                if args.verbose:
                    safe_print(
                        f"OK     {post['source_file']} | {post['category']} | "
                        f"{(post['title'] or '(no title)')[:60]}"
                    )
                continue

            assert writer is not None
            try:
                inserted = writer.insert_post(post)
            except Exception as exc:
                stats["errors"] += 1
                if args.verbose:
                    safe_print(f"DB ERR {post['source_file']}: {exc}")
                continue

            if inserted:
                stats["inserted"] += 1
                if args.verbose:
                    safe_print(f"INSERT {post['source_file']}")
            else:
                stats["duplicates"] += 1
                if args.verbose:
                    safe_print(f"DUP    {post['source_file']}")

    finally:
        if writer:
            writer.close()

    if args.json:
        print(json.dumps(results, indent=2, ensure_ascii=False))
    else:
        mode = "DRY RUN" if dry_run else "IMPORT"
        print(f"\n{mode} complete")
        print(f"  Files found:    {stats['total']}")
        print(f"  Parsed:         {stats['parsed']}")
        print(f"  Skipped:        {stats['skipped']}")
        if not dry_run:
            print(f"  Inserted:       {stats['inserted']}")
            print(f"  Duplicates:     {stats['duplicates']}")
        print(f"  Errors:         {stats['errors']}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
