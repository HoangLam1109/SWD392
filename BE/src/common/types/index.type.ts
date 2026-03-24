export interface GameIndexData {
  id: string;
  title: string;
  price: number;
  isActive: boolean;
  description?: string;
  thumbnail?: string;
  coverImage?: string;
  discount?: number;
  developer?: string;
  publisher?: string;
  releaseDate?: Date;
  url?: string;
  created_at?: Date;
  updated_at?: Date;
  categoryId?: string;
}

export interface CategoryIndexData {
  id: string;
  categoryName: string;
  description?: string;
  parentCategoryId?: string;
  created_at?: Date;
}

export const gameIndex = {
  fields: ['title', 'description', 'developer', 'publisher', 'category'],
  weights: {
    title: 10,
    description: 5,
    developer: 3,
    publisher: 2,
    category: 8,
  },
};

export const categoryIndex = {
  fields: ['categoryName', 'description'],
  weights: {
    categoryName: 10,
    description: 5,
  },
};
