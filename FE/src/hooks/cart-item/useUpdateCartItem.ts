import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cartItemService } from "@/service/cart-item.service";
import type { UpdateCartItemDTO } from "@/types/Cart.types";

export const useUpdateCartItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateCartItemDTO }) =>
            cartItemService.updateCartItem(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['cartItem', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['cartItems'] });
        },
    });
}
