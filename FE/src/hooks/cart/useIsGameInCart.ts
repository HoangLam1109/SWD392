import { useGetMyCartWithItems } from './useGetMyCartWithItems';

export const useIsGameInCart = (productId?: string) => {
    const { data, isLoading } = useGetMyCartWithItems();
    
    if (!productId || !data) {
        return { isInCart: false, isLoading };
    }

    const isInCart = data.items.some(item => item.productId === productId);
    
    return { isInCart, isLoading };
};
