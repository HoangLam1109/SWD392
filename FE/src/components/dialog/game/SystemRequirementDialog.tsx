import { useEffect, useMemo, useState } from 'react';
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Game } from '@/types/Game.types';
import type { System } from '@/types/System.types';
import { useGetSystemsByGameId } from '@/hooks/system/useGetSystemsByGameId';
import { useCreateSystem } from '@/hooks/system/useCreateSystem';
import { useUpdateSystem } from '@/hooks/system/useUpdateSystem';
import { useDeleteSystem } from '@/hooks/system/useDeleteSystem';
import { Loader2, Plus, Trash2 } from 'lucide-react';

const systemSchema = z.object({
    requirementType: z.string().min(1, 'Requirement type is required'),
    os: z.string().min(1, 'Operating system is required'),
    processor: z.string().min(1, 'Processor is required'),
    memory: z.string().min(1, 'Memory is required'),
    graphics: z.string().min(1, 'Graphics is required'),
    storage: z.string().min(1, 'Storage is required'),
    additionalNotes: z.string().optional(),
});

type SystemFormData = z.infer<typeof systemSchema>;

interface SystemRequirementDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    game: Game | null;
}

type SystemWithId = System;

export function SystemRequirementDialog({ open, onOpenChange, game }: SystemRequirementDialogProps) {
    const [selectedSystem, setSelectedSystem] = useState<SystemWithId | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: systems = [], isLoading } = useGetSystemsByGameId(game?._id);

    const getSystemId = (system: SystemWithId | null | undefined): string | undefined => {
        if (!system) return undefined;
        return system.id ?? system._id;
    };
    const createSystemMutation = useCreateSystem();
    const updateSystemMutation = useUpdateSystem();
    const deleteSystemMutation = useDeleteSystem();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<SystemFormData>({
        resolver: zodResolver(systemSchema),
        defaultValues: {
            requirementType: '',
            os: '',
            processor: '',
            memory: '',
            graphics: '',
            storage: '',
            additionalNotes: '',
        },
    });

    const gameSystems: SystemWithId[] = useMemo(() => {
        if (!game) return [];
        const list = Array.isArray(systems) ? (systems as SystemWithId[]) : [];
        return list;
    }, [systems, game]);

    useEffect(() => {
        if (!open) {
            setSelectedSystem(null);
            reset({
                requirementType: '',
                os: '',
                processor: '',
                memory: '',
                graphics: '',
                storage: '',
                additionalNotes: '',
            });
            return;
        }

        // When dialog opens for a game, reset form
        setSelectedSystem(null);
        reset({
            requirementType: '',
            os: '',
            processor: '',
            memory: '',
            graphics: '',
            storage: '',
            additionalNotes: '',
        });
    }, [open, reset, game]);

    const handleEditSystem = (system: SystemWithId) => {
        setSelectedSystem(system);
        reset({
            requirementType: system.requirementType,
            os: system.os,
            processor: system.processor,
            memory: system.memory,
            graphics: system.graphics,
            storage: system.storage,
            additionalNotes: system.additionalNotes ?? '',
        });
    };

    const handleCreateOrUpdate = async (data: SystemFormData) => {
        if (!game) return;

        setIsSubmitting(true);
        try {
            const payload: Omit<System, 'id' | '_id'> = {
                gameId: game._id,
                requirementType: data.requirementType.trim(),
                os: data.os.trim(),
                processor: data.processor.trim(),
                memory: data.memory.trim(),
                graphics: data.graphics.trim(),
                storage: data.storage.trim(),
                additionalNotes: data.additionalNotes?.trim() ?? '',
            };

            const id = getSystemId(selectedSystem);

            if (id) {
                await updateSystemMutation.mutateAsync({
                    id,
                    data: payload,
                });
            } else {
                await createSystemMutation.mutateAsync(payload);
            }

            setSelectedSystem(null);
            reset({
                requirementType: '',
                os: '',
                processor: '',
                memory: '',
                graphics: '',
                storage: '',
                additionalNotes: '',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleQuickDeleteSystem = async (system: SystemWithId) => {
        const id = getSystemId(system);
        if (!id) return;
        if (!window.confirm('Are you sure you want to delete this system requirement?')) return;

        setIsSubmitting(true);
        try {
            await deleteSystemMutation.mutateAsync(id);
            if (getSystemId(selectedSystem) === id) {
                setSelectedSystem(null);
                reset({
                    requirementType: '',
                    os: '',
                    processor: '',
                    memory: '',
                    graphics: '',
                    storage: '',
                    additionalNotes: '',
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        const id = getSystemId(selectedSystem);
        if (!id) return;
        if (!window.confirm('Are you sure you want to delete this system requirement?')) return;

        setIsSubmitting(true);
        try {
            await deleteSystemMutation.mutateAsync(id);
            setSelectedSystem(null);
            reset({
                requirementType: '',
                os: '',
                processor: '',
                memory: '',
                graphics: '',
                storage: '',
                additionalNotes: '',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[720px] max-h-[90vh] overflow-y-auto bg-slate-900 text-slate-50 border border-slate-700">
                <DialogHeader>
                    <DialogTitle className="text-slate-50">
                        System Requirements{game ? ` - ${game.title}` : ''}
                    </DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Manage minimum and recommended system requirements for this game.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-6">
                    <div className="space-y-3 border border-slate-700/60 rounded-md p-3 bg-slate-900/40">
                        <div className="flex items-center justify-between mb-1">
                            <p className="font-semibold text-sm text-slate-100">Existing requirements</p>
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                    setSelectedSystem(null);
                                    reset({
                                        requirementType: '',
                                        os: '',
                                        processor: '',
                                        memory: '',
                                        graphics: '',
                                        storage: '',
                                        additionalNotes: '',
                                    });
                                }}
                                className="h-8 px-2 border-slate-600 text-slate-200 hover:bg-slate-800"
                            >
                                <Plus className="h-3 w-3 mr-1" />
                                New
                            </Button>
                        </div>

                        {isLoading ? (
                            <p className="text-sm text-slate-400">Loading system requirements...</p>
                        ) : gameSystems.length === 0 ? (
                            <p className="text-sm text-slate-500">No system requirements for this game yet.</p>
                        ) : (
                            <div className="space-y-2">
                                {gameSystems.map((system) => {
                                    const id = getSystemId(system);
                                    return (
                                        <div
                                            key={id ?? `${system.gameId}-${system.requirementType}`}
                                            role="button"
                                            tabIndex={0}
                                            onClick={() => handleEditSystem(system)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    e.preventDefault();
                                                    handleEditSystem(system);
                                                }
                                            }}
                                            className={`w-full text-left text-sm rounded-md border px-3 py-2 transition ${
                                                getSystemId(selectedSystem) === id
                                                    ? 'border-blue-500 bg-blue-500/10'
                                                    : 'border-slate-700 bg-slate-900/40 hover:bg-slate-800/80'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-medium text-slate-100">
                                                            {system.requirementType || 'Requirement'}
                                                        </span>
                                                        <span className="text-xs text-slate-400">{system.os}</span>
                                                    </div>
                                                    <div className="mt-1 text-xs text-slate-400 line-clamp-2">
                                                        CPU: {system.processor} • RAM: {system.memory} • GPU:{' '}
                                                        {system.graphics}
                                                    </div>
                                                </div>
                                                <Button
                                                    type="button"
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-7 w-7 text-red-300 hover:text-red-200 hover:bg-red-500/10"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleQuickDeleteSystem(system);
                                                    }}
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleSubmit(handleCreateOrUpdate)} className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="requirementType">
                                    Requirement Type <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="requirementType"
                                    {...register('requirementType')}
                                    placeholder="e.g. Minimum, Recommended"
                                    className={`bg-slate-900/60 border-slate-700 text-slate-50 placeholder:text-slate-500 ${
                                        errors.requirementType ? 'border-red-500' : ''
                                    }`}
                                />
                                {errors.requirementType && (
                                    <p className="text-xs text-red-500">{errors.requirementType.message}</p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="os">
                                    Operating System <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="os"
                                    {...register('os')}
                                    placeholder="e.g. Windows 10 64-bit"
                                    className={`bg-slate-900/60 border-slate-700 text-slate-50 placeholder:text-slate-500 ${
                                        errors.os ? 'border-red-500' : ''
                                    }`}
                                />
                                {errors.os && <p className="text-xs text-red-500">{errors.os.message}</p>}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="processor">
                                Processor <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="processor"
                                {...register('processor')}
                                placeholder="e.g. Intel i5-8400 / Ryzen 3 3300X"
                                className={`bg-slate-900/60 border-slate-700 text-slate-50 placeholder:text-slate-500 ${
                                    errors.processor ? 'border-red-500' : ''
                                }`}
                            />
                            {errors.processor && (
                                <p className="text-xs text-red-500">{errors.processor.message}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="memory">
                                    Memory <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="memory"
                                    {...register('memory')}
                                    placeholder="e.g. 8 GB RAM"
                                    className={`bg-slate-900/60 border-slate-700 text-slate-50 placeholder:text-slate-500 ${
                                        errors.memory ? 'border-red-500' : ''
                                    }`}
                                />
                                {errors.memory && (
                                    <p className="text-xs text-red-500">{errors.memory.message}</p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="graphics">
                                    Graphics <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="graphics"
                                    {...register('graphics')}
                                    placeholder="e.g. GTX 1060 / RX 580"
                                    className={`bg-slate-900/60 border-slate-700 text-slate-50 placeholder:text-slate-500 ${
                                        errors.graphics ? 'border-red-500' : ''
                                    }`}
                                />
                                {errors.graphics && (
                                    <p className="text-xs text-red-500">{errors.graphics.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="storage">
                                Storage <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="storage"
                                {...register('storage')}
                                placeholder="e.g. 50 GB available space"
                                className={`bg-slate-900/60 border-slate-700 text-slate-50 placeholder:text-slate-500 ${
                                    errors.storage ? 'border-red-500' : ''
                                }`}
                            />
                            {errors.storage && (
                                <p className="text-xs text-red-500">{errors.storage.message}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="additionalNotes">Additional Notes</Label>
                            <Textarea
                                id="additionalNotes"
                                {...register('additionalNotes')}
                                placeholder="Any extra notes (optional)"
                                rows={3}
                                className="resize-none bg-slate-900/60 border-slate-700 text-slate-50 placeholder:text-slate-500"
                            />
                        </div>

                        <DialogFooter className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
                            <div className="flex items-center gap-2">
                                {selectedSystem?.id && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleDelete}
                                        disabled={isSubmitting || deleteSystemMutation.isPending}
                                        className="border-red-700 text-red-300 hover:bg-red-950/40"
                                    >
                                        {deleteSystemMutation.isPending && (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        )}
                                        <Trash2 className="h-4 w-4 mr-1" />
                                        Delete
                                    </Button>
                                )}
                            </div>

                            <div className="flex gap-2 justify-end">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => onOpenChange(false)}
                                    disabled={isSubmitting}
                                    className="border-slate-600 text-slate-200 hover:bg-slate-800"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting || !game}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    {(isSubmitting ||
                                        createSystemMutation.isPending ||
                                        updateSystemMutation.isPending) && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    {selectedSystem ? 'Update' : 'Create'}
                                </Button>
                            </div>
                        </DialogFooter>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}

