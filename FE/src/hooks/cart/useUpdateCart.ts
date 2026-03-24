import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cartService } from "@/service/cart.service";
import type { UpdateCartDTO } from "@/types/Cart.types";

export const useUpdateCart = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateCartDTO }) =>
            cartService.updateCart(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['cart', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['carts'] });
            queryClient.invalidateQueries({ queryKey: ['myCart'] });
        },
    });
}
