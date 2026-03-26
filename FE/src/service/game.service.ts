import apiClient from "@/lib/apiClient";
import type {
    Game,
    CreateGameDTO,
    UpdateGameDTO,
    GamesPaginatedResponse,
} from "@/types/Game.types";

function parseGamesPaginatedBody(
    raw: unknown,
): Pick<GamesPaginatedResponse, "data" | "hasNextPage" | "totalCount" | "nextCursor"> {
    const body = raw as {
        data?: Game[];
        hasNextPage?: boolean;
        totalCount?: number;
        nextCursor?: string;
    } | Game[];
    if (Array.isArray(body)) {
        return { data: body, hasNextPage: false, totalCount: body.length };
    }
    return {
        data: body.data ?? [],
        hasNextPage: body.hasNextPage ?? false,
        totalCount: body.totalCount,
        nextCursor: body.nextCursor,
    };
}

export const gameService = {
    /** Full list for store/catalog (single request, high limit). */
    getGames: async () => {
        const response = await apiClient.get("/games?limit=500");
        const { data } = parseGamesPaginatedBody(response.data);
        return data;
    },

    getGamesPaginated: async (params: {
        cursor?: string;
        limit?: number;
        search?: string;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
    }): Promise<GamesPaginatedResponse> => {
        const { cursor, limit = 10, search, sortBy, sortOrder } = params;
        const searchParams = new URLSearchParams({
            limit: String(limit),
            ...(cursor && { cursor }),
            ...(search?.trim() && { search: search.trim(), searchField: "title" }),
            ...(sortBy && { sortBy }),
            ...(sortOrder && { sortOrder }),
        });
        const response = await apiClient.get(`/games?${searchParams.toString()}`);
        const parsed = parseGamesPaginatedBody(response.data);
        return {
            data: parsed.data,
            hasNextPage: parsed.hasNextPage,
            totalCount: parsed.totalCount,
            nextCursor: parsed.nextCursor,
        };
    },
    createGame: async (data: CreateGameDTO) => {
        const response = await apiClient.post('/games', data);
        return response.data as Game;
    },
    updateGame: async (id: string, data: UpdateGameDTO) => {
        const response = await apiClient.patch(`/games/${id}`, data);
        return response.data as Game;
    },
    deleteGame: async (id: string) => {
        const response = await apiClient.delete(`/games/${id}`);
        return response.data as Game;
    },
    getGameById: async (id: string) => {
        const response = await apiClient.get(`/games/${id}`);
        const body = response.data as { data?: Game } | Game;
        return (body as { data?: Game }).data ?? (body as Game);
    },
}