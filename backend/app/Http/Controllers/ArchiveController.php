<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ArchiveController extends Controller
{
    private const EDITION_FALLBACK_DIRS = [
        'vol 7 No 364 images/images',
        'vol 7 No 364 images',
    ];

    /**
     * Serve static assets from data/archive (images referenced in posts).
     */
    public function show(Request $request, string $path): BinaryFileResponse
    {
        $archiveRoot = realpath(base_path('../data/archive'));

        if ($archiveRoot === false) {
            abort(404, 'Archive directory not found. Copy HTML files to data/archive/.');
        }

        $decoded = str_replace(['..', '\\'], ['', '/'], $path);
        $file = $this->resolveArchiveFile($archiveRoot, $decoded);

        if ($file === null) {
            abort(404);
        }

        return response()->file($file);
    }

    private function resolveArchiveFile(string $archiveRoot, string $relativePath): ?string
    {
        $candidate = realpath($archiveRoot.DIRECTORY_SEPARATOR.$relativePath);

        if ($candidate !== false && str_starts_with($candidate, $archiveRoot) && is_file($candidate)) {
            return $candidate;
        }

        // Legacy HTML references older "vol 7 No ### images" folders — try current edition.
        if (! preg_match('/vol\s+7\s+no\s+\d+\s+images/i', $relativePath)) {
            return null;
        }

        $basename = basename($relativePath);

        foreach (self::EDITION_FALLBACK_DIRS as $dir) {
            $fallback = realpath($archiveRoot.DIRECTORY_SEPARATOR.$dir.DIRECTORY_SEPARATOR.$basename);

            if ($fallback !== false && str_starts_with($fallback, $archiveRoot) && is_file($fallback)) {
                return $fallback;
            }
        }

        return null;
    }
}
