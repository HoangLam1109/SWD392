import { Star, Plus } from 'lucide-react';
import { ImageWithFallback } from '../ui/image-with-fallback';

interface Game {
  id: number;
  title: string;
  coverImage: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviews: number;
}

const mockGames: Game[] = [
  {
    id: 1,
    title: 'Cyber Legends',
    coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=600&fit=crop',
    price: 29.99,
    originalPrice: 49.99,
    discount: 40,
    rating: 4.8,
    reviews: 12543,
  },
  {
    id: 2,
    title: 'Neon Warriors',
    coverImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=600&fit=crop',
    price: 39.99,
    rating: 4.9,
    reviews: 8921,
  },
  {
    id: 3,
    title: 'Space Odyssey',
    coverImage: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&h=600&fit=crop',
    price: 24.99,
    originalPrice: 34.99,
    discount: 29,
    rating: 4.7,
    reviews: 15678,
  },
  {
    id: 4,
    title: 'Dragon Realm',
    coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=600&fit=crop',
    price: 49.99,
    rating: 4.6,
    reviews: 10234,
  },
  {
    id: 5,
    title: 'Racing Legends',
    coverImage: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400&h=600&fit=crop',
    price: 19.99,
    originalPrice: 29.99,
    discount: 33,
    rating: 4.5,
    reviews: 8765,
  },
  {
    id: 6,
    title: 'Mystic Quest',
    coverImage: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&h=600&fit=crop',
    price: 34.99,
    rating: 4.8,
    reviews: 11234,
  },
];

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
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

export function GamesSection() {
  return (
    <section className="relative py-24">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Popular & <span className="bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Trending</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Discover the most popular games on our platform
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockGames.map((game) => (
            <div
              key={game.id}
              className="group relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all hover:scale-105"
            >
              {/* Cover Image */}
              <div className="relative h-64 overflow-hidden">
                <ImageWithFallback
                  src={game.coverImage}
                  alt={game.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/90 via-slate-950/50 to-transparent" />
                
                {/* Discount Badge */}
                {game.discount && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    -{game.discount}%
                  </div>
                )}

                {/* Rating */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <StarRating rating={game.rating} />
                  <span className="text-sm text-white/80">({game.reviews.toLocaleString()})</span>
                </div>
              </div>

              {/* Game Info */}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3">{game.title}</h3>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {game.originalPrice && (
                      <span className="text-slate-500 line-through text-sm">
                        ${game.originalPrice}
                      </span>
                    )}
                    <span className="text-2xl font-bold text-white">
                      ${game.price}
                    </span>
                  </div>

                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 transition-all group/btn">
                    <Plus className="w-4 h-4 group-hover/btn:rotate-90 transition-transform" />
                    <span className="text-sm font-medium">Add to Library</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

