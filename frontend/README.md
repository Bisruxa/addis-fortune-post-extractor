# React Frontend

SPA that consumes the Laravel API to browse **Addis Fortune Vol 7 No 364** content.

## Features

- Browse all posts with pagination
- Filter by category (sidebar)
- Full-text search
- Single post page with original HTML content and related images

## Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev          # http://localhost:5173
```

Set `VITE_API_URL=http://localhost:8000/api` in `.env`.

**Requires** the Laravel API running (`php artisan serve`) and posts imported via the Python parser.

## Routes

| Route | Page |
|-------|------|
| `/` | All articles + search |
| `/category/:slug` | Category-filtered list |
| `/posts/:id` | Article detail + images |

## Structure

```
frontend/src/
├── components/
│   ├── CategoryFilter.tsx
│   ├── ImageGallery.tsx
│   ├── Layout.tsx
│   ├── Pagination.tsx
│   ├── PostCard.tsx
│   ├── PostList.tsx
│   └── SearchBar.tsx
├── pages/
│   ├── PostsPage.tsx
│   └── PostDetailPage.tsx
├── services/api.ts
└── types/post.ts
```

## Images

- **Development:** Vite serves `../data/archive` at `/archive/...`
- **Production:** Laravel serves images at `http://localhost:8000/archive/...` — set `VITE_ARCHIVE_URL` in `.env` before `npm run build`

## Production build

```bash
npm run build
npm run preview
```

Serve `dist/` behind nginx/Apache and proxy `/api` to Laravel and `/archive` to the HTML archive folder.
