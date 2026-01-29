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
import { Search, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

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

    // Handle create user
    const handleCreateUser = async (data: CreateUserDTO | UpdateUserDTO) => {
        await userService.createUser(data as CreateUserDTO);
        fetchUsers();
        setCurrentPage(1);
    };

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
            admin: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
            manager: 'bg-purple-100 text-purple-700 hover:bg-purple-100',
            player: 'bg-green-100 text-green-700 hover:bg-green-100',
        };
        return variants[accountType] || 'bg-gray-100 text-gray-700';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">User Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage user accounts and permissions</p>
                </div>
            </div>

            {/* Filters Card */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 space-y-2">
                            <Label htmlFor="search">Search</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    id="search"
                                    placeholder="Search by name or email..."
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="w-full sm:w-[200px] space-y-2">
                            <Label htmlFor="sort">Sort</Label>
                            <Select
                                value={accountTypeFilter}
                                onValueChange={(value) => {
                                    setAccountTypeFilter(value as UserAccountType | 'all');
                                    setCurrentPage(1);
                                }}
                            >
                                <SelectTrigger id="sort">
                                    <SelectValue placeholder="Filter by type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="manager">Manager</SelectItem>
                                    <SelectItem value="player">Player</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Users Table Card */}
            <Card>
                <CardHeader>
                    <CardTitle>
                        User Table ({totalUsers})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Account Type</TableHead>
                                    <TableHead>Primary Phone</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    // Loading skeleton
                                    Array.from({ length: 5 }).map((_, index) => (
                                        <TableRow key={index}>
                                            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                                            <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                                            <TableCell><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : users.length === 0 ? (
                                    // Empty state
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-12">
                                            <div className="flex flex-col items-center justify-center text-gray-500">
                                                <p className="text-lg font-semibold">No users found</p>
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
                                        <TableRow key={user.id} className="hover:bg-gray-50">
                                            <TableCell className="font-medium">
                                                {user.firstName} {user.lastName}
                                            </TableCell>
                                            <TableCell className="text-gray-600">{user.email}</TableCell>
                                            <TableCell>
                                                <Badge className={getAccountTypeBadge(user.accountType)}>
                                                    {user.accountType.charAt(0).toUpperCase() + user.accountType.slice(1)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-gray-600">
                                                {user.primaryPhone || '-'}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleEditClick(user)}
                                                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDeleteClick(user)}
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
                        <div className="flex items-center justify-between mt-4 pt-4 border-t">
                            <p className="text-sm text-gray-600">
                                Showing {(currentPage - 1) * pageSize + 1} to{' '}
                                {Math.min(currentPage * pageSize, totalUsers)} of {totalUsers} users
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                    disabled={!canGoPrevious}
                                >
                                    <ChevronLeft className="h-4 w-4 mr-1" />
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                    disabled={!canGoNext}
                                >
                                    Next
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Dialogs */}
            <UserDialog
                open={userDialogOpen}
                onOpenChange={setUserDialogOpen}
                user={selectedUser}
                onSave={selectedUser ? handleUpdateUser : handleCreateUser}
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