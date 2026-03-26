export interface Game {
    _id: string;
    title: string;
    price: number;
    isActive: boolean;
    description?: string;
    discount?: number;
    thumbnail?: string;
    coverImage?: string;
    developer?: string;
    publisher?: string;
    releaseDate?: string;
    url?: string;
    categoryId?: string;
}
export type CreateGameDTO = Partial<Game>;
export type UpdateGameDTO = Partial<CreateGameDTO>;

export interface GamesPaginatedResponse {
    data: Game[];
    hasNextPage: boolean;
    totalCount?: number;
    nextCursor?: string;
}

