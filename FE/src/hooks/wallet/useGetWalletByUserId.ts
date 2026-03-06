import { useQuery } from "@tanstack/react-query";
import { walletService } from "@/service/wallet.service";
import type { Wallet } from "@/types/Wallet.types";

export const useGetWalletByUserId = (userId: string | undefined) => {
    return useQuery<Wallet, Error>({
        queryKey: ["web-wallets", "me", userId],
        queryFn: () => walletService.getWalletbyUserId(userId!),
        enabled: !!userId && !!localStorage.getItem("token"),
    });
};
