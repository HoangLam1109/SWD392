import apiClient from "@/lib/apiClient";
import type { Transaction } from "@/types/Transaction.types";
export const transactionService = {
    getTransactions: async (): Promise<Transaction[]> => {
        const response = await apiClient.get('/transactions');
        return response.data as Transaction[];
    },
    createTransaction: async (transaction: Transaction): Promise<Transaction> => {
        const response = await apiClient.post('/transactions', transaction);
        return response.data as Transaction;
    },
    depositToWallet: async (amount: number): Promise<Transaction> => {
        const response = await apiClient.post('/transactions/deposit', { amount });
        return response.data as Transaction;
    }
};