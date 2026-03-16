import apiClient from "@/lib/apiClient";
import type { GameSession } from "@/types/GameSession.types";

export const gameSessionService = {
    startPlaying: async (libraryGameId: string) => {
        const response = await apiClient.post(`/game-session/play/library-game/${libraryGameId}`);
        return response.data as GameSession;
    },
    endPlaying: async (gameSessionId: string, sessionScore: number) => {
        const response = await apiClient.patch(`/game-session/${gameSessionId}/end`, {
            session_score: sessionScore,
        });
        return response.data as GameSession;
    },
    getSessionById: async (gameSessionId: string) => {
        const response = await apiClient.get(`/game-session/${gameSessionId}`);
        return response.data as GameSession;
    },
}