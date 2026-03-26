import { useMemo, useState } from 'react';
import { GameCard } from '@/components/library/GameCard';
import { LibrarySidebar } from '@/components/library/LibararySidebar';
import { Navbar } from '@/components/home/navbar';
import { useGetMyLibraryGames } from '@/hooks/library/useGetMyLibraryGames';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { LibraryFilters } from '@/types/LibraryGame.types';

export function LibraryPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGameId, setSelectedGameId] = useState<string | undefined>();
    const [filters, setFilters] = useState<LibraryFilters>({
        category: 'all',
        sortBy: 'title',
        sortOrder: 'asc',
    });
    const {
        data: libraryGames = [],
        currentUser,
        isLoading,
        error,
    } = useGetMyLibraryGames();

    const filteredAndSortedGames = useMemo(() => {
        let result = [...libraryGames];

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter((game) =>
                game.title.toLowerCase().includes(query)
            );
        }

        if (filters.category !== 'all') {
            result = result.filter((game) => {
                const category = game.categoryName ?? game.genre;
                return category === filters.category;
            });
        }

        result.sort((a, b) => {
            let comparison = 0;

            switch (filters.sortBy) {
                case 'releaseDate':
                    comparison =
                        new Date(a.releaseDate ?? 0).getTime() -
                        new Date(b.releaseDate ?? 0).getTime();
                    break;
                case 'title':
                    comparison = a.title.localeCompare(b.title);
                    break;
                default:
                    comparison = 0;
            }

            return filters.sortOrder === 'asc' ? comparison : -comparison;
        });

        return result;
    }, [filters, libraryGames, searchQuery]);

    const categories = useMemo(() => {
        return Array.from(
            new Set(
                libraryGames
                    .map((game) => game.categoryName ?? '')
                    .filter((category): category is string => Boolean(category))
            )
        ).sort((a, b) => a.localeCompare(b));
    }, [libraryGames]);

    return (
        <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
            <div className="fixed inset-0 bg-linear-to-br from-blue-950/30 via-slate-950 to-purple-950/30 pointer-events-none" />
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)] pointer-events-none" />

            <div className="relative z-10 flex flex-col min-h-screen">
                <Navbar fixed />

                <div className="flex flex-1 min-h-0 relative pt-[7.5rem]">
                    <LibrarySidebar
                        searchValue={searchQuery}
                        onSearchChange={setSearchQuery}
                        categoryFilter={filters.category}
                        onCategoryFilterChange={(value) =>
                            setFilters((prev) => ({ ...prev, category: value }))
                        }
                        categories={categories}
                        games={filteredAndSortedGames}
                        selectedGameId={selectedGameId}
                        onSelectGame={(game) => setSelectedGameId(game.gameId)}
                        className="top-[7.5rem] h-[calc(100vh-7.5rem)]"
                    />

                    <main className="flex-1 w-full md:ml-64 flex flex-col min-h-[calc(100vh-7.5rem)] overflow-hidden">
                        <div className="shrink-0 bg-slate-900/50 border-b border-slate-700/50 px-6 py-4">
                            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                <div className="flex items-center gap-2">
                                    <label className="text-slate-400 text-sm font-medium whitespace-nowrap">
                                        Sort by:
                                    </label>
                                    <Select
                                        value={filters.sortBy}
                                        onValueChange={(value) =>
                                            setFilters((prev) => ({
                                                ...prev,
                                                sortBy: value as LibraryFilters['sortBy'],
                                            }))
                                        }
                                    >
                                        <SelectTrigger className="w-[150px] bg-slate-900/80 border-slate-600 text-white focus:border-blue-400">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-900 border-slate-600">
                                            <SelectItem
                                                value="title"
                                                className="text-white hover:bg-slate-700 focus:bg-slate-700"
                                            >
                                                Title
                                            </SelectItem>
                                            <SelectItem
                                                value="releaseDate"
                                                className="text-white hover:bg-slate-700 focus:bg-slate-700"
                                            >
                                                Release Date
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <Select
                                        value={filters.sortOrder}
                                        onValueChange={(value) =>
                                            setFilters((prev) => ({
                                                ...prev,
                                                sortOrder: value as 'asc' | 'desc',
                                            }))
                                        }
                                    >
                                        <SelectTrigger className="w-[120px] bg-slate-900/80 border-slate-600 text-white focus:border-blue-400">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-900 border-slate-600">
                                            <SelectItem
                                                value="asc"
                                                className="text-white hover:bg-slate-700 focus:bg-slate-700"
                                            >
                                                Ascending
                                            </SelectItem>
                                            <SelectItem
                                                value="desc"
                                                className="text-white hover:bg-slate-700 focus:bg-slate-700"
                                            >
                                                Descending
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="ml-auto text-sm text-slate-400">
                                    <span className="text-blue-400 font-semibold">
                                        {filteredAndSortedGames.length}
                                    </span>{' '}
                                    / {libraryGames.length} games
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                            {isLoading ? (
                                <LibraryStateCard
                                    title="Loading library..."
                                    description="Fetching your games from the API."
                                />
                            ) : !currentUser ? (
                                <LibraryStateCard
                                    title="Sign in to view your library"
                                    description="Your library is loaded from the library-game API for the current account."
                                />
                            ) : error ? (
                                <LibraryStateCard
                                    title="Failed to load library"
                                    description={error.message || 'Please try again later.'}
                                />
                            ) : filteredAndSortedGames.length === 0 ? (
                                <LibraryStateCard
                                    title="No games found"
                                    description={
                                        searchQuery || filters.category !== 'all'
                                            ? 'Try adjusting your search or filters'
                                            : 'No games were found in your library yet'
                                    }
                                />
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {filteredAndSortedGames.map((game) => (
                                        <GameCard
                                            key={game.libraryGameId}
                                            game={game}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

function LibraryStateCard({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-12 max-w-md">
                <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
                <p className="text-slate-400">{description}</p>
            </div>
        </div>
    );
}
