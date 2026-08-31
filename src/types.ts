export type BikeType = 'underbone' | 'scooter' | 'all';

export interface BikeModel {
  id: string;
  name: string;
  brand: 'Honda' | 'Yamaha' | 'Suzuki' | 'Kawasaki';
  type: 'underbone' | 'scooter';
  displacement: string;
  popular: boolean;
}

export type ProductCategory = 
  | 'all'
  | 'engine'
  | 'cvt_transmission'
  | 'exhaust'
  | 'suspension_brakes'
  | 'electrical_lighting'
  | 'tires_wheels'
  | 'accessories_carbon';

export interface ProductReview {
  id: string;
  productId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1-5
  comment: string;
  date: string;
  bikeModel: string;
  verifiedPurchase: boolean;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  price: number; // in PHP (Philippine Peso)
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  additionalImages?: string[];
  stock: number;
  condition: 'Brand New' | 'Performance Tuned' | 'Mint 2nd Hand';
  compatibleBikes: string[]; // e.g. ['Honda XRM 125', 'Honda Wave 125', 'Honda Click 125i']
  description: string;
  specifications: Record<string, string>;
  seller: {
    id: string;
    name: string;
    gcashNumber: string;
    rating: number;
    location: string;
    verified: boolean;
  };
  featured?: boolean;
  bestseller?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColorOrVariant?: string;
}

export type PaymentMethod = 'gcash' | 'paymongo_card' | 'maya' | 'qrph' | 'cod';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  trackingNumber: string;
  createdAt: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    gcashNumber?: string;
    address: string;
    city: string;
    province: string;
  };
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: 'placed' | 'processing' | 'shipped' | 'in_transit' | 'delivered' | 'cancelled';
  courier: 'J&T Express' | 'Flash Express' | 'Lalamove Moto' | 'Ninja Van';
  estimatedDelivery: string;
  trackingHistory: {
    title: string;
    description: string;
    timestamp: string;
    completed: boolean;
  }[];
}

export interface SellerProfile {
  id: string;
  storeName: string;
  ownerName: string;
  email: string;
  phone: string;
  gcashNumber: string;
  location: string;
  totalSales: number;
  rating: number;
  joinedDate: string;
  listedProductsCount: number;
}

export interface UserProfile {
  id: string;
  email?: string;
  fullName: string;
  phone?: string;
  gcashNumber?: string;
  address?: string;
  city?: string;
  province?: string;
  primaryBike: string;
  avatarUrl?: string;
  isSeller: boolean;
  createdAt?: string;
}

export type AuthMode = 'login' | 'register' | 'forgot_password';

export type NavTab = 'home' | 'store' | 'seller' | 'dashboard' | 'about' | 'contact';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

