import { useState } from 'react';
import type { User, UserRole, CreateUserDTO, UpdateUserDTO } from '@/types/User.types';
import { useGetUsers, useCreateUser, useUpdateUser, useDeleteUser } from '@/hooks/user';
import { UserDialog, DeleteUserDialog } from '@/components/user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
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
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Pencil, Trash2, ChevronLeft, ChevronRight, UserCog, UserPlus } from 'lucide-react';

export function UserManagementPage() {
    const [search, setSearch] = useState('');
    const [accountTypeFilter, setAccountTypeFilter] = useState<UserRole | 'all'>('all');
    const [cursor, setCursor] = useState<string | undefined>(undefined);
    const [cursors, setCursors] = useState<(string | undefined)[]>([undefined]); // Stack of cursors for previous pages
    const pageSize = 10;

    // Dialog states
    const [userDialogOpen, setUserDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // Fetch users using the hook
    const { data, isLoading: loading } = useGetUsers({
        cursor,
        pageSize,
        search,
        accountTypeFilter: accountTypeFilter === 'all' ? undefined : accountTypeFilter,
    });

    const users = data?.data || [];
    const totalUsers = data?.totalCount || 0;
    const hasNextPage = data?.hasNextPage || false;
    const nextCursor = data?.nextCursor;

    // Mutations
    const createUserMutation = useCreateUser();
    const updateUserMutation = useUpdateUser();
    const deleteUserMutation = useDeleteUser();

    // Handle create/update user
    const handleSaveUser = async (data: CreateUserDTO | UpdateUserDTO) => {
        if (selectedUser) {
            // Update existing user
            const userId = selectedUser._id || selectedUser.id;
            if (!userId) {
                toast.error('User ID not found');
                return;
            }
            updateUserMutation.mutate(
                { id: userId, data },
                {
                    onSuccess: () => {
                        setUserDialogOpen(false);
                        setSelectedUser(null);
                    }
                }
            );
        } else {
            // Create new user
            createUserMutation.mutate(data as CreateUserDTO, {
                onSuccess: () => {
                    setUserDialogOpen(false);
                },
            });
        }
    };

    // Handle delete user
    const handleDeleteUser = async () => {
        if (selectedUser) {
            const userId = selectedUser._id || selectedUser.id;
            if (!userId) {
                toast.error('User ID not found');
                return;
            }
            deleteUserMutation.mutate(userId, {
                onSuccess: () => {
                    setDeleteDialogOpen(false);
                    setSelectedUser(null);
                    // If deleting the last user on the page, go to previous page
                    if (users.length === 1 && cursors.length > 1) {
                        handlePreviousPage();
                    }
                }
            });
        }
    };

    // Handle next page
    const handleNextPage = () => {
        if (hasNextPage && nextCursor) {
            setCursors([...cursors, cursor]);
            setCursor(nextCursor);
        }
    };

    // Handle previous page
    const handlePreviousPage = () => {
        if (cursors.length > 1) {
            const newCursors = [...cursors];
            newCursors.pop();
            const previousCursor = newCursors[newCursors.length - 1];
            setCursors(newCursors);
            setCursor(previousCursor);
        }
    };

    // Reset pagination when search or filter changes
    const handleSearchChange = (value: string) => {
        setSearch(value);
        setCursor(undefined);
        setCursors([undefined]);
    };

    const handleFilterChange = (value: UserRole | 'all') => {
        setAccountTypeFilter(value);
        setCursor(undefined);
        setCursors([undefined]);
    };

    // Open add dialog
    const handleAddClick = () => {
        setSelectedUser(null);
        setUserDialogOpen(true);
    };

    // Open edit dialog
    const handleEditClick = (user: User) => {
        setSelectedUser(user);
        setUserDialogOpen(true);
    };

    // Open delete dialog
    const handleDeleteClick = (user: User) => {
        setSelectedUser(user);
        setDeleteDialogOpen(true);
    };

    // Calculate pagination
    const currentPageNumber = cursors.length;
    const canGoPrevious = cursors.length > 1;
    const canGoNext = hasNextPage;
    const estimatedTotalPages = totalUsers > 0 ? Math.ceil(totalUsers / pageSize) : 1;

    // Get role badge variant
    const getRoleBadge = (role: UserRole) => {
        const variants: Record<UserRole, string> = {
            Admin: 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30',
            Manager: 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 border border-purple-500/30',
            Player: 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30',
        };
        return variants[role] || 'bg-slate-500/20 text-slate-400 border border-slate-500/30';
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
            {/* Animated background gradient - matching HomePage */}
            <div className="fixed inset-0 bg-linear-to-br from-blue-950/30 via-slate-950 to-purple-950/30 pointer-events-none" />
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)] pointer-events-none" />

            <main className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="space-y-6 sm:space-y-8">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 sm:p-3 rounded-xl bg-white/5 text-blue-400">
                                <UserCog className="w-6 h-6 sm:w-7 sm:h-7" />
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-white to-slate-400 bg-clip-text text-transparent">
                                    User Management
                                </h1>
                                <p className="text-sm text-slate-400 mt-0.5">Manage user accounts and permissions</p>
                            </div>
                        </div>
                        <Button
                            onClick={handleAddClick}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            <UserPlus className="w-4 h-4 mr-2" />
                            Add User
                        </Button>
                    </div>

                    {/* Search Bar - Left Aligned */}
                    <div className="space-y-2">
                        <Label htmlFor="search" className="text-sm font-medium text-slate-300">
                            Search Users
                        </Label>
                        <div className="relative max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                id="search"
                                placeholder="Search by name or email..."
                                value={search}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-blue-500/20"
                            />
                        </div>
                    </div>

                    {/* Filters Bar */}
                    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center gap-2 text-sm text-slate-400">
                                <span>Total Users:</span>
                                <span className="font-bold text-white text-lg">{totalUsers}</span>
                            </div>
                            <div className="w-full sm:w-[180px]">
                                <Select
                                    value={accountTypeFilter}
                                    onValueChange={(value) => handleFilterChange(value as UserRole | 'all')}
                                >
                                    <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-blue-500/50 focus:ring-blue-500/20">
                                        <SelectValue placeholder="Filter by role" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-900 border-white/10">
                                        <SelectItem value="all">All Roles</SelectItem>
                                        <SelectItem value="Admin">Admin</SelectItem>
                                        <SelectItem value="Manager">Manager</SelectItem>
                                        <SelectItem value="Player">Player</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Users Table Card */}
                    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                        <div className="p-4 sm:p-6 border-b border-white/10">
                            <h2 className="text-xl font-bold text-white mb-4">User Table</h2>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-white/10 hover:bg-transparent">
                                            <TableHead className="text-slate-400 font-semibold">Full Name</TableHead>
                                            <TableHead className="text-slate-400 font-semibold">Email</TableHead>
                                            <TableHead className="text-slate-400 font-semibold">Role</TableHead>
                                            <TableHead className="text-slate-400 font-semibold">Status</TableHead>
                                            <TableHead className="text-slate-400 font-semibold text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loading ? (
                                            // Loading skeleton
                                            Array.from({ length: 5 }).map((_, index) => (
                                                <TableRow key={index} className="border-white/10 hover:bg-white/5">
                                                    <TableCell><Skeleton className="h-4 w-32 bg-white/10" /></TableCell>
                                                    <TableCell><Skeleton className="h-4 w-48 bg-white/10" /></TableCell>
                                                    <TableCell><Skeleton className="h-6 w-20 bg-white/10" /></TableCell>
                                                    <TableCell><Skeleton className="h-6 w-20 bg-white/10" /></TableCell>
                                                    <TableCell><Skeleton className="h-8 w-24 ml-auto bg-white/10" /></TableCell>
                                                </TableRow>
                                            ))
                                        ) : users.length === 0 ? (
                                            // Empty state
                                            <TableRow className="border-white/10 hover:bg-transparent">
                                                <TableCell colSpan={5} className="text-center py-12">
                                                    <div className="flex flex-col items-center justify-center text-slate-400">
                                                        <UserCog className="w-12 h-12 mb-3 opacity-50" />
                                                        <p className="text-lg font-semibold text-white">No users found</p>
                                                        <p className="text-sm mt-1">
                                                            {search || accountTypeFilter !== 'all'
                                                                ? 'Try adjusting your filters'
                                                                : 'Get started by adding your first user'}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            // User rows
                                            users.map((user) => (
                                                <TableRow key={user._id || user.id} className="border-white/10 hover:bg-white/5 transition-colors">
                                                    <TableCell className="font-medium text-white">
                                                        {user.fullName}
                                                    </TableCell>
                                                    <TableCell className="text-slate-400">{user.email}</TableCell>
                                                    <TableCell>
                                                        <Badge className={getRoleBadge(user.role)}>
                                                            {user.role}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge className={user.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'}>
                                                            {user.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleEditClick(user)}
                                                                className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleDeleteClick(user)}
                                                                className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
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
                            {!loading && users.length > 0 && (
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-4 border-t border-white/10">
                                    <p className="text-sm text-slate-400">
                                        Showing page <span className="text-white font-medium">{currentPageNumber}</span>
                                        {estimatedTotalPages > 1 && (
                                            <> of approximately <span className="text-white font-medium">{estimatedTotalPages}</span> pages</>
                                        )}
                                        {' '}({totalUsers} total users)
                                    </p>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handlePreviousPage}
                                            disabled={!canGoPrevious}
                                            className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <ChevronLeft className="h-4 w-4 mr-1" />
                                            Previous
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleNextPage}
                                            disabled={!canGoNext}
                                            className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Next
                                            <ChevronRight className="h-4 w-4 ml-1" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Dialogs */}
            <UserDialog
                open={userDialogOpen}
                onOpenChange={setUserDialogOpen}
                user={selectedUser}
                onSave={handleSaveUser}
            />

            <DeleteUserDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                user={selectedUser}
                onConfirm={handleDeleteUser}
                isLoading={deleteUserMutation.isPending}
            />
        </div>
    );
}