import { useState, useMemo } from 'react';
import type { Order, PaymentStatus } from '@/types/Orders.types';
import { useGetOrders } from '@/hooks/order/useGetOrders';
import { useCancelOrder } from '@/hooks/order/useCancelOrder';
import { useUpdateOrder } from '@/hooks/order/useUpdateOrder';
import { OrderDetailViewDialog } from '@/components/dialog/order/OrderDetailViewDialog';
import { UpdateOrderStatusDialog } from '@/components/dialog/order/UpdateOrderStatusDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    Search,
    Eye,
    Pencil,
    XCircle,
    ChevronLeft,
    ChevronRight,
    ClipboardList,
    Loader2,
} from 'lucide-react';

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
        return new Date(value).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    } catch {
        return value;
    }
}

function truncateId(id: string) {
    return id.length > 12 ? `${id.slice(0, 8)}…${id.slice(-4)}` : id;
}

export function OrderManagementPage() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'all'>('all');
    const [cursor, setCursor] = useState<string | undefined>(undefined);
    const [cursors, setCursors] = useState<(string | undefined)[]>([undefined]);
    const pageSize = 10;

    // Dialog state
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [statusDialogOpen, setStatusDialogOpen] = useState(false);
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const { data, isLoading } = useGetOrders({ cursor, limit: pageSize });
    const cancelOrderMutation = useCancelOrder();
    const updateOrderMutation = useUpdateOrder();

    const allOrders: Order[] = data?.data || [];
    const totalCount = data?.totalCount || 0;
    const hasNextPage = data?.hasNextPage || false;
    const nextCursor = data?.nextCursor;

    // Client-side filter (status + search by userId/orderId)
    const filteredOrders = useMemo(() => {
        let list = allOrders;
        if (statusFilter !== 'all') {
            list = list.filter((o) => o.paymentStatus === statusFilter);
        }
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(
                (o) =>
                    o._id.toLowerCase().includes(q) ||
                    o.userId.toLowerCase().includes(q),
            );
        }
        return list;
    }, [allOrders, statusFilter, search]);

    // Status counts from current page
    const statusCounts = useMemo(() => {
        const counts: Record<PaymentStatus | 'all', number> = {
            all: allOrders.length,
            PENDING: 0,
            COMPLETED: 0,
            FAILED: 0,
            CANCELLED: 0,
        };
        allOrders.forEach((o) => counts[o.paymentStatus]++);
        return counts;
    }, [allOrders]);

    const handleNextPage = () => {
        if (hasNextPage && nextCursor) {
            setCursors([...cursors, cursor]);
            setCursor(nextCursor);
        }
    };

    const handlePreviousPage = () => {
        if (cursors.length > 1) {
            const newCursors = [...cursors];
            newCursors.pop();
            setCursors(newCursors);
            setCursor(newCursors[newCursors.length - 1]);
        }
    };

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setCursor(undefined);
        setCursors([undefined]);
    };

    const handleStatusFilterChange = (value: PaymentStatus | 'all') => {
        setStatusFilter(value);
        setCursor(undefined);
        setCursors([undefined]);
    };

    const handleViewClick = (order: Order) => {
        setSelectedOrder(order);
        setViewDialogOpen(true);
    };

    const handleEditStatusClick = (order: Order) => {
        setSelectedOrder(order);
        setStatusDialogOpen(true);
    };

    const handleCancelClick = (order: Order) => {
        setSelectedOrder(order);
        setCancelDialogOpen(true);
    };

    const handleUpdateStatus = async (status: PaymentStatus) => {
        if (!selectedOrder) return;
        await updateOrderMutation.mutateAsync(
            { id: selectedOrder._id, data: { paymentStatus: status } },
        );
        setStatusDialogOpen(false);
        setSelectedOrder(null);
    };

    const handleCancelConfirm = () => {
        if (!selectedOrder) return;
        cancelOrderMutation.mutate(selectedOrder._id, {
            onSuccess: () => {
                setCancelDialogOpen(false);
                setSelectedOrder(null);
            },
        });
    };

    const currentPageNumber = cursors.length;
    const canGoPrevious = cursors.length > 1;
    const canGoNext = hasNextPage;
    const estimatedTotalPages = totalCount > 0 ? Math.ceil(totalCount / pageSize) : 1;

    return (
        <div className="space-y-6 text-slate-50">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white/5 text-blue-400">
                        <ClipboardList className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-50">
                            Order Management
                        </h1>
                        <p className="text-sm text-slate-400 mt-0.5">
                            View and manage all customer orders
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(
                    [
                        { label: 'Pending', status: 'PENDING', color: 'text-amber-400' },
                        { label: 'Completed', status: 'COMPLETED', color: 'text-emerald-400' },
                        { label: 'Failed', status: 'FAILED', color: 'text-red-400' },
                        { label: 'Cancelled', status: 'CANCELLED', color: 'text-slate-400' },
                    ] as const
                ).map(({ label, status, color }) => (
                    <Card
                        key={status}
                        className="bg-slate-900/60 border-slate-700 cursor-pointer hover:bg-slate-800/60 transition-colors"
                        onClick={() =>
                            handleStatusFilterChange(
                                statusFilter === status ? 'all' : status,
                            )
                        }
                    >
                        <CardContent className="pt-4 pb-4">
                            <p className="text-xs text-slate-400 uppercase tracking-wide">{label}</p>
                            <p className={`text-2xl font-bold mt-1 ${color}`}>
                                {isLoading ? (
                                    <Skeleton className="h-7 w-8 bg-white/10" />
                                ) : (
                                    statusCounts[status]
                                )}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Filters */}
            <Card className="bg-slate-900/60 border-slate-700">
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 space-y-2">
                            <Label htmlFor="search" className="text-slate-200">
                                Search
                            </Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    id="search"
                                    placeholder="Search by order ID or user ID..."
                                    value={search}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    className="pl-10 bg-slate-900/60 border-slate-700 text-slate-50 placeholder:text-slate-500"
                                />
                            </div>
                        </div>
                        <div className="w-full sm:w-[200px] space-y-2">
                            <Label className="text-slate-200">Status</Label>
                            <Select
                                value={statusFilter}
                                onValueChange={(v) =>
                                    handleStatusFilterChange(v as PaymentStatus | 'all')
                                }
                            >
                                <SelectTrigger className="bg-slate-900/60 border-slate-700 text-slate-50">
                                    <SelectValue placeholder="All statuses" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-slate-700">
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="PENDING">Pending</SelectItem>
                                    <SelectItem value="COMPLETED">Completed</SelectItem>
                                    <SelectItem value="FAILED">Failed</SelectItem>
                                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Orders Table */}
            <Card className="bg-slate-900/60 border-slate-700">
                <CardHeader>
                    <CardTitle className="text-slate-50">
                        Orders ({totalCount} total
                        {filteredOrders.length !== allOrders.length &&
                            `, ${filteredOrders.length} shown`}
                        )
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-slate-700 hover:bg-transparent">
                                    <TableHead className="text-slate-400">Order ID</TableHead>
                                    <TableHead className="text-slate-400">User ID</TableHead>
                                    <TableHead className="text-slate-400 text-center">Items</TableHead>
                                    <TableHead className="text-slate-400 text-right">Total</TableHead>
                                    <TableHead className="text-slate-400">Status</TableHead>
                                    <TableHead className="text-slate-400">Date</TableHead>
                                    <TableHead className="text-slate-400 text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <TableRow key={i} className="border-slate-700">
                                            <TableCell><Skeleton className="h-4 w-28 bg-white/10" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-28 bg-white/10" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-8 mx-auto bg-white/10" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-20 ml-auto bg-white/10" /></TableCell>
                                            <TableCell><Skeleton className="h-6 w-24 bg-white/10" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-24 bg-white/10" /></TableCell>
                                            <TableCell><Skeleton className="h-8 w-28 ml-auto bg-white/10" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : filteredOrders.length === 0 ? (
                                    <TableRow key="empty" className="border-slate-700 hover:bg-transparent">
                                        <TableCell colSpan={7} className="text-center py-12">
                                            <div className="flex flex-col items-center text-slate-400">
                                                <ClipboardList className="w-12 h-12 mb-3 opacity-40" />
                                                <p className="text-lg font-semibold text-white">
                                                    No orders found
                                                </p>
                                                <p className="text-sm mt-1">
                                                    {search || statusFilter !== 'all'
                                                        ? 'Try adjusting your filters'
                                                        : 'No orders have been placed yet'}
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredOrders.map((order) => (
                                        <TableRow
                                            key={order._id}
                                            className="border-slate-700 hover:bg-slate-800/70 transition-colors"
                                        >
                                            <TableCell className="font-mono text-xs text-slate-300">
                                                {truncateId(order._id)}
                                            </TableCell>
                                            <TableCell className="font-mono text-xs text-slate-400">
                                                {truncateId(order.userId)}
                                            </TableCell>
                                            <TableCell className="text-center text-slate-300 font-medium">
                                                {order.orderDetailId.length}
                                            </TableCell>
                                            <TableCell className="text-right font-semibold text-white">
                                                {formatPrice(order.totalPrice)}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={STATUS_STYLES[order.paymentStatus]}>
                                                    {order.paymentStatus}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-slate-400 text-sm">
                                                {formatDate(order.created_at)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleViewClick(order)}
                                                        className="text-slate-300 hover:text-slate-50 hover:bg-slate-700"
                                                        title="View details"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleEditStatusClick(order)}
                                                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                                                        title="Update status"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleCancelClick(order)}
                                                        disabled={
                                                            order.paymentStatus === 'CANCELLED' ||
                                                            order.paymentStatus === 'COMPLETED'
                                                        }
                                                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 disabled:opacity-30"
                                                        title="Cancel order"
                                                    >
                                                        <XCircle className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {!isLoading && allOrders.length > 0 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-4 border-t border-white/10">
                            <p className="text-sm text-slate-400">
                                Page{' '}
                                <span className="text-white font-medium">{currentPageNumber}</span>
                                {estimatedTotalPages > 1 && (
                                    <>
                                        {' '}of approx.{' '}
                                        <span className="text-white font-medium">
                                            {estimatedTotalPages}
                                        </span>
                                    </>
                                )}{' '}
                                ({totalCount} total orders)
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handlePreviousPage}
                                    disabled={!canGoPrevious}
                                    className="bg-white/5 border-white/10 text-white hover:bg-white/10 disabled:opacity-50"
                                >
                                    <ChevronLeft className="h-4 w-4 mr-1" />
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleNextPage}
                                    disabled={!canGoNext}
                                    className="bg-white/5 border-white/10 text-white hover:bg-white/10 disabled:opacity-50"
                                >
                                    Next
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* View Details Dialog */}
            <OrderDetailViewDialog
                open={viewDialogOpen}
                onOpenChange={setViewDialogOpen}
                order={selectedOrder}
            />

            {/* Update Status Dialog */}
            <UpdateOrderStatusDialog
                open={statusDialogOpen}
                onOpenChange={setStatusDialogOpen}
                order={selectedOrder}
                onConfirm={handleUpdateStatus}
                isLoading={updateOrderMutation.isPending}
            />

            {/* Cancel Confirmation Dialog */}
            <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                <AlertDialogContent className="bg-slate-900 text-slate-50 border border-slate-700">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Cancel this order?</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-400">
                            This will mark the order as{' '}
                            <span className="font-semibold text-red-400">CANCELLED</span>. This
                            action cannot be easily undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            disabled={cancelOrderMutation.isPending}
                            className="bg-slate-800 text-slate-50 border-slate-600 hover:bg-slate-700"
                        >
                            Go Back
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleCancelConfirm}
                            disabled={cancelOrderMutation.isPending}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {cancelOrderMutation.isPending && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Cancel Order
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

export default OrderManagementPage;
