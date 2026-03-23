import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetCurrentUser } from "@/hooks/auth/useGetCurrentUser";
import { useGetWalletByUserId } from "@/hooks/wallet/useGetWalletByUserId";
import { useDepositToWallet } from "@/hooks/transaction/useDepositToWallet";
import { useCreateVNpayPaymentTransaction } from "@/hooks/payment/useCreateVNpayPaymentTransaction";
import type { CreateWalletDTO } from "@/types/Wallet.types";
const defaultForm: CreateWalletDTO = {
    userId: "",
    balance: 0,
    currency: "VND",
    status: "ACTIVED",
};

const PRESET_AMOUNTS = [50_000, 100_000, 200_000, 500_000, 1_000_000,5_000_000,10_000_000];

export default function WalletPage() {
    const navigate = useNavigate();
    const { data: currentUser, isLoading: isLoadingUser } = useGetCurrentUser();
    const userId = currentUser?._id;
    const { data: wallet, isLoading: isLoadingWallet } = useGetWalletByUserId();
    const depositToWalletMutation = useDepositToWallet();
    const createVNpayPaymentTransactionMutation =
        useCreateVNpayPaymentTransaction();
    const [form, setForm] = useState<CreateWalletDTO>(defaultForm);
    /** Số tiền chọn để nạp (mệnh giá), dùng khi bấm "Nạp tiền qua VNPay" */
    const [depositAmount, setDepositAmount] = useState(0);

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

    /** Chọn mệnh giá chỉ cập nhật số tiền nạp, chưa gọi API */
    const handlePresetAmount = (amount: number) => {
        setDepositAmount(amount);
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
    /** Tạo transaction PENDING, lấy URL VNPay rồi chuyển hướng */
    const handleVNPayDeposit = async () => {
        const amount = depositAmount;
        if (amount <= 0) return;
        try {
            const transaction = await depositToWalletMutation.mutateAsync({
                amount,
            });
            const transactionId =
                (transaction as { _id?: string })._id ?? transaction.id;
            if (!transactionId) {
                console.error("No transaction ID returned");
                return;
            }
            const result =
                await createVNpayPaymentTransactionMutation.mutateAsync({
                    transactionId,
                    amount,
                });
            if (result?.redirectUrl) {
                window.location.href = result.redirectUrl;
            }
        } catch (error) {
            console.error(error);
        }
    };
    const currentAmount = wallet?.balance ?? form.balance;
    const currentCurrency = wallet?.currency ?? form.currency;
    const currentStatus = wallet?.status ?? form.status;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 p-6">
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">My Wallet</h1>
                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                        Go to Home
                    </button>
                </div>

            {/* Wallet summary */}
            <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-2 shadow-sm">
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

            {/* Preset amounts */}
            <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-3 shadow-sm">
                <p className="text-sm font-medium text-slate-700">
                    Chọn mệnh giá nạp nhanh
                </p>
                <div className="flex flex-wrap gap-2">
                    {PRESET_AMOUNTS.map((amount) => (
                        <button
                            key={amount}
                            type="button"
                            onClick={() => handlePresetAmount(amount)}
                            disabled={
                                depositToWalletMutation.isPending ||
                                createVNpayPaymentTransactionMutation.isPending
                            }
                            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50
                                ${
                                    depositAmount === amount
                                        ? "border-sky-500 bg-sky-50 text-sky-700"
                                        : "border border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100"
                                }`}
                        >
                            {amount >= 1_000_000
                                ? `${amount / 1_000_000}M`
                                : `${amount / 1_000}k`}{" "}
                            VND
                        </button>
                    ))}
                </div>
            </div>

            {/* Create / Update form */}
            <form className="rounded-lg border border-slate-200 bg-white p-4 space-y-4 shadow-sm">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Số tiền nạp (VND)</label>
                    <input
                        type="number"
                        min={0}
                        step="any"
                        value={depositAmount || ""}
                        onChange={(e) =>
                            setDepositAmount(Number(e.target.value) || 0)
                        }
                        placeholder="Chọn mệnh giá hoặc nhập số tiền"
                        className="w-full rounded-md border px-3 py-2 text-sm"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Currency</label>
                    <div
                        className="w-full rounded-md border px-3 py-2 text-sm"
                    >
                        <option value="VND">VND</option>
                    </div>
                </div>

               

                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={handleVNPayDeposit}
                        disabled={
                            depositAmount <= 0 ||
                            depositToWalletMutation.isPending ||
                            createVNpayPaymentTransactionMutation.isPending
                        }
                        className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                    >
                        Nạp tiền qua VNPay
                    </button>
                </div>
            </form>
            </div>
        </div>
    );
}
