import { useTranslation } from 'react-i18next';
import type { ICategory } from '@/types/Category.types';

const categoryKeyMap: Record<string, string> = {
  all: 'store.categories.allGames',
  action: 'store.categories.action',
  rpg: 'store.categories.rpg',
  strategy: 'store.categories.strategy',
  sports: 'store.categories.sports',
  racing: 'store.categories.racing',
};

interface CategoryNavProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories?: ICategory[];
}
  
export function CategoryNav({
  selectedCategory,
  onCategoryChange,
  categories = [],
}: CategoryNavProps) {
  const { t } = useTranslation();

  const labelFor = (categoryId: string, categoryName: string) => {
    const key = categoryKeyMap[categoryId];
    if (key) return t(key);
    return categoryName;
  };

  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-2">
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
        <button
          type="button"
          onClick={() => onCategoryChange('all')}
          className={`
              px-4 py-2 rounded-lg whitespace-nowrap transition-all font-medium
              ${
                selectedCategory === 'all'
                  ? 'bg-linear-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white'
              }
            `}
        >
          <span>{t('store.categories.allGames')}</span>
        </button>
        {categories.map((category) => (
          <button
            key={category.categoryId}
            type="button"
            onClick={() => onCategoryChange(category.categoryId)}
            className={`
              px-4 py-2 rounded-lg whitespace-nowrap transition-all font-medium
              ${
                selectedCategory === category.categoryId
                  ? 'bg-linear-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white'
              }
            `}
          >
            <span>
              {labelFor(category.categoryId, category.categoryName)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
