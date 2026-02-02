import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Filter, ChevronDown, ChevronUp, DollarSign, Star, Calendar } from 'lucide-react';

interface StoreFiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  priceRange: [number, number];
  minRating: number;
  categories: string[];
  sortBy: string;
}

export function StoreFilters({ onFilterChange }: StoreFiltersProps) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState({
    price: true,
    rating: true,
    category: true,
    sort: true,
  });

  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 100],
    minRating: 0,
    categories: [],
    sortBy: 'popular',
  });

  const categoryKeys: Record<string, string> = {
    action: 'store.categories.action',
    rpg: 'store.categories.rpg',
    strategy: 'store.categories.strategy',
    sports: 'store.categories.sports',
    racing: 'store.categories.racing',
  };

  const categories = [
    { id: 'action', count: 87 },
    { id: 'rpg', count: 62 },
    { id: 'strategy', count: 45 },
    { id: 'sports', count: 28 },
    { id: 'racing', count: 23 },
  ];

  const sortOptions = [
    { id: 'popular', key: 'store.filters.mostPopular' },
    { id: 'newest', key: 'store.filters.newest' },
    { id: 'price-low', key: 'store.filters.priceLowToHigh' },
    { id: 'price-high', key: 'store.filters.priceHighToLow' },
    { id: 'rating', key: 'store.filters.highestRated' },
  ];

  const toggleCategory = (categoryId: string) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter((c) => c !== categoryId)
      : [...filters.categories, categoryId];
    
    const newFilters = { ...filters, categories: newCategories };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSortChange = (sortId: string) => {
    const newFilters = { ...filters, sortBy: sortId };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleRatingChange = (rating: number) => {
    const newFilters = { ...filters, minRating: rating };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Filter className="w-5 h-5 text-blue-400" />
        <h3 className="text-xl font-semibold">{t('store.filters.title')}</h3>
      </div>

      {/* Sort By */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4">
        <button
          onClick={() => setExpanded({ ...expanded, sort: !expanded.sort })}
          className="flex items-center justify-between w-full mb-3"
        >
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span className="font-medium">{t('store.filters.sortBy')}</span>
          </div>
          {expanded.sort ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        
        {expanded.sort && (
          <div className="space-y-2">
            {sortOptions.map((option) => (
              <label
                key={option.id}
                className="flex items-center gap-2 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors"
              >
                <input
                  type="radio"
                  name="sort"
                  checked={filters.sortBy === option.id}
                  onChange={() => handleSortChange(option.id)}
                  className="w-4 h-4 accent-blue-500"
                />
                <span className="text-sm">{t(option.key)}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Category */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4">
        <button
          onClick={() => setExpanded({ ...expanded, category: !expanded.category })}
          className="flex items-center justify-between w-full mb-3"
        >
          <span className="font-medium">{t('store.filters.category')}</span>
          {expanded.category ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        
        {expanded.category && (
          <div className="space-y-2">
            {categories.map((category) => (
              <label
                key={category.id}
                className="flex items-center justify-between cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(category.id)}
                    onChange={() => toggleCategory(category.id)}
                    className="w-4 h-4 accent-blue-500"
                  />
                  <span className="text-sm">{t(categoryKeys[category.id])}</span>
                </div>
                <span className="text-xs text-slate-500">{category.count}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Rating */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4">
        <button
          onClick={() => setExpanded({ ...expanded, rating: !expanded.rating })}
          className="flex items-center justify-between w-full mb-3"
        >
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="font-medium">{t('store.filters.rating')}</span>
          </div>
          {expanded.rating ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        
        {expanded.rating && (
          <div className="space-y-2">
            {[4, 3, 2, 1].map((rating) => (
              <label
                key={rating}
                className="flex items-center gap-2 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors"
              >
                <input
                  type="radio"
                  name="rating"
                  checked={filters.minRating === rating}
                  onChange={() => handleRatingChange(rating)}
                  className="w-4 h-4 accent-blue-500"
                />
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-600'
                      }`}
                    />
                  ))}
                  <span className="text-sm ml-1">{t('store.filters.andUp')}</span>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4">
        <button
          onClick={() => setExpanded({ ...expanded, price: !expanded.price })}
          className="flex items-center justify-between w-full mb-3"
        >
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-400" />
            <span className="font-medium">{t('store.filters.priceRange')}</span>
          </div>
          {expanded.price ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        
        {expanded.price && (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-400">$0</span>
              <input
                type="range"
                min="0"
                max="100"
                value={filters.priceRange[1]}
                onChange={(e) => {
                  const newFilters = {
                    ...filters,
                    priceRange: [0, parseInt(e.target.value)] as [number, number],
                  };
                  setFilters(newFilters);
                  onFilterChange(newFilters);
                }}
                className="flex-1 accent-blue-500"
              />
              <span className="text-sm text-slate-400">${filters.priceRange[1]}</span>
            </div>
            <div className="text-center text-sm text-slate-400">
              {t('store.filters.upTo', { value: filters.priceRange[1] })}
            </div>
          </div>
        )}
      </div>

      {/* Reset Button */}
      <button
        onClick={() => {
          const resetFilters = {
            priceRange: [0, 100] as [number, number],
            minRating: 0,
            categories: [],
            sortBy: 'popular',
          };
          setFilters(resetFilters);
          onFilterChange(resetFilters);
        }}
        className="w-full py-2 px-4 rounded-lg border border-white/20 hover:bg-white/5 transition-colors text-sm"
      >
        {t('store.filters.resetFilters')}
      </button>
    </div>
  );
}
