<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->string('title', 500)->nullable();
            $table->string('author', 255)->nullable();
            $table->longText('content');
            $table->string('category', 100)->default('other')->index();
            $table->string('source_file', 500)->unique();
            $table->char('content_hash', 64)->nullable()->unique();
            $table->timestamps();

            $table->fullText(['title', 'content']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
