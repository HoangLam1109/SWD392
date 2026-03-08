import { useEffect, useState } from "react";
import { useGetCurrentUser } from "@/hooks/auth/useGetCurrentUser";
import {useGetWalletByUserId} from "@/hooks/wallet/useGetWalletByUserId";
import { useCreateWallet } from "@/hooks/wallet/useCreateWallet";
import { useUpdateWallet } from "@/hooks/wallet/useUpdateWallet";
import type { CreateWalletDTO, UpdateWalletDTO } from "@/types/Wallet.types";

const defaultForm: CreateWalletDTO = {
    userId: "",
    balance: 0,
    currency: "USD",
    status: "ACTIVED",
};

export default function WalletPage() {
    const { data: currentUser, isLoading: isLoadingUser } = useGetCurrentUser();
    const userId = currentUser?._id;
    const { data: wallet, isLoading: isLoadingWallet } = useGetWalletByUserId(userId);
    const createMutation = useCreateWallet();
    const updateMutation = useUpdateWallet();

    const [form, setForm] = useState<CreateWalletDTO>(defaultForm);

    useEffect(() => {
        if (wallet) {
            setForm({
                userId: wallet.userId,
                balance: wallet.balance,
                currency: wallet.currency,
                status: wallet.status ?? "ACTIVED",
            });
        } else if (userId) {
            setForm({ ...defaultForm, userId });
        }
    }, [wallet, userId]);
    const handleChange = <K extends keyof CreateWalletDTO>(
        key: K,
        value: CreateWalletDTO[K]
    ) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (wallet?.id) {
            const payload: UpdateWalletDTO = {
                userId: currentUser?._id,
                balance: form.balance,
                currency: form.currency,
                status: form.status,
            };
            updateMutation.mutate({ id: wallet.id, payload: payload });
        } else {
            if (!userId) return;
            const payload = {
                userId: String(userId),
                balance: Number(form.balance) ?? 0,
                currency: form.currency,
                status: form.status,
            };
            createMutation.mutate(payload, {
                onSuccess: () => setForm({ ...defaultForm, userId: String(userId) }),
            });
        }
    };

    if (isLoadingUser) {
        return (
            <div className="p-6 flex items-center justify-center">
                <p className="text-muted-foreground">Loading...</p>
            </div>
        );
    }

    if (!currentUser) {
        return (
            <div className="p-6">
                <p className="text-destructive">Please log in to view your wallet.</p>
            </div>
        );
    }

    if (isLoadingWallet) {
        return (
            <div className="p-6 flex items-center justify-center">
                <p className="text-muted-foreground">Loading wallet...</p>
            </div>
        );
    }

    const currentAmount = wallet?.balance ?? form.balance;
    const currentCurrency = wallet?.currency ?? form.currency;
    const currentStatus = wallet?.status ?? form.status;

    return (
        <div className="p-6 max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-semibold">My Wallet</h1>

            {/* Wallet summary */}
            <div className="rounded-lg border bg-card p-4 space-y-2">
                <p className="text-sm text-muted-foreground">Balance</p>
                <p className="text-2xl font-semibold">
                    {currentAmount.toLocaleString()} {currentCurrency}
                </p>
                <p className="text-sm">
                    Status:{" "}
                    <span
                        className={
                            currentStatus === "ACTIVED"
                                ? "text-green-600"
                                : "text-amber-600"
                        }
                    >
                        {currentStatus}
                    </span>
                </p>
            </div>

            {/* Create / Update form */}
            <form onSubmit={handleSubmit} className="rounded-lg border bg-card p-4 space-y-4">
                <h2 className="text-lg font-medium">
                    {wallet?.id ? "Update wallet" : "Create wallet"}
                </h2>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Amount</label>
                    <input
                        type="number"
                        min={0}
                        step="any"
                        value={form.balance}
                        onChange={(e) =>
                            handleChange("balance", Number(e.target.value) || 0)
                        }
                        className="w-full rounded-md border px-3 py-2 text-sm"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Currency</label>
                    <select
                        value={form.currency}
                        onChange={(e) => handleChange("currency", e.target.value)}
                        className="w-full rounded-md border px-3 py-2 text-sm"
                    >
                        <option value="USD">USD</option>
                        <option value="VND">VND</option>
                        <option value="EUR">EUR</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <select
                        value={form.status}
                        onChange={(e) => handleChange("status", e.target.value)}
                        className="w-full rounded-md border px-3 py-2 text-sm"
                    >
                        <option value="ACTIVED">ACTIVED</option>
                        <option value="INACTIVED">INACTIVED</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                    {wallet?.id ? "Update" : "Transaction"} wallet
                </button>
            </form>
        </div>
    );
}
