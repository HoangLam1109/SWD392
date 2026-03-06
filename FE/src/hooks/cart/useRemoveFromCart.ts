import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cartService } from "@/service/cart.service";
import { toast } from "sonner";
import type { CartResponse } from "@/types/Cart.types";

export const useRemoveFromCart = () => {
    const queryClient = useQueryClient();

    return useMutation<CartResponse, Error, string>({
        mutationFn: (gameId: string) => cartService.removeFromCart(gameId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
            queryClient.invalidateQueries({ queryKey: ['cart-items'] });
            toast.success('Item removed from cart');
        },
        onError: (error) => {
            console.error('Error removing from cart:', error);
            toast.error('Failed to remove item from cart');
        },
    });
};
