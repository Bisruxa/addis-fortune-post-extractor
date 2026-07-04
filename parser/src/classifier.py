"""
Assign a category to a post based on filename and title patterns.
"""

from __future__ import annotations

import re

from .categories import DEFAULT_CATEGORY

# (pattern, category) — first match wins
_RULES: list[tuple[re.Pattern[str], str]] = [
    (re.compile(r"^interview[- ]", re.I), "interview"),
    (re.compile(r"newsinbrief|news_in_brief|business_news_in_brief", re.I), "news_in_brief"),
    (re.compile(r"restaurantsreview|restaurant.?review", re.I), "restaurant_review"),
    (re.compile(r"cartoon|comic.?strip", re.I), "cartoon"),
    (re.compile(r"viewfromarada|view_from_arada", re.I), "view_from_arada"),
    (re.compile(r"viewpoint|myperspective", re.I), "viewpoint"),
    (re.compile(r"opinion", re.I), "opinion"),
    (re.compile(r"lifematters|life.?matters", re.I), "life_matters"),
    (re.compile(r"letter\s+to\s+the\s+editor", re.I), "letter"),
    (re.compile(r"commentary", re.I), "commentary"),
    (re.compile(r"gossip", re.I), "gossip"),
    (re.compile(r"fortuneeditorsnote|robin\s+hood\s+did", re.I), "editorial"),
    (re.compile(r"economic\s+feature|expert\s+corner|agenda", re.I), "feature"),
    (re.compile(r"maheder|movies?\s+review", re.I), "feature"),
]


def classify(source_file: str, title: str) -> str:
    """Return category slug for a post."""
    combined = f"{source_file} {title}".lower()

    for pattern, category in _RULES:
        if pattern.search(combined):
            return category

    # Standalone article .htm files in the archive root are news stories
    if source_file.lower().endswith(".htm") and "/" not in source_file.replace("\\", "/"):
        name = source_file.lower()
        if not any(
            skip in name
            for skip in (
                "index",
                "template",
                "homepage",
                "clock",
                "volume",
                "guestbook",
                "aboutus",
                "archive",
                "tender",
                "businessopportunities",
                "allcartoons",
            )
        ):
            return "news"

    return DEFAULT_CATEGORY
