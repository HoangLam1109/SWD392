import type { Game } from "@/types/Game.types";
import { useQuery } from "@tanstack/react-query";
import { gameService } from "@/service/game.service";

export const useGetGames= () => {
    return useQuery<Game[], Error>({
        queryKey: ['games'],
        queryFn: gameService.getGames,
    });
}