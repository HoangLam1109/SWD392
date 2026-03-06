import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cartService } from "@/service/cart.service";
import { toast } from "sonner";
import type { CartResponse } from "@/types/Cart.types";

export const useAddToCart = () => {
    const queryClient = useQueryClient();

    return useMutation<CartResponse, Error, string>({
        mutationFn: (gameId: string) => cartService.addToCart(gameId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
            queryClient.invalidateQueries({ queryKey: ['cart-items'] });
            toast.success('Item added to cart');
        },
        onError: (error) => {
            console.error('Error adding to cart:', error);
            toast.error('Failed to add item to cart');
        },
    });
};
