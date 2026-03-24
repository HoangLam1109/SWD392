/**
 * LibrarySidebar Component
 * Sidebar chứa search, filter theo genre và danh sách tên game
 */
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { Game, GameGenre } from '@/types/Game.types';

interface LibrarySidebarProps {
    className?: string;
    /** Giá trị ô tìm kiếm */
    searchValue: string;
    /** Callback khi đổi search */
    onSearchChange: (value: string) => void;
    /** Genre đang chọn (hoặc 'all') */
    genreFilter: GameGenre | 'all';
    /** Callback khi đổi genre */
    onGenreFilterChange: (value: GameGenre | 'all') => void;
    /** Danh sách genre cho dropdown */
    genres: string[];
    /** Danh sách game để hiển thị tên (thường là danh sách đã filter) */
    games: Game[];
    /** ID game đang được chọn (highlight trong list) */
    selectedGameId?: string;
    /** Callback khi click vào một game trong list */
    onSelectGame?: (game: Game) => void;
}

export function LibrarySidebar({
    className,
    searchValue,
    onSearchChange,
    genreFilter,
    onGenreFilterChange,
    genres,
    games,
    selectedGameId,
    onSelectGame,
}: LibrarySidebarProps) {
    const { t } = useTranslation();
    return (
        <aside
            className={cn(
                'fixed left-0 top-0 h-screen w-64 bg-slate-900/50 border-r border-slate-700/50 flex flex-col z-30 hidden md:flex backdrop-blur-sm',
                className
            )}
            aria-label="Library sidebar"
        >

            {/* Search */}
            <div className="p-4 border-b border-slate-700/50 shrink-0">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        type="text"
                        placeholder={t('library.sidebar.searchPlaceholder')}
                        value={searchValue}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-9 h-9 bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400 text-sm"
                    />
                </div>
            </div>

            {/* Filter by Genre */}
            <div className="px-4 pb-4 border-b border-slate-700/50 shrink-0">
                <label className="text-slate-400 text-xs font-medium block mb-2">
                    {t('library.sidebar.genre')}
                </label>
                <Select
                    value={genreFilter}
                    onValueChange={(value) =>
                        onGenreFilterChange(value as GameGenre | 'all')
                    }
                >
                    <SelectTrigger className="w-full h-9 bg-slate-800/50 border-slate-600 text-white text-sm focus:border-blue-400">
                        <SelectValue placeholder={t('library.sidebar.allGenres')} />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-600">
                        <SelectItem
                            value="all"
                            className="text-white hover:bg-slate-700 focus:bg-slate-700"
                        >
                            {t('library.sidebar.allGenres')}
                        </SelectItem>
                        {genres.map((genre) => (
                            <SelectItem
                                key={genre}
                                value={genre}
                                className="text-white hover:bg-slate-700 focus:bg-slate-700"
                            >
                                {genre}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Danh sách tên game */}
            <div className="flex-1 overflow-y-auto py-3">
                <div className="px-2">
                    <p className="text-slate-400 text-xs font-medium px-2 pb-2">
                        {t('library.sidebar.gameList', { count: games.length })}
                    </p>
                    <ul className="space-y-0.5">
                        {games.length === 0 ? (
                            <li className="px-3 py-2 text-sm text-slate-400">
                                {t('library.sidebar.noGames')}
                            </li>
                        ) : (
                            games.map((game) => {
                                const isSelected = selectedGameId === game.id;
                                return (
                                    <li key={game.id}>
                                        <button
                                            type="button"
                                            onClick={() => onSelectGame?.(game)}
                                            className={cn(
                                                'w-full text-left px-3 py-2 rounded-md text-sm transition-colors truncate',
                                                isSelected
                                                    ? 'bg-slate-700/50 text-blue-400 font-medium'
                                                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                                            )}
                                            title={game.title}
                                        >
                                            {game.title}
                                        </button>
                                    </li>
                                );
                            })
                        )}
                    </ul>
                </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-700/50 shrink-0">
                <div className="text-xs text-slate-400 text-center">
                    <p>© 2024 PlatFun</p>
                </div>
            </div>
        </aside>
    );
}
