# Laravel API Backend

REST API over the MySQL `posts` table populated by the Python parser.

## Step 4 — API (complete)

### Setup

Requires **PHP 8.2+**, **Composer**, and **MySQL** with data imported (Steps 2–3).

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate        # if tables not created via schema.sql
php artisan serve          # http://localhost:8000
```

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/posts` | Paginated list (`?page=1&per_page=15`) |
| `GET` | `/api/posts?category=news` | Filter by category slug |
| `GET` | `/api/posts?q=bank` | Search (full-text when ≥3 chars) |
| `GET` | `/api/posts/search?q=bank` | Dedicated search endpoint |
| `GET` | `/api/posts/search?q=bank&category=news` | Search within category |
| `GET` | `/api/posts/{id}` | Single post with related images |
| `GET` | `/api/categories` | Categories with post counts |
| `GET` | `/up` | Health check |

### Example responses

**List** `GET /api/posts?category=opinion&per_page=5`

```json
{
  "data": [
    {
      "id": 12,
      "title": "…",
      "author": "By Nicolas Moyer",
      "category": "opinion",
      "source_file": "opinion.htm",
      "excerpt": "…",
      "image_count": 0,
      "created_at": "2026-07-01T12:00:00+00:00"
    }
  ],
  "links": { "first": "…", "last": "…", "prev": null, "next": "…" },
  "meta": { "current_page": 1, "per_page": 5, "total": 1 }
}
```

**Detail** `GET /api/posts/12`

```json
{
  "data": {
    "id": 12,
    "title": "…",
    "author": "…",
    "content": "<table>…original HTML…</table>",
    "category": "opinion",
    "source_file": "opinion.htm",
    "images": [
      { "id": 1, "path": "vol 7 No 364 images/…gif", "sort_order": 0 }
    ],
    "created_at": "…"
  }
}
```

### Project structure

```
backend/
├── app/
│   ├── Enums/PostCategory.php
│   ├── Http/
│   │   ├── Controllers/Api/PostController.php
│   │   └── Resources/PostResource.php, PostSummaryResource.php
│   └── Models/Post.php, PostImage.php
├── database/migrations/
├── routes/api.php
└── public/index.php
```

### CORS

React dev server (`http://localhost:5173`) is allowed via `FRONTEND_URL` in `.env`.

### Archive images

`GET /archive/{path}` serves files from `../data/archive/` (e.g. post-related `.gif` images).
