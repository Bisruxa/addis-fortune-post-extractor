# Python Parser

Ingests local HTML files from `data/archive/` and writes structured posts into MySQL.

## Responsibilities

- Parse title, author, content, images, and source filename
- Classify posts by category (news, opinion, interview, cartoon, etc.)
- Skip duplicate imports (same `source_file` or `content_hash`)
- Tolerate malformed HTML without crashing the batch
- Use only free libraries (BeautifulSoup, lxml, mysql-connector)

## Setup

```bash
cd parser
pip install -r requirements.txt
cp .env.example .env   # optional — edit DB credentials
```

Ensure the database exists:

```bash
mysql -u root -p < ../database/schema.sql
```

## Usage

```bash
# Preview what will be imported (no database writes)
python main.py --dry-run --verbose

# Full import
python main.py --verbose

# Export parsed preview as JSON
python main.py --json > preview.json
```

## Layout

```
parser/
├── main.py              # CLI entry point
├── config.py            # Archive path, skip lists, DB config
├── requirements.txt
└── src/
    ├── file_discovery.py
    ├── html_parser.py   # Per-file extraction
    ├── classifier.py    # Category from filename/title
    ├── categories.py    # Valid category slugs
    └── db_writer.py     # MySQL insert with deduplication
```

## Extraction logic

| Field | How it is found |
|-------|-----------------|
| `title` | `<title>` tag (cleaned), or bold headline, or filename |
| `author` | `By …` bylines, `Source: …`, right-aligned credit lines |
| `content` | Main `<table bgcolor="#b3c7e3">` or `<fieldset>` block — stored unchanged |
| `images` | `<img src>` inside content, excluding nav/banner assets |
| `category` | Filename/title pattern rules in `classifier.py` |

## Skipped files

Navigation and template pages (`index.htm`, `Clock.htm`, `FORTUNE NEWS PAGE TEMPLATE…`, etc.) are excluded via `config.SKIP_FILES` and `SKIP_PATTERNS`.
