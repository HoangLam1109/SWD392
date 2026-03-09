import { useState, useEffect } from 'react';
import { userService } from '@/service/user.service';
import type { User, UserAccountType, CreateUserDTO, UpdateUserDTO } from '@/types/User.types';
import { UserDialog, DeleteUserDialog } from '@/components/user';
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
import { Search, Pencil, Trash2, ChevronLeft, ChevronRight, UserCog } from 'lucide-react';

export function UserManagementPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [accountTypeFilter, setAccountTypeFilter] = useState<UserAccountType | 'all'>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const pageSize = 10;

    // Dialog states
    const [userDialogOpen, setUserDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Fetch users
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await userService.getUsers(
                currentPage,
                pageSize,
                search,
                accountTypeFilter === 'all' ? undefined : accountTypeFilter
            );
            setUsers(response.users);
            setTotalUsers(response.total);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [currentPage, search, accountTypeFilter]);

    // Handle update user
    const handleUpdateUser = async (data: CreateUserDTO | UpdateUserDTO) => {
        if (selectedUser) {
            await userService.updateUser(selectedUser.id, data);
            fetchUsers();
        }
    };

    // Handle delete user
    const handleDeleteUser = async () => {
        if (selectedUser) {
            setIsDeleting(true);
            try {
                await userService.deleteUser(selectedUser.id);
                fetchUsers();
                if (users.length === 1 && currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                }
            } catch (error) {
                console.error('Error deleting user:', error);
            } finally {
                setIsDeleting(false);
            }
        }
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
    const totalPages = Math.ceil(totalUsers / pageSize);
    const canGoPrevious = currentPage > 1;
    const canGoNext = currentPage < totalPages;

    // Get account type badge variant
    const getAccountTypeBadge = (accountType: UserAccountType) => {
        const variants: Record<UserAccountType, string> = {
            admin: 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30',
            manager: 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 border border-purple-500/30',
            player: 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30',
        };
        return variants[accountType] || 'bg-slate-500/20 text-slate-400 border border-slate-500/30';
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
            {/* Animated background gradient - matching HomePage */}
            <div className="fixed inset-0 bg-linear-to-br from-blue-950/30 via-slate-950 to-purple-950/30 pointer-events-none" />
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)] pointer-events-none" />

            <main className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="space-y-6 sm:space-y-8">
                    {/* Header */}
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
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setCurrentPage(1);
                                }}
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
                                    onValueChange={(value) => {
                                        setAccountTypeFilter(value as UserAccountType | 'all');
                                        setCurrentPage(1);
                                    }}
                                >
                                    <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-blue-500/50 focus:ring-blue-500/20">
                                        <SelectValue placeholder="Filter by type" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-900 border-white/10">
                                        <SelectItem value="all">All Types</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="manager">Manager</SelectItem>
                                        <SelectItem value="player">Player</SelectItem>
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
                                            <TableHead className="text-slate-400 font-semibold">Name</TableHead>
                                            <TableHead className="text-slate-400 font-semibold">Email</TableHead>
                                            <TableHead className="text-slate-400 font-semibold">Account Type</TableHead>
                                            <TableHead className="text-slate-400 font-semibold">Primary Phone</TableHead>
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
                                                    <TableCell><Skeleton className="h-4 w-28 bg-white/10" /></TableCell>
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
                                                <TableRow key={user.id} className="border-white/10 hover:bg-white/5 transition-colors">
                                                    <TableCell className="font-medium text-white">
                                                        {user.firstName} {user.lastName}
                                                    </TableCell>
                                                    <TableCell className="text-slate-400">{user.email}</TableCell>
                                                    <TableCell>
                                                        <Badge className={getAccountTypeBadge(user.accountType)}>
                                                            {user.accountType.charAt(0).toUpperCase() + user.accountType.slice(1)}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-slate-400">
                                                        {user.primaryPhone || '-'}
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
                                        Showing <span className="text-white font-medium">{(currentPage - 1) * pageSize + 1}</span> to{' '}
                                        <span className="text-white font-medium">{Math.min(currentPage * pageSize, totalUsers)}</span> of{' '}
                                        <span className="text-white font-medium">{totalUsers}</span> users
                                    </p>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage(currentPage - 1)}
                                            disabled={!canGoPrevious}
                                            className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <ChevronLeft className="h-4 w-4 mr-1" />
                                            Previous
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage(currentPage + 1)}
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
                onSave={handleUpdateUser}
            />

            <DeleteUserDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                user={selectedUser}
                onConfirm={handleDeleteUser}
                isLoading={isDeleting}
            />
        </div>
    );
}