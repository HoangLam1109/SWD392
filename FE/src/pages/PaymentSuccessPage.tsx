import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/home";
import { CheckCircle2, ArrowRight, ShoppingBag, Library, AlertCircle } from "lucide-react";

export default function PaymentSuccessPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
    const orderId = params.get("orderId");
    const walletId = params.get("walletId");

    const goToStore = () => navigate("/store");
    const goToLibrary = () => navigate("/library");

    const subtitle = walletId
        ? "Your wallet has been topped up successfully."
        : "Your order has been paid successfully.";

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <div className="fixed inset-0 bg-linear-to-br from-blue-950/30 via-slate-950 to-purple-950/30 pointer-events-none" />
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.12),transparent_55%)] pointer-events-none" />

            <Navbar />

            <main className="relative w-full px-4 sm:px-6 lg:px-8 py-12">
                <div className="max-w-3xl mx-auto">
                    <div className="backdrop-blur-xl bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-8 sm:p-10 shadow-xl">
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="h-16 w-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                <CheckCircle2 className="h-10 w-10 text-emerald-400" />
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold mb-1">
                                    Payment successful
                                </h1>
                                <p className="text-slate-300 text-sm sm:text-base">
                                    {subtitle}
                                </p>
                            </div>

                            {orderId && (
                                <div className="mt-3 px-4 py-2 rounded-xl bg-slate-900/60 border border-emerald-500/30 text-xs sm:text-sm text-slate-200 font-mono max-w-full break-all">
                                    <span className="text-slate-400 mr-2">Order ID:</span>
                                    {orderId}
                                </div>
                            )}

                            {walletId && (
                                <div className="mt-1 px-4 py-2 rounded-xl bg-slate-900/60 border border-emerald-500/30 text-xs sm:text-sm text-slate-200 font-mono max-w-full break-all">
                                    <span className="text-slate-400 mr-2">Wallet ID:</span>
                                    {walletId}
                                </div>
                            )}

                            {!orderId && !walletId && (
                                <div className="mt-2 flex items-center gap-2 text-xs text-amber-300">
                                    <AlertCircle className="h-4 w-4" />
                                    <span>
                                        Payment completed, but order information could not be identified.
                                    </span>
                                </div>
                            )}

                            <div className="mt-6 flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center">
                                <button
                                    type="button"
                                    onClick={goToLibrary}
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-emerald-500 to-lime-500 hover:from-emerald-400 hover:to-lime-400 text-slate-950 font-semibold shadow-lg hover:shadow-xl transition-all"
                                >
                                    <Library className="h-5 w-5" />
                                    <span>Go to Library</span>
                                    <ArrowRight className="h-4 w-4" />
                                </button>

                                <button
                                    type="button"
                                    onClick={goToStore}
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/20 hover:bg-white/5 text-sm font-medium transition-colors"
                                >
                                    <ShoppingBag className="h-5 w-5" />
                                    <span>Back to Store</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

