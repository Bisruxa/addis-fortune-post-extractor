"""
Write parsed posts to MySQL with duplicate prevention.

Duplicates are detected by unique source_file or content_hash.
"""

from __future__ import annotations

import hashlib
from typing import Any

import mysql.connector
from mysql.connector import Error, MySQLConnection


class DatabaseWriter:
    def __init__(self, db_config: dict[str, Any]) -> None:
        self._config = db_config
        self._connection: MySQLConnection | None = None

    def connect(self) -> None:
        self._connection = mysql.connector.connect(**self._config)

    def close(self) -> None:
        if self._connection and self._connection.is_connected():
            self._connection.close()

    def __enter__(self) -> "DatabaseWriter":
        self.connect()
        return self

    def __exit__(self, *args: object) -> None:
        self.close()

    def exists(self, source_file: str, content_hash: str) -> bool:
        assert self._connection is not None
        cursor = self._connection.cursor()
        cursor.execute(
            """
            SELECT id FROM posts
            WHERE source_file = %s OR content_hash = %s
            LIMIT 1
            """,
            (source_file, content_hash),
        )
        row = cursor.fetchone()
        cursor.close()
        return row is not None

    def insert_post(self, post: dict[str, Any]) -> bool:
        """
        Insert post and related images if not duplicate.
        Returns True if inserted, False if skipped.
        """
        assert self._connection is not None

        content_hash = hashlib.sha256(post["content"].encode("utf-8")).hexdigest()
        if self.exists(post["source_file"], content_hash):
            return False

        cursor = self._connection.cursor()
        try:
            cursor.execute(
                """
                INSERT INTO posts
                    (title, author, content, category, source_file, content_hash)
                VALUES (%s, %s, %s, %s, %s, %s)
                """,
                (
                    post.get("title"),
                    post.get("author"),
                    post["content"],
                    post["category"],
                    post["source_file"],
                    content_hash,
                ),
            )
            post_id = cursor.lastrowid

            for index, image_path in enumerate(post.get("images", [])):
                cursor.execute(
                    """
                    INSERT INTO post_images (post_id, image_path, sort_order)
                    VALUES (%s, %s, %s)
                    """,
                    (post_id, image_path, index),
                )

            self._connection.commit()
            return True
        except Error:
            self._connection.rollback()
            raise
        finally:
            cursor.close()


def content_hash(content: str) -> str:
    return hashlib.sha256(content.encode("utf-8")).hexdigest()
