import apiClient from "@/lib/apiClient";
import type { CreateWalletDTO, UpdateWalletDTO, Wallet } from "@/types/Wallet.types";

export const walletService = {
    getWalletbyUserId: async (userId: string) => {
        const response = await apiClient.get(`/web-wallet/user/${userId}`);
        return response.data as Wallet;

    },
    createWallet: async (payload: CreateWalletDTO) => {
        const response = await apiClient.post("/web-wallets", {
            userId: payload.userId,
            balance: payload.balance,
            currency: payload.currency,
            status: payload.status,
        });
        return response.data as CreateWalletDTO;
    },
    updateWallet: async (id: string, payload: UpdateWalletDTO) => {
        const response = await apiClient.patch(`/web-wallets/${id}`, {
            balance: payload.balance,
            currency: payload.currency,
            status: payload.status,
        });
        const data = response.data ;
        return {
            id: data._id,
            userId: data.userId,
            amount: data.balance,
            currency: data.currency,
            status: data.status,
        }
    },
};
