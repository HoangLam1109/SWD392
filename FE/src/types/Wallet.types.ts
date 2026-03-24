export interface Wallet {
    id:string;
    userId: string;
    balance: number;
    currency: string;
    status: string;
}
export type CreateWalletDTO = Omit<Wallet, 'id' >;
export type UpdateWalletDTO = Partial<Omit<Wallet, 'id' >>;