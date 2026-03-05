import { gameService } from "@/service/game.service";
import { useQuery } from "@tanstack/react-query";
import type { Game } from "@/types/Game.types";

export const useGetGameById = (id: string | undefined) => {
    return useQuery<Game, Error>({
        queryKey: ['game', id],
        queryFn: () => gameService.getGameById(id!),
        enabled: !!id,
    });
}   