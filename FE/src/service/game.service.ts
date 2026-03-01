import apiClient from "@/lib/apiClient";
import type { Game, CreateGameDTO, UpdateGameDTO } from "@/types/Game.types";

export const gameService = {
    getGames: async () => {
        const response = await apiClient.get('/games');
        return response.data as Game[];
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
}