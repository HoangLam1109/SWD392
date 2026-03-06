import apiClient from "@/lib/apiClient";
import type { CreateWalletDTO, UpdateWalletDTO, Wallet } from "@/types/Wallet.types";

/** Backend returns MongoDB shape (_id); normalize to Wallet (id) */
function toWallet(data: { _id: string; userId: string; balance: number; currency: string; status: string }): Wallet {
    return {
        id: data._id,
        userId: data.userId,
        balance: data.balance,
        currency: data.currency,
        status: data.status,
    };
}

export const walletService = {
    getWalletbyUserId: async () => {
        const response = await apiClient.get(`/web-wallets/me`);
        return toWallet(response.data as Parameters<typeof toWallet>[0]);
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
        const data = response.data as { _id: string; userId: string; balance: number; currency: string; status: string };
        return toWallet(data);
    },
};
