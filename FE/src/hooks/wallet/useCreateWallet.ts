import { walletService } from "@/service/wallet.service";
import type { CreateWalletDTO } from "@/types/Wallet.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Wallet } from "@/types/Wallet.types";
export const useCreateWallet = () => {
    const queryClient = useQueryClient();
    return useMutation<Wallet, Error, CreateWalletDTO>({
        mutationFn: walletService.createWallet,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['web-wallets'] });
            toast.success('Wallet created successfully');
        },
        onError: (error) => {
            console.error('Error creating wallet:', error);
            toast.error('Error creating wallet');
        },
    });
}   