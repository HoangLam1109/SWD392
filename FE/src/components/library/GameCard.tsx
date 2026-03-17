import { useTranslation } from 'react-i18next';
import type { LibraryGameView } from '@/types/LibraryGame.types';

interface GameCardProps {
    game: LibraryGameView;
}

export function GameCard({ game }: GameCardProps) {
    const { t } = useTranslation();

    const formatDate = (dateString?: string) => {
        if (!dateString) {
            return 'Unknown';
        }

        const date = new Date(dateString);

        if (Number.isNaN(date.getTime())) {
            return 'Unknown';
        }

        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatPlaytime = (minutes: number) => {
        if (minutes < 60) {
            return `${minutes}m`;
        }

        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;

        return remainingMinutes > 0
            ? `${hours}h ${remainingMinutes}m`
            : `${hours}h`;
    };

    const handlePlay = () => {
        if (!game.url) {
            return;
        }

        window.open(game.url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="group relative bg-slate-900/50 border border-slate-700/50 rounded-lg overflow-hidden hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-1">
            {/* Game Thumbnail */}
            <div className="relative w-full aspect-[460/215] overflow-hidden bg-slate-800/50">
                <img
                    src={game.thumbnail || 'https://placehold.co/460x215/0f172a/e2e8f0?text=No+Image'}
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
                    <span className="text-emerald-400">{game.status}</span>
                </div>

                {/* Developer/Publisher Info */}
                <div className="flex items-center justify-between">
                    <div className="text-xs text-slate-400 space-y-1">
                        <p>
                            <span className="text-blue-400">{t('common.developer')}:</span> {game.developer}
                        </p>
                        <p>
                            <span className="text-blue-400">{t('common.publisher')}:</span> {game.publisher}
                        </p>
                        <p>
                            <span className="text-blue-400">Playtime:</span> {formatPlaytime(game.totalPlaytime)}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handlePlay}
                        disabled={!game.url}
                        className="text-blue-400 ml-4 whitespace-nowrap bg-slate-800/50 border border-slate-600 rounded-md px-2 py-1 hover:bg-slate-700 hover:text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {t('common.play')}
                    </button>
                </div>
            </div>
        </div>
    );
}
