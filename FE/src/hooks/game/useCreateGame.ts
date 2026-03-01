import { useMutation, useQueryClient } from "@tanstack/react-query";
import { gameService } from "@/service/game.service";
import { toast } from "sonner";
import type { Game, CreateGameDTO } from "@/types/Game.types";

export const useCreateGame = () => {
    const queryClient = useQueryClient();

    return useMutation<Game, Error, CreateGameDTO>({
        mutationFn: gameService.createGame,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['games'] });
            toast.success('Game created successfully');
        },
        onError: (error) => {
            console.error('Error creating game:', error);
            toast.error('Error creating game');
        },
    });
};