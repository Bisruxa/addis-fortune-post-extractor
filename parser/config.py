"""Parser configuration — update paths and DB credentials for your environment."""

import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent / ".env")

# Project root (parent of parser/)
PROJECT_ROOT = Path(__file__).resolve().parent.parent

# Default HTML archive location
ARCHIVE_DIR = PROJECT_ROOT / "data" / "archive"

# MySQL connection
DB_CONFIG = {
    "host": os.getenv("DB_HOST", "127.0.0.1"),
    "port": int(os.getenv("DB_PORT", "3306")),
    "user": os.getenv("DB_USER", "root"),
    "password": os.getenv("DB_PASSWORD", ""),
    "database": os.getenv("DB_DATABASE", "addis_fortune_posts"),
}

# File extensions to process
HTML_EXTENSIONS = {".htm", ".html"}

# Files to skip (navigation/index pages, not articles)
SKIP_FILES = {
    "index.htm",
    "homepage.htm",
    "volume_number.htm",
    "published on.htm",
    "guestbook.htm",
    "clock.htm",
    "archive.htm",
    "aboutus.htm",
    "newsinbriefindex.htm",
    "restaurantsreview_index.htm",
    "business oppoerunities_index.htm",
    "business opportunities_index.htm",
    "allcartoons.htm",
    "tender_mart.htm",
    "fortune_crawling_news.htm",
    "news_364.htm",
    "news_365.htm",
    "addis fortune news.htm",
    "businessopportunities.htm",
    "comic stripes.htm",
}

# Substring patterns in relative paths to skip (templates, widgets)
SKIP_PATTERNS = (
    "fortune news page template",
    "business opportunities_",
)
