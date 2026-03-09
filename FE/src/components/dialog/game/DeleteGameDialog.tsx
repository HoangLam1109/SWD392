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
import { Loader2 } from 'lucide-react';
import type { Game } from '@/types/Game.types';

interface DeleteGameDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    game: Game | null;
    onConfirm: () => Promise<void>;
    isLoading?: boolean;
}

export function DeleteGameDialog({
    open,
    onOpenChange,
    game,
    onConfirm,
    isLoading = false,
}: DeleteGameDialogProps) {
    const handleConfirm = async () => {
        await onConfirm();
        onOpenChange(false);
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="bg-slate-900 text-slate-50 border border-slate-700">
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete game?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the game{' '}
                        <span className="font-semibold text-slate-50">{game?.title}</span>.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel
                        disabled={isLoading}
                        className="bg-slate-800 text-slate-50 border-slate-600 hover:bg-slate-700"
                    >
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
