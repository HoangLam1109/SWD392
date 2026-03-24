import { useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionService } from "@/service/transaction.service";
import type { Transaction } from "@/types/Transaction.types";
import { toast } from "sonner";

export const useDepositToWallet = () => {
    const queryClient = useQueryClient();
    return useMutation<Transaction, Error, { amount: number }>({
        mutationFn: ({ amount }) => transactionService.depositToWallet(amount),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            queryClient.setQueryData(['transactions'], data);
            toast.success('Deposit to wallet successfully');
        },
        onError: (error) => {
            console.error('Error depositing to wallet:', error);
            toast.error('Error depositing to wallet');
        },
        });
};  