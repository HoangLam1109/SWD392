import { Footer, Navbar } from "@/components/home";
import { useGetCurrentUser } from "@/hooks/auth/useGetCurrentUser";
import { useGetOrderByUserId } from "@/hooks/order/useGetOrderByUserId";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { CheckCircle2, Clock3, CreditCard, History, XCircle } from "lucide-react";
import { Link } from "react-router-dom";

type HistoryOrder = {
    _id: string;
    totalPrice: number;
    paymentStatus: "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED";
    created_at?: string;
    completedAt?: string;
};

const statusClasses: Record<HistoryOrder["paymentStatus"], string> = {
    PENDING: "bg-amber-500/10 text-amber-300 border border-amber-500/20",
    COMPLETED: "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20",
    FAILED: "bg-red-500/10 text-red-300 border border-red-500/20",
    CANCELLED: "bg-slate-500/10 text-slate-300 border border-slate-500/20",
};

const formatDate = (value?: string) => {
    if (!value) return "--";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "--";

    return date.toLocaleString("vi-VN");
};

export default function TransactionHistoryPage() {
    const { data: currentUser, isLoading: isLoadingUser } = useGetCurrentUser();
    const userId = currentUser?._id;
    const { data, isLoading: isLoadingOrders } = useGetOrderByUserId(userId, !!userId);

    const orders: HistoryOrder[] = Array.isArray(data)
        ? [...data].sort((a, b) => {
            const left = new Date(b.created_at ?? b.completedAt ?? 0).getTime();
            const right = new Date(a.created_at ?? a.completedAt ?? 0).getTime();
            return left - right;
        })
        : [];

    const totalOrders = orders.length;
    const completedOrders = orders.filter((order) => order.paymentStatus === "COMPLETED").length;
    const pendingOrders = orders.filter((order) => order.paymentStatus === "PENDING").length;

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <div className="fixed inset-0 bg-linear-to-br from-blue-950/30 via-slate-950 to-purple-950/30 pointer-events-none" />
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)] pointer-events-none" />

            <Navbar />

            <main className="relative max-w-[1400px] mx-auto px-4 py-10 sm:px-6 lg:px-8">
                <section className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div className="space-y-3">
                            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
                                <History className="h-4 w-4" />
                                Transaction History
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold sm:text-4xl">Lich su giao dich</h1>
                                <p className="mt-2 max-w-2xl text-sm text-slate-400 sm:text-base">
                                    Theo doi cac don hang, trang thai thanh toan va quay lai thanh toan cho nhung giao dich dang cho xu ly.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                                <p className="text-sm text-slate-400">Tong giao dich</p>
                                <p className="mt-2 text-2xl font-bold">{totalOrders}</p>
                            </div>
                            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                                <p className="text-sm text-emerald-300/80">Da thanh toan</p>
                                <p className="mt-2 text-2xl font-bold text-emerald-300">{completedOrders}</p>
                            </div>
                            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
                                <p className="text-sm text-amber-300/80">Dang xu ly</p>
                                <p className="mt-2 text-2xl font-bold text-amber-300">{pendingOrders}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {isLoadingUser && (
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-slate-400 backdrop-blur-xl">
                        Dang tai thong tin nguoi dung...
                    </div>
                )}

                {!isLoadingUser && !currentUser && (
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl">
                        <p className="text-lg font-semibold">Vui long dang nhap de xem lich su giao dich.</p>
                        <Link
                            to="/login"
                            className="mt-4 inline-flex items-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
                        >
                            Dang nhap
                        </Link>
                    </div>
                )}

                {!isLoadingUser && currentUser && isLoadingOrders && (
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-slate-400 backdrop-blur-xl">
                        Dang tai lich su giao dich...
                    </div>
                )}

                {!isLoadingUser && currentUser && !isLoadingOrders && orders.length === 0 && (
                    <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-10 text-center backdrop-blur-xl">
                        <History className="mx-auto h-12 w-12 text-slate-500" />
                        <h2 className="mt-4 text-xl font-semibold">Chua co giao dich nao</h2>
                        <p className="mt-2 text-slate-400">
                            Cac don hang cua ban se xuat hien tai day sau khi mua game.
                        </p>
                        <Link
                            to="/store"
                            className="mt-6 inline-flex items-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-slate-200"
                        >
                            Den cua hang
                        </Link>
                    </div>
                )}

                {!isLoadingUser && currentUser && !isLoadingOrders && orders.length > 0 && (
                    <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
                        <div className="border-b border-white/10 px-6 py-5">
                            <h2 className="text-xl font-semibold">Danh sach giao dich</h2>
                            <p className="mt-1 text-sm text-slate-400">
                                Xem lai trang thai thanh toan va tiep tuc thanh toan neu don hang van dang cho xu ly.
                            </p>
                        </div>

                        <div className="px-4 py-4 sm:px-6">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-white/10 hover:bg-transparent">
                                        <TableHead className="text-slate-300">Ma don hang</TableHead>
                                        <TableHead className="text-slate-300">Ngay tao</TableHead>
                                        <TableHead className="text-slate-300">Hoan tat</TableHead>
                                        <TableHead className="text-slate-300">Tong tien</TableHead>
                                        <TableHead className="text-slate-300">Trang thai</TableHead>
                                        <TableHead className="text-right text-slate-300">Thao tac</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orders.map((order) => {
                                        const isPending = order.paymentStatus === "PENDING";

                                        return (
                                            <TableRow key={order._id} className="border-white/10 hover:bg-white/5">
                                                <TableCell className="max-w-[180px] truncate font-mono text-xs text-slate-300 sm:text-sm">
                                                    {order._id}
                                                </TableCell>
                                                <TableCell className="text-slate-300">
                                                    {formatDate(order.created_at)}
                                                </TableCell>
                                                <TableCell className="text-slate-300">
                                                    {formatDate(order.completedAt)}
                                                </TableCell>
                                                <TableCell className="font-semibold text-white">
                                                    {order.totalPrice.toLocaleString("vi-VN")} VND
                                                </TableCell>
                                                <TableCell>
                                                    <span
                                                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[order.paymentStatus]}`}
                                                    >
                                                        {order.paymentStatus === "COMPLETED" && <CheckCircle2 className="h-3.5 w-3.5" />}
                                                        {order.paymentStatus === "PENDING" && <Clock3 className="h-3.5 w-3.5" />}
                                                        {(order.paymentStatus === "FAILED" || order.paymentStatus === "CANCELLED") && (
                                                            <XCircle className="h-3.5 w-3.5" />
                                                        )}
                                                        {order.paymentStatus}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {isPending ? (
                                                        <Link
                                                            to={`/payment/checkout/${order._id}`}
                                                            state={{ order }}
                                                            className="inline-flex items-center gap-2 rounded-xl border border-blue-500/20 bg-blue-500/10 px-3 py-2 text-xs font-semibold text-blue-300 transition-colors hover:bg-blue-500/20"
                                                        >
                                                            <CreditCard className="h-4 w-4" />
                                                            Tiep tuc thanh toan
                                                        </Link>
                                                    ) : (
                                                        <span className="text-sm text-slate-500">--</span>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </section>
                )}
            </main>

            <Footer />
        </div>
    );
}
