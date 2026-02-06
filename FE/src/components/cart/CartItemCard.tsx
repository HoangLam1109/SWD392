import { useState } from 'react';
import { Trash2, Tag } from 'lucide-react';
import { ImageWithFallback } from '../ui/image-with-fallback';
import type { CartItem } from './mockCartData';
import { motion } from 'framer-motion';

interface CartItemCardProps {
  item: CartItem;
  onQuantityChange: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
}

export function CartItemCard({ item, onRemove }: CartItemCardProps) {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      onRemove(item.id);
    }, 300);
  };

  

  const itemTotal = item.price * item.quantity;
  const originalTotal = item.originalPrice ? item.originalPrice * item.quantity : null;

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
            src={item.coverImage}
            alt={item.title}
            className="w-full h-full object-cover rounded-lg"
          />
          {item.discount && (
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
                  {item.title}
                </h3>
                <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">
                    {item.category}
                  </span>
                  <span>•</span>
                  <span>{item.developer}</span>
                </div>
              </div>
              <button
                onClick={handleRemove}
                className="p-2 rounded-lg hover:bg-red-500/20 hover:text-red-400 transition-colors shrink-0"
                aria-label="Remove item"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4">
  

            {/* Price */}
            <div className="flex items-center gap-3">
              {originalTotal && (
                <span className="text-slate-500 line-through text-sm">
                  ${originalTotal.toFixed(2)}
                </span>
              )}
              <span className="text-2xl font-bold text-white">
                ${itemTotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Savings Badge */}
      {item.discount && originalTotal && (
        <div className="absolute top-4 left-4 sm:top-auto sm:bottom-4 sm:left-4">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-green-500/20 border border-green-500/30 backdrop-blur-sm">
            <Tag className="w-3.5 h-3.5 text-green-400" />
            <span className="text-xs font-medium text-green-400">
              Save ${(originalTotal - itemTotal).toFixed(2)}
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
