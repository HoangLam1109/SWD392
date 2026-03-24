/**
 * LibraryPage Component
 * Game library interface - layout and colors match HomePage
 */
import { useState, useMemo } from 'react';
import { GameCard } from '@/components/library/GameCard';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { mockGames } from '@/components/library/mockGameData';
import { getAllGenres } from '@/components/library/mockGameData';
import type { GameFilters } from '@/types/Game.types';
import { LibrarySidebar } from '@/components/library/LibararySidebar';
import { Navbar } from '@/components/home/Navbar';

export function LibraryPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGameId, setSelectedGameId] = useState<string | undefined>();
    const [filters, setFilters] = useState<GameFilters>({
        genre: 'all',
        sortBy: 'title',
        sortOrder: 'asc',
    });

    // Filter and sort games
    const filteredAndSortedGames = useMemo(() => {
        let result = [...mockGames];

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter((game) =>
                game.title.toLowerCase().includes(query)
            );
        }

        // Filter by genre
        if (filters.genre !== 'all') {
            result = result.filter((game) => game.genre === filters.genre);
        }

        // Sort games
        result.sort((a, b) => {
            let comparison = 0;

            switch (filters.sortBy) {
                case 'releaseDate':
                    comparison =
                        new Date(a.releaseDate).getTime() -
                        new Date(b.releaseDate).getTime();
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
    }, [searchQuery, filters]);

    // Get all available genres
    const genres = getAllGenres();

    return (
        <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
            {/* Animated background gradient - same as HomePage */}
            <div className="fixed inset-0 bg-linear-to-br from-blue-950/30 via-slate-950 to-purple-950/30 pointer-events-none" />
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)] pointer-events-none" />

            <div className="relative z-10 flex flex-col min-h-screen">
                {/* Navbar fixed ở top khi scroll */}
                <Navbar fixed />

                {/* Layout: fixed sidebar + main content - pt để không bị navbar che */}
                <div className="flex flex-1 min-h-0 relative pt-[7.5rem]">
                    {/* LibrarySidebar - fixed bên trái, dưới navbar */}
                    <LibrarySidebar
                        searchValue={searchQuery}
                        onSearchChange={setSearchQuery}
                        genreFilter={filters.genre}
                        onGenreFilterChange={(value) =>
                            setFilters((prev) => ({ ...prev, genre: value }))
                        }
                        genres={genres}
                        games={filteredAndSortedGames}
                        selectedGameId={selectedGameId}
                        onSelectGame={(game) => setSelectedGameId(game.id)}
                        className="top-[7.5rem] h-[calc(100vh-7.5rem)]"
                    />
                    {/* Main Content - margin-left để không đè lên sidebar cố định */}
                    <main className="flex-1 w-full md:ml-64 flex flex-col min-h-[calc(100vh-7.5rem)] overflow-hidden">
                        {/* Sort Bar - cố định phía trên */}
                        <div className="shrink-0 bg-slate-900/50 border-b border-slate-700/50 px-6 py-4">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                        {/* Sort Options */}
                        <div className="flex items-center gap-2">
                            <label className="text-slate-400 text-sm font-medium whitespace-nowrap">
                                Sort by:
                            </label>
                            <Select
                                value={filters.sortBy}
                                onValueChange={(value) =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        sortBy: value as GameFilters['sortBy'],
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
                            <span className="text-blue-400 font-semibold">{filteredAndSortedGames.length}</span> / {mockGames.length} games
                        </div>
                    </div>
                </div>

                {/* Game Grid */}
                <div className="flex-1 overflow-y-auto p-6">
                    {filteredAndSortedGames.length === 0 ? (
                        // Empty State
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-12 max-w-md">
                                <h3 className="text-2xl font-bold text-white mb-2">
                                    No games found
                                </h3>
                                <p className="text-slate-400 mb-6">
                                    {searchQuery || filters.genre !== 'all'
                                        ? 'Try adjusting your search or filters'
                                        : 'Get started by adding your first game'}
                                </p>
                                {(!searchQuery && filters.genre === 'all') && (
                                    <button
                                        className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md transition-colors"
                                    >
                                        Add Your First Game
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        // Game Cards Grid
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredAndSortedGames.map((game) => (
                                <GameCard
                                    key={game.id}
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
