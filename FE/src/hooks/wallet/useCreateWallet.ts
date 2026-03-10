import { walletService } from "@/service/wallet.service";
import type { CreateWalletDTO, Wallet } from "@/types/Wallet.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreateWallet = () => {
    const queryClient = useQueryClient();
    return useMutation<Wallet, Error, CreateWalletDTO>({
        mutationFn: walletService.createWallet,
        onSuccess: (data, variables) => {
            // Cập nhật luôn cache cho query wallet của user hiện tại
            queryClient.setQueryData(
                ["web-wallets", "me", variables.userId],
                data,
            );
            // Và invalid lại mọi query liên quan tới web-wallets nếu có
            queryClient.invalidateQueries({ queryKey: ["web-wallets"] });
            toast.success("Wallet created successfully");
        },
        onError: (error) => {
            console.error("Error creating wallet:", error);
            toast.error("Error creating wallet");
        },
    });
};