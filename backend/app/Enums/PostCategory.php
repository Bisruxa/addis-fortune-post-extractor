<?php

namespace App\Enums;

/**
 * Category slugs used by the Python parser and API filters.
 * Inferred from Addis Fortune Vol 7 No 364 file/title patterns.
 */
enum PostCategory: string
{
    case News = 'news';
    case Opinion = 'opinion';
    case Interview = 'interview';
    case Cartoon = 'cartoon';
    case Editorial = 'editorial';
    case NewsInBrief = 'news_in_brief';
    case RestaurantReview = 'restaurant_review';
    case Viewpoint = 'viewpoint';
    case ViewFromArada = 'view_from_arada';
    case LifeMatters = 'life_matters';
    case Letter = 'letter';
    case Commentary = 'commentary';
    case Feature = 'feature';
    case Gossip = 'gossip';
    case Other = 'other';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
