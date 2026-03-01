import { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Game, CreateGameDTO, UpdateGameDTO } from '@/types/Game.types';
import { Loader2 } from 'lucide-react';

const gameSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    price: z.coerce.number().min(0, 'Price must be ≥ 0'),
    isActive: z.boolean(),
    description: z.string().optional(),
    discount: z.coerce.number().min(0).max(100).optional().default(0),
    thumbnail: z.string().url('Invalid URL').optional().or(z.literal('')),
    coverImage: z.string().url('Invalid URL').optional().or(z.literal('')),
    developer: z.string().optional(),
    publisher: z.string().optional(),
    releaseDate: z.string().optional(),
    url: z.string().url('Invalid URL').optional().or(z.literal('')),
});

type GameFormData = z.infer<typeof gameSchema>;

interface GameDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    game?: Game | null;
    onSave: (data: CreateGameDTO | UpdateGameDTO) => Promise<void>;
}

export function GameDialog({ open, onOpenChange, game, onSave }: GameDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const isEditMode = !!game;

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<GameFormData>({
        resolver: zodResolver(gameSchema),
        defaultValues: {
            isActive: true,
            discount: 0,
        },
    });

    const isActive = watch('isActive');

    useEffect(() => {
        if (game) {
            reset({
                title: game.title,
                price: game.price,
                isActive: game.isActive,
                description: game.description || '',
                discount: game.discount ?? 0,
                thumbnail: game.thumbnail || '',
                coverImage: game.coverImage || '',
                developer: game.developer || '',
                publisher: game.publisher || '',
                releaseDate: game.releaseDate ? String(game.releaseDate).slice(0, 10) : '',
                url: game.url || '',
            });
        } else {
            reset({
                title: '',
                price: 0,
                isActive: true,
                description: '',
                discount: 0,
                thumbnail: '',
                coverImage: '',
                developer: '',
                publisher: '',
                releaseDate: '',
                url: '',
            });
        }
        setApiError(null);
    }, [game, reset, open]);

    const onSubmit = async (data: GameFormData) => {
        setApiError(null);
        setIsLoading(true);
        try {
            const payload: CreateGameDTO | UpdateGameDTO = {
                title: data.title.trim(),
                price: Number(data.price),
                isActive: data.isActive,
                ...(data.description?.trim() && { description: data.description.trim() }),
                ...(data.discount != null && data.discount > 0 && { discount: data.discount }),
                ...(data.thumbnail?.trim() && { thumbnail: data.thumbnail.trim() }),
                ...(data.coverImage?.trim() && { coverImage: data.coverImage.trim() }),
                ...(data.developer?.trim() && { developer: data.developer.trim() }),
                ...(data.publisher?.trim() && { publisher: data.publisher.trim() }),
                ...(data.releaseDate?.trim() && {
                    releaseDate: new Date(data.releaseDate.trim() + 'T00:00:00.000Z').toISOString(),
                }),
                ...(data.url?.trim() && { url: data.url.trim() }),
            };
            await onSave(payload);
            onOpenChange(false);
        } catch (error: unknown) {
            const message =
                error && typeof error === 'object' && 'response' in error
                    ? (error as { response?: { data?: { message?: string | string[] } } }).response?.data?.message
                    : null;
            const str = Array.isArray(message) ? message.join(', ') : message || (error as Error)?.message || 'Failed to save game';
            setApiError(typeof str === 'string' ? str : 'Failed to save game');
            console.error('Error saving game:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? 'Edit Game' : 'Add New Game'}</DialogTitle>
                    <DialogDescription>
                        {isEditMode
                            ? 'Update game information.'
                            : 'Fill in the information to add a new game.'}
                    </DialogDescription>
                </DialogHeader>

                {apiError && (
                    <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                        {apiError}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">
                            Title <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="title"
                            {...register('title')}
                            placeholder="Game title"
                            className={errors.title ? 'border-red-500' : ''}
                        />
                        {errors.title && (
                            <p className="text-sm text-red-500">{errors.title.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price">
                                Price <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                {...register('price')}
                                placeholder="0"
                                className={errors.price ? 'border-red-500' : ''}
                            />
                            {errors.price && (
                                <p className="text-sm text-red-500">{errors.price.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="discount">Discount (%)</Label>
                            <Input
                                id="discount"
                                type="number"
                                min={0}
                                max={100}
                                {...register('discount')}
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch
                            id="isActive"
                            checked={isActive}
                            onCheckedChange={(v) => setValue('isActive', v)}
                        />
                        <Label htmlFor="isActive">Active (visible in store)</Label>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            {...register('description')}
                            placeholder="Game description"
                            rows={3}
                            className="resize-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="thumbnail">Thumbnail URL</Label>
                        <Input
                            id="thumbnail"
                            {...register('thumbnail')}
                            placeholder="https://..."
                            className={errors.thumbnail ? 'border-red-500' : ''}
                        />
                        {errors.thumbnail && (
                            <p className="text-sm text-red-500">{errors.thumbnail.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="coverImage">Cover Image URL</Label>
                        <Input
                            id="coverImage"
                            {...register('coverImage')}
                            placeholder="https://..."
                            className={errors.coverImage ? 'border-red-500' : ''}
                        />
                        {errors.coverImage && (
                            <p className="text-sm text-red-500">{errors.coverImage.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="developer">Developer</Label>
                            <Input
                                id="developer"
                                {...register('developer')}
                                placeholder="Developer name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="publisher">Publisher</Label>
                            <Input
                                id="publisher"
                                {...register('publisher')}
                                placeholder="Publisher name"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="releaseDate">Release Date</Label>
                        <Input
                            id="releaseDate"
                            type="date"
                            {...register('releaseDate')}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="url">Game URL</Label>
                        <Input
                            id="url"
                            {...register('url')}
                            placeholder="https://..."
                            className={errors.url ? 'border-red-500' : ''}
                        />
                        {errors.url && (
                            <p className="text-sm text-red-500">{errors.url.message}</p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isEditMode ? 'Update' : 'Create'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
