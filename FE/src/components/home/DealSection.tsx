import { Tag, Clock, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from '../ui/image-with-fallback';
import { deals } from './mockData';


export function DealsSection() {
  return (
    <section className="relative py-12 sm:py-16 lg:py-24">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-linear-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 backdrop-blur-sm mb-3 sm:mb-4">
            <Tag className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" />
            <span className="text-xs sm:text-sm text-red-300">Limited Time Offers</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
            Deals & <span className="bg-linear-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">Promotions</span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto px-4">
            Don't miss out on these amazing deals and exclusive offers
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Featured Deal */}
          {deals
            .filter((deal) => deal.featured)
            .map((deal) => (
              <div
                key={deal.id}
                className="lg:col-span-2 relative group backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all"
              >
                <div className="relative h-48 sm:h-64 lg:h-80">
                  <ImageWithFallback
                    src={deal.image}
                    alt={deal.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/50 to-transparent" />
                  
                  <div className="absolute top-4 left-4 sm:top-6 sm:left-6 right-4 sm:right-auto">
                    <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-2 rounded-full bg-red-500 text-white font-bold text-sm sm:text-base lg:text-lg mb-2 sm:mb-3">
                      -{deal.discount}% OFF
                    </div>
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2">{deal.title}</h3>
                    <p className="text-sm sm:text-base text-slate-300 mb-2 sm:mb-4">{deal.description}</p>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 mb-3 sm:mb-4">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{deal.endTime}</span>
                    </div>
                    <button className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg bg-linear-to-r from-red-500 to-orange-600 hover:from-red-400 hover:to-orange-500 transition-all text-sm sm:text-base">
                      <span>Shop Now</span>
                      <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
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
                  className="relative group backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all"
                >
                  <div className="relative h-32 sm:h-40">
                    <ImageWithFallback
                      src={deal.image}
                      alt={deal.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/70 to-transparent" />
                    
                    <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4">
                      <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                        <div className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-red-500 text-white text-xs sm:text-sm font-semibold">
                          -{deal.discount}%
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-400">
                          <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          {deal.endTime}
                        </div>
                      </div>
                      <h4 className="text-base sm:text-lg font-semibold mb-0.5 sm:mb-1">{deal.title}</h4>
                      <p className="text-xs sm:text-sm text-slate-400">{deal.description}</p>
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

