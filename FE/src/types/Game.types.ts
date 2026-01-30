/**
 * Game-related TypeScript types and interfaces
 */

export type GameStatus = 'active' | 'inactive';

export type GameGenre =
    | 'Action'
    | 'Adventure'
    | 'RPG'
    | 'Strategy'
    | 'Simulation'
    | 'Sports'
    | 'Racing'
    | 'Puzzle'
    | 'Horror'
    | 'FPS'
    | 'MMO'
    | 'Indie';

export interface Game {
    id: string;
    title: string;
    genre: GameGenre;
    releaseDate: string;
    status: GameStatus;
    thumbnail: string;
    developer: string;
    publisher: string;
    description?: string;
}

export interface GameFilters {
    genre: GameGenre | 'all';
    sortBy:  'releaseDate' | 'title';
    sortOrder: 'asc' | 'desc';
}
