import { useMutation, useQuery } from "@tanstack/react-query";
import { gameSessionService } from "@/service/game-session.service";
import type { GameSession } from "@/types/GameSession.types";

export const useStartPlaying = () => {
    return useMutation<GameSession, Error, string>({
        mutationFn: gameSessionService.startPlaying,
    });
};

export const useEndPlaying = () => {
    return useMutation<GameSession, Error, { gameSessionId: string; sessionScore: number }>({
        mutationFn: ({ gameSessionId, sessionScore }) =>
            gameSessionService.endPlaying(gameSessionId, sessionScore),
    });
};

export const useGetSessionById = (gameSessionId: string) => {
    return useQuery<GameSession, Error, string>({
        queryKey: ['game-session', gameSessionId],
        queryFn: () => gameSessionService.getSessionById(gameSessionId),
    });
};
