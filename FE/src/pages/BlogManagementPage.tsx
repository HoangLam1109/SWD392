import { useState, useMemo, useEffect } from 'react';
import type { Blog, BlogStatus } from '@/types/Blog.types';
import { blogService } from '@/service/blog.service';
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
import { Search, Eye, Check, X, FileText, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

export function BlogManagementPage() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<BlogStatus | 'all'>('all');
    const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);
    const [actionDialogOpen, setActionDialogOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState<'approve' | 'reject' | null>(null);
    const [isActionLoading, setIsActionLoading] = useState(false);

    const fetchBlogs = async () => {
        setIsLoading(true);
        try {
            const response = await blogService.getBlogs();
            setBlogs(response.data || []);
        } catch (error) {
            console.error('Error fetching blogs:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const filteredBlogs = useMemo(() => {
        let list = Array.isArray(blogs) ? blogs : [];
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(
                (b) =>
                    b.title?.toLowerCase().includes(q) ||
                    b.content?.toLowerCase().includes(q)
            );
        }
        if (statusFilter !== 'all') {
            list = list.filter((b) => b.status === statusFilter);
        }
        return list;
    }, [blogs, search, statusFilter]);

    const handleViewClick = (blog: Blog) => {
        setSelectedBlog(blog);
        setDetailDialogOpen(true);
    };

    const handleApproveClick = (blog: Blog) => {
        setSelectedBlog(blog);
        setPendingAction('approve');
        setActionDialogOpen(true);
    };

    const handleRejectClick = (blog: Blog) => {
        setSelectedBlog(blog);
        setPendingAction('reject');
        setActionDialogOpen(true);
    };

    const handleConfirmAction = async () => {
        if (!selectedBlog || !pendingAction) return;

        setIsActionLoading(true);
        try {
            if (pendingAction === 'approve') {
                await blogService.approveBlog(selectedBlog._id);
            } else {
                await blogService.rejectBlog(selectedBlog._id);
            }
            fetchBlogs();
            setActionDialogOpen(false);
        } catch (error) {
            console.error(`Error ${pendingAction}ing blog:`, error);
        } finally {
            setIsActionLoading(false);
        }
    };

    const getStatusBadge = (status: BlogStatus) => {
        const variants: Record<BlogStatus, string> = {
            APPROVED: 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30',
            PENDING_APPROVAL: 'bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30',
            REJECTED: 'bg-red-500/20 text-red-300 hover:bg-red-500/30',
        };
        return variants[status] || 'bg-slate-700 text-slate-200';
    };

    const getStatusLabel = (status: BlogStatus) => {
        const labels: Record<BlogStatus, string> = {
            APPROVED: 'Approved',
            PENDING_APPROVAL: 'Pending',
            REJECTED: 'Rejected',
        };
        return labels[status] || status;
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '—';
        try {
            return format(new Date(dateString), 'MMM d, yyyy');
        } catch {
            return '—';
        }
    };

    return (
        <div className="space-y-6 text-slate-50">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-50">Blog Management</h1>
                    <p className="text-sm text-slate-400 mt-1">Review and manage blog posts</p>
                </div>
            </div>

            {/* Filters Card */}
            <Card className="bg-slate-900/60 border-slate-700">
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 space-y-2">
                            <Label htmlFor="search" className="text-slate-200">Search</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    id="search"
                                    placeholder="Search by title or content..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10 bg-slate-900/60 border-slate-700 text-slate-50 placeholder:text-slate-500"
                                />
                            </div>
                        </div>
                        <div className="w-full sm:w-[200px] space-y-2">
                            <Label htmlFor="status" className="text-slate-200">Status</Label>
                            <Select
                                value={statusFilter}
                                onValueChange={(v) => setStatusFilter(v as BlogStatus | 'all')}
                            >
                                <SelectTrigger
                                    id="status"
                                    className="bg-slate-900/60 border-slate-700 text-slate-50"
                                >
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="PENDING_APPROVAL">Pending</SelectItem>
                                    <SelectItem value="APPROVED">Approved</SelectItem>
                                    <SelectItem value="REJECTED">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Blogs Table Card */}
            <Card className="bg-slate-900/60 border-slate-700">
                <CardHeader>
                    <CardTitle className="text-slate-50">Blogs ({filteredBlogs.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[80px] text-slate-50">Image</TableHead>
                                    <TableHead className="text-slate-50">Title</TableHead>
                                    <TableHead className="text-slate-50">Status</TableHead>
                                    <TableHead className="text-slate-50">Views</TableHead>
                                    <TableHead className="text-slate-50">Created</TableHead>
                                    <TableHead className="text-right text-slate-50">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell><Skeleton className="h-10 w-10 rounded" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                                            <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                            <TableCell><Skeleton className="h-8 w-32 ml-auto" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : filteredBlogs.length === 0 ? (
                                    <TableRow key="empty">
                                        <TableCell colSpan={6} className="text-center py-12">
                                            <div className="flex flex-col items-center text-slate-400">
                                                <FileText className="h-12 w-12 mb-3 text-slate-600" />
                                                <p className="text-lg font-semibold text-slate-300">No blogs found</p>
                                                <p className="text-sm mt-1">
                                                    {search || statusFilter !== 'all'
                                                        ? 'Try adjusting your filters'
                                                        : 'No blog posts have been created yet'}
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredBlogs.map((blog, index) => (
                                        <TableRow
                                            key={blog._id ?? `blog-${index}`}
                                            className="hover:bg-slate-800/70"
                                        >
                                            <TableCell>
                                                {blog.thumbnailUrl ? (
                                                    <img
                                                        src={blog.thumbnailUrl}
                                                        alt={blog.title}
                                                        className="h-10 w-10 rounded object-cover"
                                                    />
                                                ) : (
                                                    <div className="h-10 w-10 rounded bg-slate-800 flex items-center justify-center text-slate-400">
                                                        <FileText className="h-5 w-5" />
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell className="font-medium max-w-[250px] truncate text-slate-50">
                                                {blog.title}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={getStatusBadge(blog.status)}>
                                                    {getStatusLabel(blog.status)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-slate-300">
                                                {blog.viewCount}
                                            </TableCell>
                                            <TableCell className="text-slate-300">
                                                {formatDate(blog.created_at)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleViewClick(blog)}
                                                        className="text-slate-300 hover:text-slate-50 hover:bg-slate-800"
                                                        title="View details"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    {blog.status === 'PENDING_APPROVAL' && (
                                                        <>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleApproveClick(blog)}
                                                                className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                                                                title="Approve"
                                                            >
                                                                <Check className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleRejectClick(blog)}
                                                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                                title="Reject"
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Detail Dialog */}
            <AlertDialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
                <AlertDialogContent className="bg-slate-900 border-slate-700 max-w-2xl max-h-[80vh] overflow-y-auto">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-slate-50 text-xl">
                            {selectedBlog?.title}
                        </AlertDialogTitle>
                        <AlertDialogDescription asChild>
                            <div className="space-y-4 text-left">
                                {selectedBlog?.thumbnailUrl && (
                                    <div className="w-full aspect-video rounded-lg overflow-hidden">
                                        <img
                                            src={selectedBlog.thumbnailUrl}
                                            alt={selectedBlog.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                                <div className="flex flex-wrap gap-3">
                                    <Badge className={getStatusBadge(selectedBlog?.status || 'PENDING_APPROVAL')}>
                                        {getStatusLabel(selectedBlog?.status || 'PENDING_APPROVAL')}
                                    </Badge>
                                    <span className="text-slate-400 text-sm">
                                        {selectedBlog?.viewCount} views
                                    </span>
                                    <span className="text-slate-400 text-sm">
                                        Created: {formatDate(selectedBlog?.created_at || null)}
                                    </span>
                                </div>
                                <div className="bg-slate-800/50 rounded-lg p-4">
                                    <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                                        {selectedBlog?.content}
                                    </p>
                                </div>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700">
                            Close
                        </AlertDialogCancel>
                        {selectedBlog?.status === 'PENDING_APPROVAL' && (
                            <>
                                <AlertDialogAction
                                    onClick={() => {
                                        setDetailDialogOpen(false);
                                        handleRejectClick(selectedBlog);
                                    }}
                                    className="bg-red-600 hover:bg-red-500 text-white"
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    Reject
                                </AlertDialogAction>
                                <AlertDialogAction
                                    onClick={() => {
                                        setDetailDialogOpen(false);
                                        handleApproveClick(selectedBlog);
                                    }}
                                    className="bg-emerald-600 hover:bg-emerald-500 text-white"
                                >
                                    <Check className="h-4 w-4 mr-2" />
                                    Approve
                                </AlertDialogAction>
                            </>
                        )}
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Action Confirmation Dialog */}
            <AlertDialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
                <AlertDialogContent className="bg-slate-900 border-slate-700">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-slate-50">
                            {pendingAction === 'approve' ? 'Approve Blog' : 'Reject Blog'}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-400">
                            {pendingAction === 'approve'
                                ? 'Are you sure you want to approve this blog post? It will be visible to all users.'
                                : 'Are you sure you want to reject this blog post? The author will be notified.'}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                            disabled={isActionLoading}
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmAction}
                            disabled={isActionLoading}
                            className={
                                pendingAction === 'approve'
                                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                    : 'bg-red-600 hover:bg-red-500 text-white'
                            }
                        >
                            {isActionLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : pendingAction === 'approve' ? (
                                <>
                                    <Check className="h-4 w-4 mr-2" />
                                    Approve
                                </>
                            ) : (
                                <>
                                    <X className="h-4 w-4 mr-2" />
                                    Reject
                                </>
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

export default BlogManagementPage;
