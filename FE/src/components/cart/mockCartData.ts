export interface CartItem {
  id: number;
  productId: number;
  title: string;
  coverImage: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  quantity: number;
  category: string;
  developer: string;
}

export interface PromoCode {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  description: string;
}

export const mockCartItems: CartItem[] = [
  {
    id: 1,
    productId: 1,
    title: 'Cyber Legends 2077',
    coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=600&fit=crop',
    price: 29.99,
    originalPrice: 49.99,
    discount: 40,
    quantity: 1,
    category: 'Action',
    developer: 'Neon Studios',
  },
  {
    id: 2,
    productId: 4,
    title: 'Dragon Realm Online',
    coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=600&fit=crop',
    price: 49.99,
    quantity: 1,
    category: 'RPG',
    developer: 'Dragon Games',
  },
  {
    id: 3,
    productId: 10,
    title: 'Stealth Assassin',
    coverImage: 'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=400&h=600&fit=crop',
    price: 35.99,
    originalPrice: 59.99,
    discount: 40,
    quantity: 2,
    category: 'Action',
    developer: 'Shadow Studios',
  },
];

export const availablePromoCodes: PromoCode[] = [
  {
    code: 'SUMMER2024',
    discount: 15,
    type: 'percentage',
    description: '15% off your entire order',
  },
  {
    code: 'WELCOME10',
    discount: 10,
    type: 'fixed',
    description: '$10 off your first purchase',
  },
  {
    code: 'GAMING20',
    discount: 20,
    type: 'percentage',
    description: '20% off on all games',
  },
];
