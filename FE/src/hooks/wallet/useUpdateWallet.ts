import { walletService } from "@/service/wallet.service";
import type { UpdateWalletDTO } from "@/types/Wallet.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Wallet } from "@/types/Wallet.types";

export const useUpdateWallet = () => {
    const queryClient = useQueryClient();
    return useMutation<Wallet, Error, { id: string; payload: UpdateWalletDTO }>({
        mutationFn: ({ id, payload }) => walletService.updateWallet(id, payload),
        onSuccess: (updatedWallet) => {
            queryClient.invalidateQueries({ queryKey: ['web-wallets'] });
            queryClient.setQueryData(['web-wallets', 'me'], updatedWallet);
            toast.success('Wallet updated successfully');
        },
        onError: (error) => {
            console.error('Error updating wallet:', error);
            toast.error('Error updating wallet');
        },
    });
}   