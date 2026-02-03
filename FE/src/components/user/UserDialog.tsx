import { useState, useEffect } from 'react';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { User, CreateUserDTO, UpdateUserDTO, UserRole, UserStatus } from '@/types/User.types';
import { Loader2 } from 'lucide-react';

const userSchema = z.object({
    fullName: z.string().min(1, 'Full name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters').optional(),
    role: z.enum(['Admin', 'Moderator', 'Player'], {
        required_error: 'Role is required',
    }),
    status: z.enum(['ACTIVE', 'INACTIVE'], {
        required_error: 'Status is required',
    }),
    avatar: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user?: User | null;
    onSave: (data: CreateUserDTO | UpdateUserDTO) => Promise<void>;
}

export function UserDialog({ open, onOpenChange, user, onSave }: UserDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const isEditMode = !!user;

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<UserFormData>({
        resolver: zodResolver(userSchema),
    });

    const role = watch('role');
    const status = watch('status');

    useEffect(() => {
        if (user) {
            reset({
                fullName: user.fullName,
                email: user.email,
                password: undefined, // Don't populate password for edit mode
                role: user.role,
                status: user.status,
                avatar: user.avatar || '',
            });
        } else {
            reset({
                fullName: '',
                email: '',
                password: '',
                role: undefined,
                status: 'ACTIVE',
                avatar: '',
            });
        }
    }, [user, reset]);

    const onSubmit = async (data: UserFormData) => {
        setIsLoading(true);
        try {
            if (isEditMode) {
                const updateData: UpdateUserDTO = {
                    fullName: data.fullName,
                    email: data.email,
                    role: data.role as UserRole,
                    status: data.status as UserStatus,
                    avatar: data.avatar || undefined,
                };
                // Only include password if provided
                if (data.password) {
                    updateData.password = data.password;
                }
                await onSave(updateData);
            } else {
                const createData: CreateUserDTO = {
                    fullName: data.fullName,
                    email: data.email,
                    password: data.password || '',
                    role: data.role as UserRole,
                    status: data.status as UserStatus,
                    avatar: data.avatar || undefined,
                };
                await onSave(createData);
            }
            onOpenChange(false);
        } catch (error) {
            console.error('Error saving user:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? 'Edit User' : 'Add New User'}</DialogTitle>
                    <DialogDescription>
                        {isEditMode
                            ? 'Update user information.'
                            : 'Fill in the information to create a new user account.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="fullName">
                            Full Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="fullName"
                            {...register('fullName')}
                            placeholder="John Doe"
                            className={errors.fullName ? 'border-red-500' : ''}
                        />
                        {errors.fullName && (
                            <p className="text-sm text-red-500">{errors.fullName.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">
                            Email <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            {...register('email')}
                            placeholder="john.doe@example.com"
                            className={errors.email ? 'border-red-500' : ''}
                        />
                        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">
                            Password {!isEditMode && <span className="text-red-500">*</span>}
                            {isEditMode && <span className="text-sm text-gray-500"> (leave blank to keep current)</span>}
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            {...register('password')}
                            placeholder={isEditMode ? '••••••••' : 'Enter password'}
                            className={errors.password ? 'border-red-500' : ''}
                        />
                        {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="role">
                                Role <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={role}
                                onValueChange={(value) => setValue('role', value as any)}
                            >
                                <SelectTrigger className={errors.role ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Player">Player</SelectItem>
                                    <SelectItem value="Moderator">Moderator</SelectItem>
                                    <SelectItem value="Admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.role && (
                                <p className="text-sm text-red-500">{errors.role.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">
                                Status <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={status}
                                onValueChange={(value) => setValue('status', value as any)}
                            >
                                <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ACTIVE">Active</SelectItem>
                                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.status && (
                                <p className="text-sm text-red-500">{errors.status.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="avatar">Avatar URL</Label>
                        <Input
                            id="avatar"
                            {...register('avatar')}
                            placeholder="https://example.com/avatar.jpg"
                            className={errors.avatar ? 'border-red-500' : ''}
                        />
                        {errors.avatar && <p className="text-sm text-red-500">{errors.avatar.message}</p>}
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
