import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Filter, ChevronDown, ChevronUp, DollarSign, Calendar } from 'lucide-react';

interface StoreFiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  priceRange: [number, number];
  /** Reserved for future use */
  minRating: number;
  categories: CategoryId[];
  sortBy: 'releaseDate' | 'price';
  sortOrder: 'asc' | 'desc';
}

const categoryKeys = {
  action: 'store.categories.action',
  rpg: 'store.categories.rpg',
  strategy: 'store.categories.strategy',
  sports: 'store.categories.sports',
  racing: 'store.categories.racing',
} as const;

type CategoryId = keyof typeof categoryKeys;
type SortUiId = 'popular' | 'newest' | 'price-low' | 'price-high';

export function StoreFilters({ onFilterChange }: StoreFiltersProps) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState({
    price: true,
    rating: true,
    category: true,
    sort: true,
  });

  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 2000000], // 2,000,000 VND

    minRating: 0,
    categories: [],
    sortBy: 'releaseDate',
    sortOrder: 'desc',
  });
  const [selectedSort, setSelectedSort] = useState<SortUiId>('popular');



  const sortOptions: { id: SortUiId; key: string }[] = [
    { id: 'newest', key: 'store.filters.newest' },
    { id: 'price-low', key: 'store.filters.priceLowToHigh' },
    { id: 'price-high', key: 'store.filters.priceHighToLow' },
  ];

  

  const handleSortChange = (sortId: SortUiId) => {
    const sortMap: Record<SortUiId, Pick<FilterState, 'sortBy' | 'sortOrder'>> = {
      popular: { sortBy: 'releaseDate', sortOrder: 'desc' },
      newest: { sortBy: 'releaseDate', sortOrder: 'desc' },
      'price-low': { sortBy: 'price', sortOrder: 'asc' },
      'price-high': { sortBy: 'price', sortOrder: 'desc' },
    };
    setSelectedSort(sortId);
    const newFilters = { ...filters, ...sortMap[sortId] };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
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
                  checked={selectedSort === option.id}
                  onChange={() => handleSortChange(option.id)}
                  className="w-4 h-4 accent-blue-500"
                />
                <span className="text-sm">{t(option.key)}</span>
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
              <span className="text-sm text-slate-400">
                {formatCurrency(0)}
              </span>
              <input
                type="range"
                min={0}
                max={2000000}
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
              <span className="text-sm text-slate-400">
                {formatCurrency(filters.priceRange[1])}
              </span>
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
          const resetFilters: FilterState = {
            priceRange: [0, 100] as [number, number],
            minRating: 0,
            categories: [],
            sortBy: 'releaseDate',
            sortOrder: 'desc',
          };
          setSelectedSort('popular');
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
