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
import type { User, CreateUserDTO, UpdateUserDTO, UserAccountType } from '@/types/User.types';
import { Loader2 } from 'lucide-react';

const userSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    accountType: z.enum(['player', 'manager', 'admin'], {
        required_error: 'Account type is required',
    }),
    primaryPhone: z.string().optional(),
    secondaryPhone: z.string().optional(),
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

    const accountType = watch('accountType');

    useEffect(() => {
        if (user) {
            reset({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                accountType: user.accountType,
                primaryPhone: user.primaryPhone,
                secondaryPhone: user.secondaryPhone,
            });
        } else {
            reset({
                firstName: '',
                lastName: '',
                email: '',
                accountType: undefined,
                primaryPhone: '',
                secondaryPhone: '',
            });
        }
    }, [user, reset]);

    const onSubmit = async (data: UserFormData) => {
        setIsLoading(true);
        try {
            if (isEditMode) {
                const updateData: UpdateUserDTO = {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    accountType: data.accountType as UserAccountType,
                    primaryPhone: data.primaryPhone,
                    secondaryPhone: data.secondaryPhone,
                };
                await onSave(updateData);
            } else {
                const createData: CreateUserDTO = {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    accountType: data.accountType as UserAccountType,
                    primaryPhone: data.primaryPhone,
                    secondaryPhone: data.secondaryPhone,
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
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">
                                First Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="firstName"
                                {...register('firstName')}
                                placeholder="John"
                                className={errors.firstName ? 'border-red-500' : ''}
                            />
                            {errors.firstName && (
                                <p className="text-sm text-red-500">{errors.firstName.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="lastName">
                                Last Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="lastName"
                                {...register('lastName')}
                                placeholder="Doe"
                                className={errors.lastName ? 'border-red-500' : ''}
                            />
                            {errors.lastName && (
                                <p className="text-sm text-red-500">{errors.lastName.message}</p>
                            )}
                        </div>
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
                        <Label htmlFor="accountType">
                            Account Type <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            value={accountType}
                            onValueChange={(value) => setValue('accountType', value as any)}
                        >
                            <SelectTrigger className={errors.accountType ? 'border-red-500' : ''}>
                                <SelectValue placeholder="Select account type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="player">Player</SelectItem>
                                <SelectItem value="manager">Manager</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.accountType && (
                            <p className="text-sm text-red-500">{errors.accountType.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="primaryPhone">Primary Phone</Label>
                            <Input
                                id="primaryPhone"
                                {...register('primaryPhone')}
                                placeholder="+1234567890"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="secondaryPhone">Secondary Phone</Label>
                            <Input
                                id="secondaryPhone"
                                {...register('secondaryPhone')}
                                placeholder="+1234567891"
                            />
                        </div>
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
