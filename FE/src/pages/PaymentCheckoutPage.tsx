import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Navbar } from "@/components/home";
import { useGetOrderById } from "@/hooks/order/useGetOrderById";
import { useCancelOrder } from "@/hooks/order/useCancelOrder";
import type { VNPayPayment } from "@/types/Payment.types";
import { Check, CreditCard, Wallet, ArrowLeft } from "lucide-react";
import { useCreateVnpayUrl } from "@/hooks/payment/useCreateVnpayUrl";

interface LocationState {
    order?: {
        _id: string;
        totalPrice: number;
        paymentStatus?: string;
    };
}

export default function PaymentCheckoutPage() {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const locationState = (location.state as LocationState | null) || null;

    const [isRedirecting, setIsRedirecting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const cancelOrderMutation = useCancelOrder();
    const createVnpayUrlMutation = useCreateVnpayUrl();
    const { data: fetchedOrder, isLoading } = useGetOrderById(
        orderId,
        !locationState?.order
    );

    const order = locationState?.order || fetchedOrder;

    const handleBackToCart = () => {
        if (order?._id && order.paymentStatus !== "COMPLETED") {
            cancelOrderMutation.mutate(order._id, {
                onSettled: () => navigate("/cart"),
            });
        } else {
            navigate("/cart");
        }
    };

    const handlePayWithVnPay = async () => {
        if (!order) return;
        try {
            setIsRedirecting(true);
            setError(null);

            const payload: VNPayPayment = {
                orderId: order._id,
                totalPrice: order.totalPrice,
            };

            const result = await createVnpayUrlMutation.mutateAsync(payload);
            if (result?.redirectUrl) {
                window.location.href = result.redirectUrl;
            } else {
                setError("Cannot create VNPay payment URL.");
                setIsRedirecting(false  );
            }
        } catch (e) {
            console.error(e);
            setError("Failed to create VNPay payment URL.");
            setIsRedirecting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <div className="fixed inset-0 bg-linear-to-br from-blue-950/30 via-slate-950 to-purple-950/30 pointer-events-none" />
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)] pointer-events-none" />

            <Navbar />

            <main className="relative w-full px-4 sm:px-6 lg:px-8 py-10">
                <button
                    onClick={handleBackToCart}
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to cart</span>
                </button>

                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                <Check className="h-5 w-5 text-emerald-400" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">Checkout successful</h1>
                                <p className="text-slate-400 text-sm">
                                    Review your order information and choose a payment method.
                                </p>
                            </div>
                        </div>

                        {isLoading && !order && (
                            <p className="text-slate-400 text-sm">Loading order information...</p>
                        )}

                        {!isLoading && !order && (
                            <p className="text-red-400 text-sm">
                                Cannot load order information. Please go back to cart and try again.
                            </p>
                        )}

                        {order && (
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-3">
                                    <h2 className="text-lg font-semibold">Order information</h2>
                                    <div className="space-y-2 text-sm text-slate-300">
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Order ID</span>
                                            <span className="font-mono text-xs sm:text-sm">
                                                {order._id}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Total price</span>
                                            <span className="font-semibold text-white">
                                                ${order.totalPrice?.toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Payment status</span>
                                            <span className="font-medium text-amber-300">
                                                {order.paymentStatus || "PENDING"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h2 className="text-lg font-semibold">Payment methods</h2>
                                    <div className="space-y-3">
                                        <button
                                            type="button"
                                            onClick={handlePayWithVnPay}
                                            disabled={isRedirecting}
                                            className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                                        >
                                            <div className="flex items-center gap-3">
                                                <CreditCard className="h-5 w-5" />
                                                <div className="text-left">
                                                    <div className="text-sm font-semibold">
                                                        Pay with VNPay
                                                    </div>
                                                    <div className="text-xs text-slate-100/80">
                                                        Secure online payment via VNPay gateway.
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="text-sm font-medium">
                                                {isRedirecting ? "Redirecting..." : "Continue"}
                                            </span>
                                        </button>

                                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-300">
                                            <Wallet className="h-5 w-5 text-slate-300" />
                                            <span>
                                                Other payment methods can be added here in the future
                                                (e.g. wallet, card, etc.).
                                            </span>
                                        </div>

                                        {error && (
                                            <p className="text-sm text-red-400">
                                                {error}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

