import { BikeModel, Product, ProductReview, Order } from '../types';

export const POPULAR_BIKES: BikeModel[] = [
  // Underbones
  { id: 'xrm-125', name: 'Honda XRM 125 (Carb / Fi)', brand: 'Honda', type: 'underbone', displacement: '125cc', popular: true },
  { id: 'wave-125', name: 'Honda Wave 125 / 110', brand: 'Honda', type: 'underbone', displacement: '125cc', popular: true },
  { id: 'raider-150', name: 'Suzuki Raider 150 (Carb / Fi)', brand: 'Suzuki', type: 'underbone', displacement: '150cc', popular: true },
  { id: 'sniper-155', name: 'Yamaha Sniper 150 / 155', brand: 'Yamaha', type: 'underbone', displacement: '155cc', popular: true },
  { id: 'smash-115', name: 'Suzuki Smash 115', brand: 'Suzuki', type: 'underbone', displacement: '115cc', popular: false },
  
  // Scooters
  { id: 'click-125', name: 'Honda Click 125i (V1 / V2 / V3)', brand: 'Honda', type: 'scooter', displacement: '125cc', popular: true },
  { id: 'click-160', name: 'Honda Click 160', brand: 'Honda', type: 'scooter', displacement: '160cc', popular: true },
  { id: 'aerox-155', name: 'Yamaha Aerox 155 (V1 / V2)', brand: 'Yamaha', type: 'scooter', displacement: '155cc', popular: true },
  { id: 'nmax-155', name: 'Yamaha NMAX 155 (V1 / V2)', brand: 'Yamaha', type: 'scooter', displacement: '155cc', popular: true },
  { id: 'mio-i125', name: 'Yamaha Mio i125 / M3 / Soulty', brand: 'Yamaha', type: 'scooter', displacement: '125cc', popular: true },
  { id: 'beat-110', name: 'Honda BeAT 110 Fi', brand: 'Honda', type: 'scooter', displacement: '110cc', popular: true },
  { id: 'adv-160', name: 'Honda ADV 150 / 160', brand: 'Honda', type: 'scooter', displacement: '160cc', popular: false },
  { id: 'pcx-160', name: 'Honda PCX 160', brand: 'Honda', type: 'scooter', displacement: '160cc', popular: false },
];

// Clean marketplace: Zero preloaded products as requested.
// Only real products uploaded by registered users and sellers will appear here.
export const INITIAL_PRODUCTS: Product[] = [];
export const MOCK_PRODUCTS: Product[] = [];
export const MOCK_REVIEWS: ProductReview[] = [];
export const MOCK_REVIEWS_DICT: Record<string, ProductReview[]> = {};
export const INITIAL_ORDERS: Order[] = [];

// Sample reference template for users when testing the upload tool
export const DEMO_PRESET_ITEMS: Omit<Product, 'id' | 'seller'>[] = [
  {
    name: 'JVT Performance High-Torque Pulley Set & Drive Face',
    brand: 'JVT Racing',
    category: 'cvt_transmission',
    price: 1850,
    originalPrice: 2200,
    rating: 5.0,
    reviewCount: 1,
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80',
    stock: 15,
    condition: 'Brand New',
    compatibleBikes: ['Honda Click 125i (V1 / V2 / V3)', 'Honda Click 160', 'Honda BeAT 110 Fi'],
    description: 'Precision CNC machined CVT Pulley Set designed to eliminate drag and deliver aggressive low-to-mid acceleration and top speed.',
    specifications: {
      'Material': 'Aviation-Grade T6 Alloy',
      'Ramp Angle': '13.5 Degrees',
      'Recommended Flyballs': '9g / 11g combination',
      'Origin': 'Taiwan Racing Specs'
    },
    featured: true,
    bestseller: true
  },
  {
    name: 'Daeng Sai4 Full Stainless Open Pipe Exhaust System',
    brand: 'Daeng Sai4 Thailand',
    category: 'exhaust',
    price: 3800,
    originalPrice: 4200,
    rating: 5.0,
    reviewCount: 1,
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
    stock: 8,
    condition: 'Brand New',
    compatibleBikes: ['Honda XRM 125 (Carb / Fi)', 'Honda Wave 125 / 110', 'Suzuki Raider 150 (Carb / Fi)'],
    description: 'Authentic Daeng Sai4 Stainless Open Pipe. Delivers deep bass sound and free-flowing exhaust scavenge for increased top-end horsepower.',
    specifications: {
      'Header Diameter': '28mm - 32mm - 51mm stepped',
      'Material': 'SUS304 Full Stainless Steel',
      'Silencer Type': 'Removable Baffle Insert',
      'Country of Origin': 'Thailand'
    },
    featured: true,
    bestseller: true
  }
];
