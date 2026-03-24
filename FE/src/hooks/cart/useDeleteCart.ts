import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cartService } from "@/service/cart.service";

export const useDeleteCart = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: cartService.deleteCart,
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['cart', id] });
            queryClient.invalidateQueries({ queryKey: ['carts'] });
            queryClient.invalidateQueries({ queryKey: ['myCart'] });
        },
    });
}
