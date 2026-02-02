export interface Product {
  id: number;
  title: string;
  coverImage: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviews: number;
  category: string;
  tags: string[];
  releaseDate: string;
  developer: string;
  featured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  count: number;
  icon?: string;
}

export const categories: Category[] = [
  { id: 'all', name: 'All Games', count: 245 },
  { id: 'action', name: 'Action', count: 87 },
  { id: 'rpg', name: 'RPG', count: 62 },
  { id: 'strategy', name: 'Strategy', count: 45 },
  { id: 'sports', name: 'Sports', count: 28 },
  { id: 'racing', name: 'Racing', count: 23 },
];

export const mockProducts: Product[] = [
  {
    id: 1,
    title: 'Cyber Legends 2077',
    coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=600&fit=crop',
    price: 29.99,
    originalPrice: 49.99,
    discount: 40,
    rating: 4.8,
    reviews: 12543,
    category: 'action',
    tags: ['Sci-Fi', 'Open World', 'FPS'],
    releaseDate: '2024-01-15',
    developer: 'Neon Studios',
    featured: true,
  },
  {
    id: 2,
    title: 'Neon Warriors',
    coverImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=600&fit=crop',
    price: 39.99,
    rating: 4.9,
    reviews: 8921,
    category: 'action',
    tags: ['Multiplayer', 'Battle Royale'],
    releaseDate: '2024-02-20',
    developer: 'Epic Games Studio',
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
    category: 'strategy',
    tags: ['Space', 'Strategy', 'Simulation'],
    releaseDate: '2023-11-10',
    developer: 'Cosmic Interactive',
  },
  {
    id: 4,
    title: 'Dragon Realm Online',
    coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=600&fit=crop',
    price: 49.99,
    rating: 4.6,
    reviews: 10234,
    category: 'rpg',
    tags: ['MMORPG', 'Fantasy', 'Co-op'],
    releaseDate: '2024-03-05',
    developer: 'Dragon Games',
    featured: true,
  },
  {
    id: 5,
    title: 'Racing Legends Pro',
    coverImage: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400&h=600&fit=crop',
    price: 19.99,
    originalPrice: 29.99,
    discount: 33,
    rating: 4.5,
    reviews: 8765,
    category: 'racing',
    tags: ['Racing', 'Sports', 'Multiplayer'],
    releaseDate: '2023-12-15',
    developer: 'Speed Studios',
  },
  {
    id: 6,
    title: 'Mystic Quest',
    coverImage: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&h=600&fit=crop',
    price: 34.99,
    rating: 4.8,
    reviews: 11234,
    category: 'rpg',
    tags: ['Adventure', 'Story-Rich', 'Fantasy'],
    releaseDate: '2024-01-28',
    developer: 'Mystic Games',
  },
  {
    id: 7,
    title: 'Battle Arena Champions',
    coverImage: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=600&fit=crop',
    price: 0,
    rating: 4.4,
    reviews: 25432,
    category: 'action',
    tags: ['Free to Play', 'MOBA', 'Competitive'],
    releaseDate: '2023-09-01',
    developer: 'Arena Games',
  },
  {
    id: 8,
    title: 'Football Manager 2024',
    coverImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=600&fit=crop',
    price: 44.99,
    originalPrice: 54.99,
    discount: 18,
    rating: 4.7,
    reviews: 6543,
    category: 'sports',
    tags: ['Sports', 'Management', 'Simulation'],
    releaseDate: '2023-11-06',
    developer: 'Sports Interactive',
  },
  {
    id: 9,
    title: 'Kingdom Builder',
    coverImage: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&h=600&fit=crop',
    price: 27.99,
    rating: 4.6,
    reviews: 7890,
    category: 'strategy',
    tags: ['Strategy', 'City Building', 'Medieval'],
    releaseDate: '2024-02-14',
    developer: 'Kingdom Games',
  },
  {
    id: 10,
    title: 'Stealth Assassin',
    coverImage: 'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=400&h=600&fit=crop',
    price: 35.99,
    originalPrice: 59.99,
    discount: 40,
    rating: 4.9,
    reviews: 14567,
    category: 'action',
    tags: ['Stealth', 'Action', 'Third-Person'],
    releaseDate: '2023-10-20',
    developer: 'Shadow Studios',
    featured: true,
  },
  {
    id: 11,
    title: 'Rally Championship',
    coverImage: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&h=600&fit=crop',
    price: 22.99,
    rating: 4.5,
    reviews: 5432,
    category: 'racing',
    tags: ['Racing', 'Simulation', 'Realistic'],
    releaseDate: '2024-01-10',
    developer: 'Rally Games',
  },
  {
    id: 12,
    title: 'Fantasy Tactics',
    coverImage: 'https://images.unsplash.com/photo-1563207153-f403bf289096?w=400&h=600&fit=crop',
    price: 29.99,
    originalPrice: 39.99,
    discount: 25,
    rating: 4.7,
    reviews: 9876,
    category: 'strategy',
    tags: ['Turn-Based', 'Tactical', 'Fantasy'],
    releaseDate: '2023-12-01',
    developer: 'Tactics Studio',
  },
];
