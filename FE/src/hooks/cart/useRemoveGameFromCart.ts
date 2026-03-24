import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cartService } from "@/service/cart.service";

export const useRemoveGameFromCart = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: cartService.removeGameFromCart,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['myCart', 'withItems'] });
        },
    });
}
