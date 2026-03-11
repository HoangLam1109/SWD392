import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import type { Order, PaymentStatus } from '@/types/Orders.types';

interface UpdateOrderStatusDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    order: Order | null;
    onConfirm: (status: PaymentStatus) => Promise<void>;
    isLoading?: boolean;
}

const STATUS_OPTIONS: PaymentStatus[] = ['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED'];

const STATUS_STYLES: Record<PaymentStatus, string> = {
    PENDING: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    COMPLETED: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    FAILED: 'bg-red-500/20 text-red-400 border border-red-500/30',
    CANCELLED: 'bg-slate-500/20 text-slate-400 border border-slate-500/30',
};

export function UpdateOrderStatusDialog({
    open,
    onOpenChange,
    order,
    onConfirm,
    isLoading = false,
}: UpdateOrderStatusDialogProps) {
    const [selectedStatus, setSelectedStatus] = useState<PaymentStatus>('PENDING');

    useEffect(() => {
        if (order) setSelectedStatus(order.paymentStatus);
    }, [order, open]);

    const handleConfirm = async () => {
        await onConfirm(selectedStatus);
    };

    if (!order) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[400px] bg-slate-900 text-slate-50 border border-slate-700">
                <DialogHeader>
                    <DialogTitle className="text-slate-50">Update Order Status</DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Change the payment status for this order.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                        <span>Current:</span>
                        <Badge className={STATUS_STYLES[order.paymentStatus]}>
                            {order.paymentStatus}
                        </Badge>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-slate-200">New Status</Label>
                        <Select
                            value={selectedStatus}
                            onValueChange={(v) => setSelectedStatus(v as PaymentStatus)}
                        >
                            <SelectTrigger className="bg-slate-800 border-slate-600 text-slate-50 focus:border-blue-500/50">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-700">
                                {STATUS_OPTIONS.map((s) => (
                                    <SelectItem key={s} value={s}>
                                        {s}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                        className="border-slate-600 text-slate-200 hover:bg-slate-800"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={isLoading || selectedStatus === order.paymentStatus}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Update
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
