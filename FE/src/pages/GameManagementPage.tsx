import { useState, useMemo } from 'react';
import type { Game, CreateGameDTO, UpdateGameDTO } from '@/types/Game.types';
import { GameDialog } from '@/components/dialog/game/GameDialog';
import { DeleteGameDialog } from '@/components/dialog/game/DeleteGameDialog';
import { DetailGameDialog } from '@/components/dialog/game/DetailGameDialog';
import { SystemRequirementDialog } from '@/components/dialog/game/SystemRequirementDialog';
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
import { Search, Pencil, Trash2, Plus, Eye, Cpu } from 'lucide-react';
import { useGetGames } from '@/hooks/game/useGetGames';
import { useCreateGame } from '@/hooks/game/useCreateGame';
import { useUpdateGame } from '@/hooks/game/useUpdateGame';
import { useDeleteGame } from '@/hooks/game/useDeleteGame';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { getImageUrl } from '@/lib/imageUtils';
import { useCreateCategory } from '@/hooks/category/useGetCategories';
import { CategoryDialog } from '@/components/dialog/category/CategoryDialog';

export function GameManagementPage() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [gameDialogOpen, setGameDialogOpen] = useState(false);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [systemDialogOpen, setSystemDialogOpen] = useState(false);
    const [createCategoryDialogOpen, setCreateCategoryDialogOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryDescription, setNewCategoryDescription] = useState('');
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);
    const [gameToView, setGameToView] = useState<Game | null>(null);
    const [gameForSystem, setGameForSystem] = useState<Game | null>(null);

    const { data: games = [], isLoading } = useGetGames();
    const createGameMutation = useCreateGame();
    const updateGameMutation = useUpdateGame();
    const deleteGameMutation = useDeleteGame();
    const createCategoryMutation = useCreateCategory();

    const filteredGames = useMemo(() => {
        let list = Array.isArray(games) ? games : [];
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(
                (g) =>
                    g.title?.toLowerCase().includes(q) ||
                    g.developer?.toLowerCase().includes(q) ||
                    g.publisher?.toLowerCase().includes(q)
            );
        }
        if (statusFilter === 'active') list = list.filter((g) => g.isActive);
        if (statusFilter === 'inactive') list = list.filter((g) => !g.isActive);
        return list;
    }, [games, search, statusFilter]);

    const handleCreateGame = (data: CreateGameDTO | UpdateGameDTO): Promise<void> => {
        return createGameMutation
            .mutateAsync(data as CreateGameDTO)
            .then(() => { setGameDialogOpen(false); }) as Promise<void>;
    };

    const handleUpdateGame = (data: UpdateGameDTO): Promise<void> => {
        if (!selectedGame?._id) return Promise.reject(new Error('No game selected'));
        return updateGameMutation
            .mutateAsync({ id: selectedGame._id, data })
            .then(() => { setGameDialogOpen(false); }) as Promise<void>;
    };

    const handleDeleteGame = (): Promise<void> => {
        if (!selectedGame?._id) return Promise.reject(new Error('No game selected'));
        return deleteGameMutation.mutateAsync(selectedGame._id).then(() => undefined);
    };

    const handleEditClick = (game: Game) => {
        setSelectedGame(game);
        setGameDialogOpen(true);
    };

    const handleDeleteClick = (game: Game) => {
        setSelectedGame(game);
        setDeleteDialogOpen(true);
    };

    const handleViewClick = (game: Game) => {
        setGameToView(game);
        setDetailDialogOpen(true);
    };

    const handleSystemClick = (game: Game) => {
        setGameForSystem(game);
        setSystemDialogOpen(true);
    };

    const openCreateDialog = () => {
        setSelectedGame(null);
        setGameDialogOpen(true);
    };

    const openCreateCategoryDialog = () => {
        setNewCategoryName('');
        setNewCategoryDescription('');
        setCreateCategoryDialogOpen(true);
    };

    const handleCreateCategory = (): Promise<void> => {
        return createCategoryMutation
            .mutateAsync({
                name: newCategoryName,
                description: newCategoryDescription || undefined,
            })
            .then(() => {
                setCreateCategoryDialogOpen(false);
            }) as Promise<void>;
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(price);
    };

    

    return (
        <div className="space-y-6 text-slate-50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-50">Game Management</h1>
                    <p className="text-sm text-slate-50 mt-1">Manage games and store visibility</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        onClick={openCreateCategoryDialog}
                        variant="outline"
                        className="border-slate-600 text-slate-50 hover:bg-slate-800"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Category
                    </Button>
                    <Button
                        onClick={openCreateDialog}
                        className="bg-blue-600 hover:bg-blue-700 text-slate-50"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Game
                    </Button>
                </div>
            </div>

            <Card className="bg-slate-900/60 border-slate-700">
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 space-y-2">
                            <Label htmlFor="search" className="text-slate-200">Search</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    id="search"
                                    placeholder="Search by title, developer, publisher..."
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
                                onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}
                            >
                                <SelectTrigger
                                    id="status"
                                    className="bg-slate-900/60 border-slate-700 text-slate-50"
                                >
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-slate-900/60 border-slate-700">
                <CardHeader>
                    <CardTitle className="text-slate-50">Games ({filteredGames.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[80px] text-slate-50">Image</TableHead>
                                    <TableHead className="text-slate-50">Title</TableHead>
                                    <TableHead className="text-slate-50">Price</TableHead>
                                    <TableHead className="text-slate-50">Discount</TableHead>
                                    <TableHead className="text-slate-50">Status</TableHead>
                                    <TableHead className="text-slate-50">Release</TableHead>
                                    <TableHead className="text-right text-slate-50">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell><Skeleton className="h-10 w-10 rounded" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                                            <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                            <TableCell><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : filteredGames.length === 0 ? (
                                    <TableRow key="empty">
                                        <TableCell colSpan={7} className="text-center py-12">
                                            <div className="flex flex-col items-center text-slate-50">
                                                <p className="text-lg font-semibold">No games found</p>
                                                <p className="text-sm mt-1">
                                                    {search || statusFilter !== 'all'
                                                        ? 'Try adjusting your filters'
                                                        : 'Add your first game with the button above'}
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredGames.map((game, index) => {
                                        const imageUrl = getImageUrl(game.thumbnail) || getImageUrl(game.coverImage) || '';
                                        return (
                                        <TableRow
                                            key={game._id ?? `game-${index}`}
                                            className="hover:bg-slate-800/70"
                                        >
                                            <TableCell>
                                                {imageUrl ? (
                                                    <ImageWithFallback
                                                        src={imageUrl}
                                                        alt={game.title}
                                                        className="h-10 w-10 rounded object-cover"
                                                    />
                                                ) : (
                                                    <div className="h-10 w-10 rounded bg-slate-800 flex items-center justify-center text-slate-400 text-xs">
                                                        —
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell className="font-medium max-w-[200px] truncate text-slate-50">
                                                {game.title}
                                            </TableCell>
                                            <TableCell className="text-slate-50">{formatPrice(game.price)}</TableCell>
                                            <TableCell className="text-slate-50">{game.discount ?? 0}%</TableCell>
                                            <TableCell>
                                                <Badge
                                                    className={
                                                        game.isActive
                                                            ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                                                            : 'bg-slate-700 text-slate-200 hover:bg-slate-700/80'
                                                    }
                                                >
                                                    {game.isActive ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-slate-50">
                                                {game.releaseDate}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleSystemClick(game)}
                                                        className="text-emerald-300 hover:text-emerald-200 hover:bg-emerald-500/10"
                                                        title="Manage system requirements"
                                                    >
                                                        <Cpu className="h-4 w-4 mr-1" />
                                                        System
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleViewClick(game)}
                                                        className="text-slate-300 hover:text-slate-50 hover:bg-slate-800"
                                                        title="View details"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleEditClick(game)}
                                                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDeleteClick(game)}
                                                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ); })
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <GameDialog
                open={gameDialogOpen}
                onOpenChange={setGameDialogOpen}
                game={selectedGame}
                onSave={selectedGame ? handleUpdateGame : handleCreateGame}
            />

            <DetailGameDialog
                open={detailDialogOpen}
                onOpenChange={setDetailDialogOpen}
                game={gameToView}
                onEdit={(game) => {
                    setDetailDialogOpen(false);
                    setSelectedGame(game);
                    setGameDialogOpen(true);
                }}
            />

            <DeleteGameDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                game={selectedGame}
                onConfirm={handleDeleteGame}
                isLoading={deleteGameMutation.isPending}
            />

            <SystemRequirementDialog
                open={systemDialogOpen}
                onOpenChange={setSystemDialogOpen}
                game={gameForSystem}
            />

            <CategoryDialog
                open={createCategoryDialogOpen}
                onOpenChange={setCreateCategoryDialogOpen}
                name={newCategoryName}
                description={newCategoryDescription}
                onNameChange={setNewCategoryName}
                onDescriptionChange={setNewCategoryDescription}
                onSubmit={handleCreateCategory}
                isSubmitting={createCategoryMutation.isPending}
            />
        </div>
    );
}
