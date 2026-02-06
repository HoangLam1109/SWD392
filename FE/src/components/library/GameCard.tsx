
import type { Game } from '@/types/Game.types';

interface GameCardProps {
    game: Game;
}

export function GameCard({ game }: GameCardProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div className="group relative bg-slate-900/50 border border-slate-700/50 rounded-lg overflow-hidden hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-1">
            {/* Game Thumbnail */}
            <div className="relative w-full aspect-[460/215] overflow-hidden bg-slate-800/50">
                <img
                    src={game.thumbnail}
                    alt={game.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
            </div>

            {/* Game Info */}
            <div className="p-4 space-y-3">
                {/* Title and Genre */}
                <div>
                    <h3 className="text-white font-semibold text-lg mb-1 line-clamp-1 group-hover:text-blue-400 transition-colors">
                        {game.title}
                    </h3>
                    <p className="text-slate-400 text-sm">{game.genre}</p>
                </div>

                {/* Price and Release Date */}
                <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">{formatDate(game.releaseDate)}</span>
                </div>

                {/* Developer/Publisher Info */}
                <div className="flex items-center justify-between">
                    <div className="text-xs text-slate-400 space-y-1">
                        <p>
                            <span className="text-blue-400">Developer:</span> {game.developer}
                        </p>
                        <p>
                            <span className="text-blue-400">Publisher:</span> {game.publisher}
                        </p>
                    </div>
                    <button className="text-blue-400 ml-4 whitespace-nowrap bg-slate-800/50 border border-slate-600 rounded-md px-2 py-1 hover:bg-slate-700 hover:text-white transition-colors">Play</button>
                </div>
            </div>
        </div>
    );
}
