import { useMutation, useQueryClient } from "@tanstack/react-query";
import { gameService } from "@/service/game.service";
import { toast } from "sonner";
import type { Game, UpdateGameDTO } from "@/types/Game.types";

export const useUpdateGame = () => {
    const queryClient = useQueryClient();

    return useMutation<Game, Error, { id: string; data: UpdateGameDTO }>({
        mutationFn: ({ id, data }) => gameService.updateGame(id, data),
        onSuccess: (updatedGame) => {
            queryClient.invalidateQueries({ queryKey: ['games'] });
            queryClient.setQueryData(
                ['game', updatedGame._id],
                updatedGame
            );
            toast.success("Game updated successfully");
        },
        onError: (error) => {
            console.error('Error updating game:', error);
            toast.error("Update failed");
        }
    });
};