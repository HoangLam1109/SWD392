import { useMutation } from "@tanstack/react-query";
import { gameService } from "@/service/game.service";
import type { Game } from "@/types/Game.types";

export const useCreateGame=() =>{
    return useMutation<Game, Error, Game>({
        mutationFn: gameService.createGame,
    });
}