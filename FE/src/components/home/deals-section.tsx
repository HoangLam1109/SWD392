import { Tag, Clock, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from '../ui/image-with-fallback';

interface Deal {
  id: number;
  title: string;
  description: string;
  discount: number;
  image: string;
  endTime: string;
  featured?: boolean;
}

const deals: Deal[] = [
  {
    id: 1,
    title: 'Summer Sale',
    description: 'Up to 70% off on selected games',
    discount: 70,
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=400&fit=crop',
    endTime: '3 days left',
    featured: true,
  },
  {
    id: 2,
    title: 'Indie Games Week',
    description: 'Support indie developers with special discounts',
    discount: 50,
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=300&fit=crop',
    endTime: '5 days left',
  },
  {
    id: 3,
    title: 'Flash Sale',
    description: 'Limited time offers - Act fast!',
    discount: 60,
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=300&fit=crop',
    endTime: '12 hours left',
  },
];

export function DealsSection() {
  return (
    <section className="relative py-24">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 backdrop-blur-sm mb-4">
            <Tag className="w-4 h-4 text-red-400" />
            <span className="text-sm text-red-300">Limited Time Offers</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Deals & <span className="bg-linear-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">Promotions</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Don't miss out on these amazing deals and exclusive offers
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Featured Deal */}
          {deals
            .filter((deal) => deal.featured)
            .map((deal) => (
              <div
                key={deal.id}
                className="lg:col-span-2 relative group backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all"
              >
                <div className="relative h-64 lg:h-80">
                  <ImageWithFallback
                    src={deal.image}
                    alt={deal.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/50 to-transparent" />
                  
                  <div className="absolute top-6 left-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500 text-white font-bold text-lg mb-3">
                      -{deal.discount}% OFF
                    </div>
                    <h3 className="text-3xl font-bold mb-2">{deal.title}</h3>
                    <p className="text-slate-300 mb-4">{deal.description}</p>
                    <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
                      <Clock className="w-4 h-4" />
                      <span>{deal.endTime}</span>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 rounded-lg bg-linear-to-r from-red-500 to-orange-600 hover:from-red-400 hover:to-orange-500 transition-all">
                      <span>Shop Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

          {/* Other Deals */}
          <div className="space-y-6">
            {deals
              .filter((deal) => !deal.featured)
              .map((deal) => (
                <div
                  key={deal.id}
                  className="relative group backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all"
                >
                  <div className="relative h-40">
                    <ImageWithFallback
                      src={deal.image}
                      alt={deal.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/70 to-transparent" />
                    
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500 text-white text-sm font-semibold">
                          -{deal.discount}%
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-400">
                          <Clock className="w-3 h-3" />
                          {deal.endTime}
                        </div>
                      </div>
                      <h4 className="text-lg font-semibold mb-1">{deal.title}</h4>
                      <p className="text-sm text-slate-400">{deal.description}</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}

