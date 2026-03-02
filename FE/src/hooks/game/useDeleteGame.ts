import { useMutation, useQueryClient } from "@tanstack/react-query";
import { gameService } from "@/service/game.service";
import { toast } from "sonner";

export const useDeleteGame = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => gameService.deleteGame(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['games'] });
            toast.success('Game deleted successfully');  
        },
        onError: (error) => {
            console.error('Error deleting game:', error);
            toast.error('Error deleting game: ' + error.message);
        },
    });
};