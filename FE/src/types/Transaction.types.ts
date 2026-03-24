export interface Transaction {
    id?: string;
    walletId: string;
    type: string;
    amount: number;
    balanceBefore: number;
    balanceAfter: number;
    description: string;
    refId: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}