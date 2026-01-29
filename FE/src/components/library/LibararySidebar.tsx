/**
 * GameSidebar Component
 * Sidebar chứa search, filter theo genre và danh sách tên game
 */
import { Gamepad2, Search } from 'lucide-react';
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
import { useNavigate } from 'react-router-dom';

interface GameSidebarProps {
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

export function GameSidebar({
    className,
    searchValue,
    onSearchChange,
    genreFilter,
    onGenreFilterChange,
    genres,
    games,
    selectedGameId,
    onSelectGame,
}: GameSidebarProps) {
    const navigate = useNavigate();
    return (
        <div
            className={cn(
                'fixed left-0 top-0 h-screen w-64 bg-[#171a21] border-r border-[#1b2838] flex flex-col z-40 hidden md:flex',
                className
            )}
        >
            {/* Logo/Title */}
            <div className="p-4 border-b border-[#1b2838] shrink-0">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-[#1b2838] rounded-lg">
                        <button onClick={() => navigate('/')}>
                            <Gamepad2 className="h-6 w-6 text-[#66c0f4]" />
                        </button>
                    </div>
                    <div>
                        <h1 className="text-white font-bold text-lg">PlatFun</h1>
                        <p className="text-[#8f98a0] text-xs">Management Portal</p>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-[#1b2838] shrink-0">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8f98a0]" />
                    <Input
                        type="text"
                        placeholder="Tìm theo tên game..."
                        value={searchValue}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-9 h-9 bg-[#0e1621] border-[#2a475e] text-white placeholder:text-[#8f98a0] focus:border-[#66c0f4] focus:ring-[#66c0f4] text-sm"
                    />
                </div>
            </div>

            {/* Filter by Genre */}
            <div className="px-4 pb-4 border-b border-[#1b2838] shrink-0">
                <label className="text-[#8f98a0] text-xs font-medium block mb-2">
                    Thể loại
                </label>
                <Select
                    value={genreFilter}
                    onValueChange={(value) =>
                        onGenreFilterChange(value as GameGenre | 'all')
                    }
                >
                    <SelectTrigger className="w-full h-9 bg-[#0e1621] border-[#2a475e] text-white text-sm focus:border-[#66c0f4]">
                        <SelectValue placeholder="Tất cả thể loại" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1b2838] border-[#2a475e]">
                        <SelectItem
                            value="all"
                            className="text-white hover:bg-[#2a475e] focus:bg-[#2a475e]"
                        >
                            Tất cả thể loại
                        </SelectItem>
                        {genres.map((genre) => (
                            <SelectItem
                                key={genre}
                                value={genre}
                                className="text-white hover:bg-[#2a475e] focus:bg-[#2a475e]"
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
                    <p className="text-[#8f98a0] text-xs font-medium px-2 pb-2">
                        Danh sách game ({games.length})
                    </p>
                    <ul className="space-y-0.5">
                        {games.length === 0 ? (
                            <li className="px-3 py-2 text-sm text-[#8f98a0]">
                                Không có game nào
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
                                                    ? 'bg-[#1b2838] text-[#66c0f4] font-medium'
                                                    : 'text-[#c7d5e0] hover:bg-[#1b2838] hover:text-white'
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
            <div className="p-4 border-t border-[#1b2838] shrink-0">
                <div className="text-xs text-[#8f98a0] text-center">
                    <p>© 2024 PlatFun</p>
                </div>
            </div>
        </div>
    );
}
