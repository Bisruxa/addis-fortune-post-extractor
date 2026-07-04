#!/usr/bin/env bash
# Quick smoke-test after full setup (API must be running on :8000)
set -euo pipefail

API="${API_URL:-http://localhost:8000}"

echo "==> Health check"
curl -sf "$API/up" > /dev/null && echo "OK  /up"

echo "==> List posts"
curl -sf "$API/api/posts?per_page=3" | head -c 200
echo ""

echo "==> Categories"
curl -sf "$API/api/categories" | head -c 200
echo ""

echo "==> Search"
curl -sf "$API/api/posts/search?q=NBE" | head -c 200
echo ""

echo "All checks passed."
