export interface Activity {
  id: number;
  user: {
    name: string;
    avatar: string;
    initial: string;
  };
  action: string;
  game?: string;
  achievement?: string;
  time: string;
}
export interface Deal {
    id: number;
    title: string;
    description: string;
    discount: number;
    image: string;
    endTime: string;
    featured?: boolean;
}
export interface Game {
    id: number;
    title: string;
    coverImage: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    rating: number;
    reviews: number;
  }
export const mockActivities: Activity[] = [
  {
    id: 1,
    user: { name: 'AlexGamer', avatar: '', initial: 'AG' },
    action: 'achievement',
    game: 'Cyber Legends',
    achievement: 'Master Explorer',
    time: '2 min ago',
  },
  {
    id: 2,
    user: { name: 'SarahPro', avatar: '', initial: 'SP' },
    action: 'review',
    game: 'Neon Warriors',
    time: '15 min ago',
  },
  {
    id: 3,
    user: { name: 'MikeGaming', avatar: '', initial: 'MG' },
    action: 'achievement',
    game: 'Space Odyssey',
    achievement: 'Speed Runner',
    time: '1 hour ago',
  },
  {
    id: 4,
    user: { name: 'EmmaPlayer', avatar: '', initial: 'EP' },
    action: 'playing',
    game: 'Dragon Realm',
    time: '2 hours ago',
  },
];

export const mockReviews = [
  {
    id: 1,
    user: { name: 'GamingExpert', avatar: '', initial: 'GE' },
    game: 'Cyber Legends',
    rating: 5,
    comment: 'Amazing graphics and gameplay! Highly recommended.',
  },
  {
    id: 2,
    user: { name: 'ProGamer', avatar: '', initial: 'PG' },
    game: 'Neon Warriors',
    rating: 4,
    comment: 'Great game, but could use more content updates.',
  },
];
 
  
 export const deals: Deal[] = [
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


export const mockGames: Game[] = [
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