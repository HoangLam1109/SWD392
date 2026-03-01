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
}

/** Payload for creating a game. title, price, isActive required; rest optional. */
export interface CreateGameDTO {
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
}

export type UpdateGameDTO = Partial<CreateGameDTO>;
