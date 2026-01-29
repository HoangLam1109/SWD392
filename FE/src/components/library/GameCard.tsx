
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
        <div className="group relative bg-[#1b2838] rounded-lg overflow-hidden hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-1">
            {/* Game Thumbnail */}
            <div className="relative w-full aspect-[460/215] overflow-hidden bg-[#0e1621]">
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
                    <h3 className="text-white font-semibold text-lg mb-1 line-clamp-1 group-hover:text-[#66c0f4] transition-colors">
                        {game.title}
                    </h3>
                    <p className="text-[#8f98a0] text-sm">{game.genre}</p>
                </div>

                {/* Price and Release Date */}
                <div className="flex items-center justify-between text-sm">
                    <span className="text-[#8f98a0]">{formatDate(game.releaseDate)}</span>
                </div>

                {/* Developer/Publisher Info */}
                <div className="flex items-center justify-between">
                    <div className="text-xs text-[#8f98a0] space-y-1">
                        <p>
                            <span className="text-[#66c0f4]">Developer:</span> {game.developer}
                        </p>
                        <p>
                            <span className="text-[#66c0f4]">Publisher:</span> {game.publisher}
                        </p>
                    </div>
                    <button className="text-[#66c0f4] ml-4 whitespace-nowrap bg-[#1b2838] border border-[#2a475e] rounded-md px-2 py-1 hover:bg-[#2a475e] hover:text-white transition-colors">Play</button>
                </div>

                
            </div>
        </div>
    );
}
