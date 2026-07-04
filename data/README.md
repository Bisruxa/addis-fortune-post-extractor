# Source HTML Archive

Place the **Vol 7 No 364** HTML files here so the Python parser can read them.

## Setup

Copy or symlink the archive into this folder:

```
data/archive/
├── Index.htm
├── opinion.htm
├── newsinbrief.htm
├── NBE Power Outage Freezes Gov't Accounts.htm
├── images/
├── vol 7 No 364 images/
└── ... (all other .htm files)
```

From your workspace root:

```bash
# Windows (PowerShell) — adjust source path if needed
cp -r "../Vol 7 No 364  Archive (1)/Vol 7 No 364  Archive" "./data/archive"

# Or create a junction/symlink to avoid duplicating ~4MB of files
```

## Why not in Git?

The archive is large and was provided with the exam. Keep it local or use Git LFS. The parser reads from `data/archive/` by default (configurable in `parser/config.py`).

## What gets extracted per file

| Field | Example |
|-------|---------|
| `title` | From `<title>` or bold headline in body |
| `author` | Reporter/byline when present |
| `content` | Article body HTML (stored unchanged) |
| `images` | Related `<img src="...">` paths |
| `source_file` | e.g. `NBE Power Outage Freezes Gov't Accounts.htm` |
| `category` | e.g. `news`, `opinion`, `interview`, `cartoon` |
