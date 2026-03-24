import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useGetOrderDetailsByOrderId } from '@/hooks/order-detail/useGetOrderDetailsByOrderId';
import type { Order, PaymentStatus } from '@/types/Orders.types';
import { PackageOpen } from 'lucide-react';

interface OrderDetailViewDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    order: Order | null;
}

const STATUS_STYLES: Record<PaymentStatus, string> = {
    PENDING: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    COMPLETED: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    FAILED: 'bg-red-500/20 text-red-400 border border-red-500/30',
    CANCELLED: 'bg-slate-500/20 text-slate-400 border border-slate-500/30',
};

function formatPrice(price: number) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
    }).format(price);
}

function formatDate(value: string | undefined) {
    if (!value) return '—';
    try {
        return new Date(value).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch {
        return value;
    }
}

export function OrderDetailViewDialog({ open, onOpenChange, order }: OrderDetailViewDialogProps) {
    const { data: details = [], isLoading } = useGetOrderDetailsByOrderId(
        open && order ? order._id : undefined,
    );

    if (!order) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[680px] max-h-[90vh] overflow-y-auto bg-slate-900 text-slate-50 border border-slate-700">
                <DialogHeader>
                    <DialogTitle className="text-slate-50 flex items-center gap-2">
                        <PackageOpen className="w-5 h-5 text-blue-400" />
                        Order Details
                    </DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Full breakdown of order{' '}
                        <span className="font-mono text-slate-300">{order._id}</span>
                    </DialogDescription>
                </DialogHeader>

                {/* Order summary */}
                <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-white/5 border border-white/10 text-sm">
                    <div>
                        <p className="text-slate-400 text-xs uppercase tracking-wide mb-0.5">Order ID</p>
                        <p className="font-mono text-slate-200 break-all">{order._id}</p>
                    </div>
                    <div>
                        <p className="text-slate-400 text-xs uppercase tracking-wide mb-0.5">User ID</p>
                        <p className="font-mono text-slate-200 break-all">{order.userId}</p>
                    </div>
                    <div>
                        <p className="text-slate-400 text-xs uppercase tracking-wide mb-0.5">Total Price</p>
                        <p className="font-semibold text-white">{formatPrice(order.totalPrice)}</p>
                    </div>
                    <div>
                        <p className="text-slate-400 text-xs uppercase tracking-wide mb-0.5">Status</p>
                        <Badge className={STATUS_STYLES[order.paymentStatus]}>
                            {order.paymentStatus}
                        </Badge>
                    </div>
                    <div>
                        <p className="text-slate-400 text-xs uppercase tracking-wide mb-0.5">Created</p>
                        <p className="text-slate-300">{formatDate(order.created_at)}</p>
                    </div>
                    <div>
                        <p className="text-slate-400 text-xs uppercase tracking-wide mb-0.5">Completed</p>
                        <p className="text-slate-300">{formatDate(order.completedAt)}</p>
                    </div>
                </div>

                {/* Order items */}
                <div className="mt-2">
                    <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">
                        Items ({order.orderDetailId.length})
                    </h3>
                    <div className="rounded-xl border border-white/10 overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-white/10 hover:bg-transparent">
                                    <TableHead className="text-slate-400">Product ID</TableHead>
                                    <TableHead className="text-slate-400">Type</TableHead>
                                    <TableHead className="text-slate-400 text-right">Price</TableHead>
                                    <TableHead className="text-slate-400 text-right">Discount</TableHead>
                                    <TableHead className="text-slate-400 text-right">Final</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    Array.from({ length: 3 }).map((_, i) => (
                                        <TableRow key={i} className="border-white/10">
                                            <TableCell><Skeleton className="h-4 w-40 bg-white/10" /></TableCell>
                                            <TableCell><Skeleton className="h-5 w-14 bg-white/10" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-20 ml-auto bg-white/10" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-12 ml-auto bg-white/10" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-20 ml-auto bg-white/10" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : details.length === 0 ? (
                                    <TableRow className="border-white/10 hover:bg-transparent">
                                        <TableCell colSpan={5} className="text-center py-8 text-slate-400">
                                            No items found for this order.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    details.map((item) => {
                                        const final = item.priceAtPurchase * (1 - item.discount / 100);
                                        return (
                                            <TableRow key={item._id} className="border-white/10 hover:bg-white/5">
                                                <TableCell className="font-mono text-xs text-slate-300 max-w-[160px] truncate">
                                                    {item.productId}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={
                                                        item.orderType === 'Game'
                                                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                                            : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                                    }>
                                                        {item.orderType}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right text-slate-300">
                                                    {formatPrice(item.priceAtPurchase)}
                                                </TableCell>
                                                <TableCell className="text-right text-slate-400">
                                                    {item.discount > 0 ? `-${item.discount}%` : '—'}
                                                </TableCell>
                                                <TableCell className="text-right font-semibold text-white">
                                                    {formatPrice(final)}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
