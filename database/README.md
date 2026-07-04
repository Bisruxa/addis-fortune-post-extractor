# Database

MySQL schema for the Addis Fortune post extractor.

## Tables

### `posts`

| Column | Type | Purpose |
|--------|------|---------|
| `id` | BIGINT | Primary key |
| `title` | VARCHAR(500) | Article headline |
| `author` | VARCHAR(255) | Byline when found (e.g. "By Girma Feyissa") |
| `content` | LONGTEXT | Original HTML body — **never rewritten** |
| `category` | VARCHAR(100) | Slug: `news`, `opinion`, `interview`, etc. |
| `source_file` | VARCHAR(500) | Original `.htm` filename — **unique** (dedup) |
| `content_hash` | CHAR(64) | SHA-256 of content — **unique** (dedup) |
| `created_at` / `updated_at` | TIMESTAMP | Import / update times |

### `post_images`

| Column | Type | Purpose |
|--------|------|---------|
| `id` | BIGINT | Primary key |
| `post_id` | BIGINT | FK → `posts.id` (cascade delete) |
| `image_path` | VARCHAR(1000) | Relative image path from archive |
| `sort_order` | SMALLINT | Display order on post detail page |

## Duplicate prevention

Imports are rejected when either:

1. `source_file` already exists, or
2. `content_hash` matches an existing row

## Full-text search

`FULLTEXT(title, content)` supports the API search endpoint in Step 4.

## Setup options

### Option A — SQL file (no Laravel yet)

```bash
mysql -u root -p < database/schema.sql
```

### Option B — Laravel migrations (after `composer create-project`)

```bash
cd backend
cp .env.example .env
# Edit DB_* values, then:
php artisan migrate
```

Migrations live in `backend/database/migrations/`.

## ER diagram

```
posts (1) ──────< (N) post_images
  │
  ├─ source_file UNIQUE
  ├─ content_hash UNIQUE
  └─ category INDEX
```
