import { categories } from './mockStoreData';

interface CategoryNavProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryNav({ selectedCategory, onCategoryChange }: CategoryNavProps) {
  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-2">
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`
              px-4 py-2 rounded-lg whitespace-nowrap transition-all font-medium
              ${
                selectedCategory === category.id
                  ? 'bg-linear-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white'
              }
            `}
          >
            <span>{category.name}</span>
            <span className="ml-2 text-xs opacity-70">({category.count})</span>
          </button>
        ))}
      </div>
    </div>
  );
}
