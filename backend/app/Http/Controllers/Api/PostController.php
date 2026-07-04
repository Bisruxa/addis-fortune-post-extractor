<?php

namespace App\Http\Controllers\Api;

use App\Enums\PostCategory;
use App\Http\Controllers\Controller;
use App\Http\Resources\PostResource;
use App\Http\Resources\PostSummaryResource;
use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PostController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $perPage = min(max((int) $request->query('per_page', 15), 1), 50);

        $query = Post::query()
            ->withCount('images')
            ->latest('id');

        if ($category = $request->query('category')) {
            $query->where('category', $category);
        }

        if ($search = trim((string) $request->query('q', ''))) {
            $this->applySearch($query, $search);
        }

        return PostSummaryResource::collection(
            $query->paginate($perPage)->withQueryString()
        );
    }

    public function show(int $post): PostResource
    {
        $record = Post::with('images')->findOrFail($post);

        return new PostResource($record);
    }

    public function search(Request $request): AnonymousResourceCollection
    {
        $validated = $request->validate([
            'q' => ['required', 'string', 'min:2', 'max:200'],
            'category' => ['nullable', 'string', 'max:100'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        $perPage = min(max((int) ($validated['per_page'] ?? 15), 1), 50);

        $query = Post::query()
            ->withCount('images')
            ->latest('id');

        $this->applySearch($query, $validated['q']);

        if (! empty($validated['category'])) {
            $query->where('category', $validated['category']);
        }

        return PostSummaryResource::collection(
            $query->paginate($perPage)->withQueryString()
        );
    }

    public function categories(): JsonResponse
    {
        $usedInDb = Post::query()
            ->select('category')
            ->selectRaw('COUNT(*) as post_count')
            ->groupBy('category')
            ->orderBy('category')
            ->get();

        $data = $usedInDb->map(function ($row) {
            return [
                'slug' => $row->category,
                'label' => $this->formatCategoryLabel($row->category),
                'count' => (int) $row->post_count,
            ];
        })->values();

        return response()->json([
            'data' => $data,
            'known_categories' => PostCategory::values(),
        ]);
    }

    private function applySearch($query, string $search): void
    {
        $terms = trim($search);

        if (strlen($terms) >= 3) {
            $query->whereFullText(['title', 'content'], $terms);
            return;
        }

        $query->where(function ($inner) use ($terms) {
            $like = '%'.$terms.'%';
            $inner->where('title', 'like', $like)
                ->orWhere('content', 'like', $like)
                ->orWhere('author', 'like', $like);
        });
    }

    private function formatCategoryLabel(string $slug): string
    {
        return str_replace('_', ' ', ucwords(str_replace('_', ' ', $slug)));
    }
}
