<?php

use App\Http\Controllers\ArchiveController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'name' => 'Addis Fortune Post API',
        'version' => '1.0',
        'docs' => '/api/posts',
    ]);
});

Route::get('/archive/{path}', [ArchiveController::class, 'show'])
    ->where('path', '.*');
