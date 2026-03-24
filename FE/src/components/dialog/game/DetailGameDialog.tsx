import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { getImageUrl } from '@/lib/imageUtils';
import type { Game } from '@/types/Game.types';
import { Pencil, ExternalLink } from 'lucide-react';
import { useGetCategoryById } from '@/hooks/category/useGetCategories';

interface DetailGameDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    game: Game | null;
    onEdit?: (game: Game) => void;
}

function formatPrice(price: number) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(price);
}

function formatDate(value: string | undefined): string {
    if (!value) return '—';
    try {
        const date = new Date(value);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    } catch {
        return String(value);
    }
}

export function DetailGameDialog({
    open,
    onOpenChange,
    game,
    onEdit,
}: DetailGameDialogProps) {
    if (!game) return null;

    const thumbnailUrl = getImageUrl(game.thumbnail) || '';
    const coverImageUrl = getImageUrl(game.coverImage) || '';
    const categoryQuery = useGetCategoryById(game.categoryId);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto bg-slate-900 text-slate-50 border border-slate-700">
                <DialogHeader>
                    <DialogTitle className="pr-8 text-slate-50">{game.title}</DialogTitle>
                    <DialogDescription className="text-slate-400">Game details</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {thumbnailUrl ? (
                        <div>
                            <p className="text-sm font-medium text-slate-400 mb-1">Thumbnail</p>
                            <div className="rounded-lg overflow-hidden border border-slate-700 bg-slate-800/60 aspect-video">
                                <ImageWithFallback
                                    src={thumbnailUrl}
                                    alt={`${game.title} thumbnail`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    ) : null}

                    {coverImageUrl ? (
                        <div>
                            <p className="text-sm font-medium text-slate-400 mb-1">Cover Image</p>
                            <div className="rounded-lg overflow-hidden border border-slate-700 bg-slate-800/60 aspect-video">
                                <ImageWithFallback
                                    src={coverImageUrl}
                                    alt={`${game.title} cover`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    ) : null}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-slate-400">Price</p>
                            <p className="text-lg font-semibold">
                                {game.price === 0 ? 'Free' : formatPrice(game.price)}
                                {game.discount != null && game.discount > 0 && (
                                    <span className="ml-2 text-sm font-normal text-muted-foreground">
                                        ({game.discount}% off)
                                    </span>
                                )}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-400">Status</p>
                            <Badge
                                variant={game.isActive ? 'default' : 'secondary'}
                                className={
                                    game.isActive
                                        ? 'bg-green-600 hover:bg-green-600'
                                        : 'bg-slate-600 hover:bg-slate-600'
                                }
                            >
                                {game.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                        </div>
                    </div>

                    {game.description ? (
                        <div>
                            <p className="text-sm font-medium text-slate-400 mb-1">Description</p>
                            <p className="text-sm text-slate-50 whitespace-pre-wrap">{game.description}</p>
                        </div>
                    ) : null}

                    <div className="grid grid-cols-2 gap-4">
                        {game.developer ? (
                            <div>
                                <p className="text-sm font-medium text-slate-400">Developer</p>
                                <p className="text-sm">{game.developer}</p>
                            </div>
                        ) : null}
                        {game.publisher ? (
                            <div>
                                <p className="text-sm font-medium text-slate-400">Publisher</p>
                                <p className="text-sm">{game.publisher}</p>
                            </div>
                        ) : null}
                        {game.categoryId ? (
                            <div>
                                <p className="text-sm font-medium text-slate-400">Category</p>
                                <p className="text-sm">
                                    {categoryQuery.isLoading
                                        ? 'Loading...'
                                        : categoryQuery.data?.categoryName ?? 'Unknown'}
                                </p>
                            </div>
                        ) : null}
                    </div>
                    {game.releaseDate ? (
                        <div>
                            <p className="text-sm font-medium text-slate-400">Release date</p>
                            <p className="text-sm">{formatDate(game.releaseDate)}</p>
                        </div>
                    ) : null}

                    {game.url ? (
                        <div>
                            <p className="text-sm font-medium text-slate-400 mb-1">Game URL</p>
                            <a
                                href={game.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-400 hover:text-blue-300 hover:underline inline-flex items-center gap-1"
                            >
                                {game.url}
                                <ExternalLink className="h-3 w-3" />
                            </a>
                        </div>
                    ) : null}
                </div>

                {onEdit ? (
                    <div className="flex justify-end pt-2 border-t border-slate-700">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                onOpenChange(false);
                                onEdit(game);
                            }}
                            className="gap-2 border-slate-600 text-slate-200 hover:bg-slate-800"
                        >
                            <Pencil className="h-4 w-4" />
                            Edit game
                        </Button>
                    </div>
                ) : null}
            </DialogContent>
        </Dialog>
    );
}
