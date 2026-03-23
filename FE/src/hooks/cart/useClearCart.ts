import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cartService } from "@/service/cart.service";

export const useClearCart = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: cartService.clearCart,
        onSuccess: (updatedCart) => {
            // Immediately reflect an empty cart in cache so CartPage updates without manual refresh
            queryClient.setQueryData(['myCart', 'withItems'], () => ({
                cart: updatedCart,
                items: [],
            }));
            queryClient.invalidateQueries({ queryKey: ['myCart', 'withItems'] });
        },
    });
}
