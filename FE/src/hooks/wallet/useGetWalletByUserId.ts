import { useQuery } from "@tanstack/react-query";
import { walletService } from "@/service/wallet.service";
import type { Wallet } from "@/types/Wallet.types";
import { useAuth } from "../auth/useAuth";
export const useGetWalletByUserId = () => {
    const { isAuthenticated } = useAuth();
    return useQuery<Wallet, Error>({
        queryKey: ["web-wallets", "me"],
        queryFn: () => walletService.getWalletbyUserId(),
        enabled: !!isAuthenticated,
    });
};
