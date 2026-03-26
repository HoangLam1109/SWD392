import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { AxiosError } from 'axios';
import { ImageWithFallback } from '../ui/image-with-fallback';
import { getImageUrl } from '@/lib/imageUtils';
import type { Game } from '@/types/Game.types';
import { useAddGameToCart } from '@/hooks/cart/useAddGameToCart';
import { toast } from 'sonner';

interface GameCardProps {
  game: Game;
  /** User already owns this game — do not allow add to cart */
  isOwned?: boolean;
}

export function GameCard({ game, isOwned = false }: GameCardProps) {
  const { t } = useTranslation();
  const { mutate: addToCart, isPending } = useAddGameToCart();

  const hasDiscount = typeof game.discount === 'number' && game.discount > 0;
  const originalPrice = game.price ?? 0;
  const finalPrice = hasDiscount ? originalPrice * (1 - game.discount! / 100) : originalPrice;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOwned) return;
    addToCart(game._id, {
      onSuccess: () => {
        toast.success(t('cart.added', { defaultValue: 'Game added to cart' }));
      },
      onError: (error) => {
        const axiosError = error as AxiosError<{ message?: string }>;
        const backendMessage = axiosError.response?.data?.message;
        if (backendMessage === 'Product already in cart') {
          toast.error(t('cart.alreadyAdded', { defaultValue: 'Game already added' }));
          return;
        }
        toast.error(backendMessage || error.message || t('cart.error', { defaultValue: 'Failed to add to cart' }));
      }
    });
  };

  return (
    <Link
      to={`/store/${game._id}`}
      className="group relative block backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all hover:scale-[1.02]"
    >
      {/* Cover Image */}
      <div className="relative h-64 overflow-hidden">
        <ImageWithFallback
          src={getImageUrl(game.thumbnail) || getImageUrl(game.coverImage) || ''}
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
          <div className="flex flex-col items-start gap-0.5">
            {hasDiscount && originalPrice > 0 && (
              <span className="text-slate-500 line-through text-xs sm:text-sm">
                {originalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
              </span>
            )}
            <span
              className={`font-bold ${finalPrice === 0 ? 'text-green-400' : 'text-white'} text-lg sm:text-2xl`}
            >
              {finalPrice === 0
                ? t('common.free')
                : finalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isPending || isOwned}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all group/btn shadow-lg ${
              isOwned
                ? 'bg-slate-700 text-slate-300 cursor-not-allowed'
                : 'bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
          >
            <ShoppingCart className={`w-4 h-4 ${isPending ? 'animate-pulse' : 'group-hover/btn:scale-110'} transition-transform`} />
            <span className="text-sm font-medium">
              {isOwned
                ? t('store.owned', { defaultValue: 'Owned' })
                : isPending
                  ? t('common.adding', { defaultValue: 'Adding...' })
                  : t('common.add')}
            </span>
          </button>
        </div>
      </div>
    </Link>
  );
}
