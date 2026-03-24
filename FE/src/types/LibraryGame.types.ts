import type { Game } from './Game.types';

export const LibraryGameStatus = {
    OWNED: 'OWNED',
    PLAYING: 'PLAYING',
    COMPLETED: 'COMPLETED',
    DROPPED: 'DROPPED',
} as const;

export type LibraryGameStatus =
    (typeof LibraryGameStatus)[keyof typeof LibraryGameStatus];

export interface LibraryGameRecord {
    _id: string;
    user_id: string;
    game_id: string;
    key_id?: string;
    highest_score: number;
    total_playtime: number;
    last_played_at?: string;
    acquired_at?: string;
    status: LibraryGameStatus;
    created_at: string;
    updated_at: string;
}

export interface LibraryGamesResponse {
    data: LibraryGameRecord[];
    hasNextPage: boolean;
    totalCount?: number;
    nextCursor?: string;
}

export interface LibraryGameQueryParams {
    userId?: string;
    limit?: number;
    cursor?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export type LibrarySortBy = 'title' | 'releaseDate';

export interface LibraryFilters {
    category: string | 'all';
    sortBy: LibrarySortBy;
    sortOrder: 'asc' | 'desc';
}

export type LibraryGameApiGame = Game & {
    id?: string;
    categoryId?: string;
};

export interface LibraryGameView {
    id: string;
    libraryGameId: string;
    gameId: string;
    title: string;
    /** Category name from backend (preferred for filtering) */
    categoryName?: string;
    /** Fallback genre field for backward compatibility */
    genre?: string;
    thumbnail?: string;
    description?: string;
    developer?: string;
    publisher?: string;
    releaseDate?: string;
    url?: string;
    price?: number;
    discount?: number;
    isActive?: boolean;
    status: LibraryGameStatus;
    highestScore: number;
    totalPlaytime: number;
    lastPlayedAt?: string;
    acquiredAt?: string;
}
