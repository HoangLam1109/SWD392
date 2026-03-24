import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2, Tag } from 'lucide-react';
import { ImageWithFallback } from '../ui/image-with-fallback';
import type { CartItemWithGame } from '@/types/Cart.types';
import { motion } from 'framer-motion';
import { getImageUrl } from '@/lib/imageUtils';

interface CartItemCardProps {
  item: CartItemWithGame;
  onRemove: (productId: string) => void;
}

export function CartItemCard({ item, onRemove }: CartItemCardProps) {
  const { t } = useTranslation();
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      onRemove(item.productId);
    }, 300);
  };

  const game = item.game;
  const finalPrice = item.priceAtPurchase * (1 - item.discount / 100);
  const originalPrice = item.discount > 0 ? item.priceAtPurchase : null;
  const imageUrl = getImageUrl(game.thumbnail || game.coverImage) || '';

  return (
    <motion.div
      layout
      initial={{ opacity: 1, scale: 1 }}
      animate={{
        opacity: isRemoving ? 0 : 1,
        scale: isRemoving ? 0.8 : 1,
      }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      className="group relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all"
    >
      <div className="flex flex-col sm:flex-row gap-4 p-4 sm:p-6">
        {/* Product Image */}
        <div className="relative w-full sm:w-32 h-40 sm:h-32 shrink-0">
          <ImageWithFallback
            src={imageUrl}
            alt={game.title}
            className="w-full h-full object-cover rounded-lg"
          />
          {item.discount > 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold">
              -{item.discount}%
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <h3 className="text-lg font-semibold mb-1 group-hover:text-blue-400 transition-colors">
                  {game.title}
                </h3>
                <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
                  {game.developer && (
                    <>
                      <span>{game.developer}</span>
                    </>
                  )}
                </div>
              </div>
              <button
                onClick={handleRemove}
                className="p-2 rounded-lg hover:bg-red-500/20 hover:text-red-400 transition-colors shrink-0"
                aria-label={t('cart.removeItem')}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4">
            {/* Price */}
            <div className="flex items-center gap-3">
              {originalPrice && (
                <span className="text-slate-500 line-through text-sm">
                  {originalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                </span>
              )}
              <span className="text-2xl font-bold text-white">
                {finalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Savings Badge */}
      {item.discount > 0 && originalPrice && (
        <div className="absolute top-4 left-4 sm:top-auto sm:bottom-4 sm:left-4">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-green-500/20 border border-green-500/30 backdrop-blur-sm">
            <Tag className="w-3.5 h-3.5 text-green-400" />
            <span className="text-xs font-medium text-green-400">
              Save VNĐ{(originalPrice - finalPrice).toFixed(2)}
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
