import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cartService } from "@/service/cart.service";

export const useAddGameToCart = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: cartService.addGameToCart,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['myCart'] });
        },
    });
}
