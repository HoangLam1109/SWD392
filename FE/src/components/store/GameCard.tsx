import { useTranslation } from 'react-i18next';
import { ShoppingCart } from 'lucide-react';
import { ImageWithFallback } from '../ui/image-with-fallback';
import type { Game } from '@/types/Game.types';


interface GameCardProps {
  game: Game;
}


export function GameCard({ game }: GameCardProps) {
  const { t } = useTranslation();
  return (
    <div className="group relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all hover:scale-[1.02]">
      {/* Cover Image */}
      <div className="relative h-64 overflow-hidden">
        <ImageWithFallback
          src={game.coverImage || ''}
          alt={game.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
        
        {/* Discount Badge */}
        {game.discount && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
            -{game.discount}%
          </div>
        )}

      </div>

      {/* Game Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 line-clamp-1 group-hover:text-blue-400 transition-colors">
          {game.title}
        </h3>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {game.price && (
              <span className="text-slate-500 line-through text-sm">
                ${game.price}
              </span>
            )}
            <span className={`text-xl font-bold ${game.price === 0 ? 'text-green-400' : 'text-white'}`}>
              {game.price === 0 ? t('common.free') : `$${game.price}`}
            </span>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 transition-all group/btn shadow-lg">
            <ShoppingCart className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
            <span className="text-sm font-medium">{t('common.add')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
