/**
 * LibraryPage Component
 * Steam-inspired game management interface with dark theme
 */
import { useState, useMemo } from 'react';
import { GameHeader } from '@/components/library/LibraryHeader';
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
import { GameSidebar } from '@/components/library/LibararySidebar';

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
        <div className="flex h-screen bg-[#0e1621] overflow-hidden">
            <GameSidebar
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
            />
            {/* Main Content Area */}
            <div className="flex-1 md:ml-64 flex flex-col overflow-hidden">
                <GameHeader />

                {/* Sort Bar (chỉ sort, filter đã chuyển vào sidebar) */}
                <div className="bg-[#1b2838] border-b border-[#2a475e] px-6 py-4">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                        {/* Sort Options */}
                        <div className="flex items-center gap-2">
                            <label className="text-[#8f98a0] text-sm font-medium whitespace-nowrap">
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
                                <SelectTrigger className="w-[150px] bg-[#0e1621] border-[#2a475e] text-white focus:border-[#66c0f4]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1b2838] border-[#2a475e]">
                                    <SelectItem
                                        value="title"
                                        className="text-white hover:bg-[#2a475e] focus:bg-[#2a475e]"
                                    >
                                        Title
                                    </SelectItem>
                                    <SelectItem
                                        value="releaseDate"
                                        className="text-white hover:bg-[#2a475e] focus:bg-[#2a475e]"
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
                                <SelectTrigger className="w-[120px] bg-[#0e1621] border-[#2a475e] text-white focus:border-[#66c0f4]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1b2838] border-[#2a475e]">
                                    <SelectItem
                                        value="asc"
                                        className="text-white hover:bg-[#2a475e] focus:bg-[#2a475e]"
                                    >
                                        Ascending
                                    </SelectItem>
                                    <SelectItem
                                        value="desc"
                                        className="text-white hover:bg-[#2a475e] focus:bg-[#2a475e]"
                                    >
                                        Descending
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="ml-auto text-sm text-[#8f98a0]">
                            <span className="text-[#66c0f4] font-semibold">{filteredAndSortedGames.length}</span> / {mockGames.length} games
                        </div>
                    </div>
                </div>

                {/* Game Grid */}
                <div className="flex-1 overflow-y-auto p-6">
                    {filteredAndSortedGames.length === 0 ? (
                        // Empty State
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <div className="bg-[#1b2838] rounded-lg p-12 max-w-md">
                                <h3 className="text-2xl font-bold text-white mb-2">
                                    No games found
                                </h3>
                                <p className="text-[#8f98a0] mb-6">
                                    {searchQuery || filters.genre !== 'all'
                                        ? 'Try adjusting your search or filters'
                                        : 'Get started by adding your first game'}
                                </p>
                                {(!searchQuery && filters.genre === 'all') && (
                                    <button
                                        className="px-6 py-3 bg-[#66c0f4] hover:bg-[#4a9bc4] text-white font-semibold rounded-md transition-colors"
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
            </div>
        </div>
    );
}
