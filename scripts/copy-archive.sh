#!/usr/bin/env bash
# Copy the Vol 7 No 364 HTML archive into data/archive/
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SOURCE="${1:-$ROOT/../Vol 7 No 364  Archive (1)/Vol 7 No 364  Archive}"
TARGET="$ROOT/data/archive"

if [ ! -d "$SOURCE" ]; then
  echo "Source not found: $SOURCE"
  echo "Usage: $0 [path-to-archive-folder]"
  exit 1
fi

mkdir -p "$TARGET"
cp -r "$SOURCE/." "$TARGET/"
echo "Archive copied to $TARGET"
