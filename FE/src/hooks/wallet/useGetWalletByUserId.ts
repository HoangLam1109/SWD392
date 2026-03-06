import { useQuery } from "@tanstack/react-query";
import { walletService } from "@/service/wallet.service";
import type { Wallet } from "@/types/Wallet.types";

export const useGetWalletByUserId = () => {
    return useQuery<Wallet, Error>({
        queryKey: ["web-wallets", "me"],
        queryFn: () => walletService.getWalletbyUserId(),
        enabled: !!localStorage.getItem("token"),
    });
};
