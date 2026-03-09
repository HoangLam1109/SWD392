import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cartItemService } from "@/service/cart-item.service";

export const useDeleteCartItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: cartItemService.deleteCartItem,
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['cartItem', id] });
            queryClient.invalidateQueries({ queryKey: ['cartItems'] });
        },
    });
}
