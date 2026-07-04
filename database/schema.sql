-- Addis Fortune Post Extractor — MySQL schema
-- Run: mysql -u root -p < database/schema.sql

CREATE DATABASE IF NOT EXISTS addis_fortune_posts
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE addis_fortune_posts;

-- ---------------------------------------------------------------------------
-- posts: one row per imported HTML article
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS posts (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  title         VARCHAR(500)    NULL,
  author        VARCHAR(255)    NULL,
  content       LONGTEXT        NOT NULL COMMENT 'Original HTML body, unchanged',
  category      VARCHAR(100)    NOT NULL DEFAULT 'other',
  source_file   VARCHAR(500)    NOT NULL COMMENT 'Original filename, e.g. opinion.htm',
  content_hash  CHAR(64)        NULL COMMENT 'SHA-256 of content for duplicate detection',
  created_at    TIMESTAMP       NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP       NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY posts_source_file_unique (source_file),
  UNIQUE KEY posts_content_hash_unique (content_hash),
  KEY posts_category_index (category),
  FULLTEXT KEY posts_search_fulltext (title, content)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- post_images: related images extracted from each post
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS post_images (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  post_id     BIGINT UNSIGNED NOT NULL,
  image_path  VARCHAR(1000)   NOT NULL COMMENT 'Relative path from archive root',
  sort_order  SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  created_at  TIMESTAMP       NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  KEY post_images_post_id_index (post_id),
  CONSTRAINT post_images_post_id_foreign
    FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
