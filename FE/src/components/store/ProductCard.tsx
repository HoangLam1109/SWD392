import { Star, ShoppingCart } from 'lucide-react';
import { ImageWithFallback } from '../ui/image-with-fallback';
import type { Product } from './mockStoreData';

interface ProductCardProps {
  product: Product;
}

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i < fullStars
              ? 'fill-yellow-400 text-yellow-400'
              : i === fullStars && hasHalfStar
              ? 'fill-yellow-400/50 text-yellow-400'
              : 'text-slate-600'
          }`}
        />
      ))}
    </div>
  );
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all hover:scale-[1.02]">
      {/* Cover Image */}
      <div className="relative h-64 overflow-hidden">
        <ImageWithFallback
          src={product.coverImage}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
        
        {/* Discount Badge */}
        {product.discount && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
            -{product.discount}%
          </div>
        )}

        {/* Featured Badge */}
        {product.featured && (
          <div className="absolute top-3 left-3 bg-linear-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
            Featured
          </div>
        )}

        {/* Rating */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-slate-950/80 backdrop-blur-sm px-2 py-1 rounded-lg">
          <StarRating rating={product.rating} />
          <span className="text-xs text-white/90">({product.reviews.toLocaleString()})</span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 line-clamp-1 group-hover:text-blue-400 transition-colors">
          {product.title}
        </h3>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {product.tags.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className="text-xs px-2 py-0.5 rounded-md bg-white/5 text-slate-400 border border-white/10"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {product.originalPrice && (
              <span className="text-slate-500 line-through text-sm">
                ${product.originalPrice}
              </span>
            )}
            <span className={`text-xl font-bold ${product.price === 0 ? 'text-green-400' : 'text-white'}`}>
              {product.price === 0 ? 'Free' : `$${product.price}`}
            </span>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 transition-all group/btn shadow-lg">
            <ShoppingCart className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
            <span className="text-sm font-medium">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
