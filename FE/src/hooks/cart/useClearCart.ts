import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cartService } from "@/service/cart.service";
import { toast } from "sonner";
import type { CartResponse } from "@/types/Cart.types";

export const useClearCart = () => {
    const queryClient = useQueryClient();

    return useMutation<CartResponse, Error, void>({
        mutationFn: cartService.clearCart,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
            queryClient.invalidateQueries({ queryKey: ['cart-items'] });
            toast.success('Cart cleared successfully');
        },
        onError: (error) => {
            console.error('Error clearing cart:', error);
            toast.error('Failed to clear cart');
        },
    });
};
