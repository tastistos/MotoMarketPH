import { BikeModel, Product, ProductReview } from '../types';

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

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    name: 'JVT Performance High-Torque Pulley Set & Drive Face',
    brand: 'JVT Racing',
    category: 'cvt_transmission',
    price: 1850,
    originalPrice: 2200,
    rating: 4.9,
    reviewCount: 142,
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80',
    stock: 28,
    condition: 'Brand New',
    compatibleBikes: ['Honda Click 125i (V1 / V2 / V3)', 'Honda Click 160', 'Honda BeAT 110 Fi', 'Yamaha Mio i125 / M3 / Soulty'],
    description: 'Precision CNC machined CVT Pulley Set designed to eliminate drag and deliver aggressive low-to-mid acceleration and extended top speed. Includes 13.5° ramp angle drive face and slider guides.',
    specifications: {
      'Material': 'Aviation-Grade T6 Alloy',
      'Ramp Angle': '13.5 Degrees',
      'Recommended Flyballs': '9g / 11g combination',
      'Origin': 'Taiwan Racing Specs',
      'Warranty': '6 Months Manufacturer'
    },
    seller: {
      id: 'sel-101',
      name: 'Caloocan Moto Tuners',
      gcashNumber: '0917-882-9310',
      rating: 4.9,
      location: '10th Ave, Caloocan City',
      verified: true
    },
    featured: true,
    bestseller: true
  },
  {
    id: 'prod-002',
    name: 'Daeng Sai4 Full Stainless Open Pipe Exhaust System',
    brand: 'Daeng Sai4 Thailand',
    category: 'exhaust',
    price: 3800,
    originalPrice: 4500,
    rating: 4.8,
    reviewCount: 98,
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
    stock: 14,
    condition: 'Brand New',
    compatibleBikes: ['Honda XRM 125 (Carb / Fi)', 'Honda Wave 125 / 110', 'Suzuki Raider 150 (Carb / Fi)'],
    description: 'Authentic Daeng Sai4 Stainless 304 performance exhaust. Engineered with tuned power bomb header pipe for optimal exhaust gas scavenging. Deep bass rumble with removable silencer tip included.',
    specifications: {
      'Manifold Diameter': '28mm stepped to 32mm',
      'Canister Length': '350mm',
      'dB Rating': '88-95 dB (LTO compliant with silencer)',
      'Material': 'SUS304 Stainless Steel',
      'Fitment': 'Underbone direct bolt-on'
    },
    seller: {
      id: 'sel-102',
      name: 'Manila Speed Syndicate',
      gcashNumber: '0928-554-1290',
      rating: 4.8,
      location: 'Quiapo, Manila',
      verified: true
    },
    featured: true,
    bestseller: true
  },
  {
    id: 'prod-003',
    name: 'BRT 59mm Ceramic Cylinder Block Kit with Forged Piston',
    brand: 'BRT Racing Bintang',
    category: 'engine',
    price: 4950,
    originalPrice: 5600,
    rating: 4.9,
    reviewCount: 76,
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80',
    stock: 9,
    condition: 'Brand New',
    compatibleBikes: ['Honda XRM 125 (Carb / Fi)', 'Honda Wave 125 / 110', 'Honda Click 125i (V1 / V2 / V3)'],
    description: 'High-compression 59mm Ceramic Nikasil Bore Up Kit. Provides instant boost to 153cc displacement with superior heat dissipation compared to cast iron sleeves. Perfect for daily touring and weekend track runs.',
    specifications: {
      'Bore Size': '59.00 mm',
      'Piston Type': 'Forged Dome Top Pin 13mm',
      'Compression Ratio': '11.8:1',
      'Displacement Result': '~153cc',
      'Gasket Included': 'Copper Head + Base Gasket'
    },
    seller: {
      id: 'sel-103',
      name: 'Bikes & Blocks PH',
      gcashNumber: '0908-112-4433',
      rating: 5.0,
      location: 'Cebu City, Central Visayas',
      verified: true
    },
    featured: true
  },
  {
    id: 'prod-004',
    name: 'RCB E2 Series Rear Gas Shock Absorber 330mm',
    brand: 'Racing Boy (RCB)',
    category: 'suspension_brakes',
    price: 3250,
    originalPrice: 3800,
    rating: 4.9,
    reviewCount: 215,
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80',
    stock: 35,
    condition: 'Brand New',
    compatibleBikes: ['Honda Click 125i (V1 / V2 / V3)', 'Honda Click 160', 'Honda BeAT 110 Fi', 'Yamaha Mio i125 / M3 / Soulty'],
    description: 'Official Racing Boy nitrogen-charged gas suspension with adjustable spring preload and 14mm piston rod. Delivers plush bump absorption on rough Philippine city roads and stability on high-speed cornering.',
    specifications: {
      'Eye-to-Eye Length': '330mm',
      'Adjustability': 'Spring Preload Threaded Collar',
      'Damper Oil': 'High Viscosity Synthetic',
      'Color Options': 'Titanium Grey / Racing Gold / Gloss Black'
    },
    seller: {
      id: 'sel-101',
      name: 'Caloocan Moto Tuners',
      gcashNumber: '0917-882-9310',
      rating: 4.9,
      location: 'Caloocan City',
      verified: true
    },
    bestseller: true
  },
  {
    id: 'prod-005',
    name: 'Keihin PWK 28mm Black Edition Carburetor with Power Jet',
    brand: 'Keihin Sudco Type',
    category: 'engine',
    price: 1450,
    originalPrice: 1800,
    rating: 4.7,
    reviewCount: 63,
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80',
    stock: 22,
    condition: 'Brand New',
    compatibleBikes: ['Honda XRM 125 (Carb / Fi)', 'Honda Wave 125 / 110', 'Suzuki Raider 150 (Carb / Fi)', 'Suzuki Smash 115'],
    description: 'Semi-flat chrome D-slide Keihin PWK 28 carburetor designed for crisp throttle response and increased high RPM fuel atomization. Includes extra main and slow jet kit for easy tuning.',
    specifications: {
      'Venturi Size': '28mm',
      'Slide Type': 'Chrome D-Shape',
      'Main Jet Pre-installed': '115 (Includes 118, 120, 122)',
      'Pilot Jet Pre-installed': '38 (Includes 40, 42)',
      'Intake Manifold OD': '35mm'
    },
    seller: {
      id: 'sel-104',
      name: 'Poblacion Moto Works',
      gcashNumber: '0945-332-9011',
      rating: 4.7,
      location: 'Makati City, Metro Manila',
      verified: true
    }
  },
  {
    id: 'prod-006',
    name: 'Senlo M1A Dual-Color LED Mini Driving Lights 60W',
    brand: 'Senlo PH',
    category: 'electrical_lighting',
    price: 1680,
    originalPrice: 2100,
    rating: 4.9,
    reviewCount: 310,
    image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80',
    stock: 50,
    condition: 'Brand New',
    compatibleBikes: ['Honda XRM 125 (Carb / Fi)', 'Honda Click 125i (V1 / V2 / V3)', 'Honda Click 160', 'Yamaha Aerox 155 (V1 / V2)', 'Yamaha NMAX 155 (V1 / V2)', 'Suzuki Raider 150 (Carb / Fi)'],
    description: 'Ultra-bright IP68 waterproof mini driving lights featuring yellow low beam for rain/fog penetration and high-output 6000K white high beam. Universal bracket fits all fork pipes and crash guards.',
    specifications: {
      'Wattage': '60W Pair (30W each)',
      'Lumens': '6,000 Lumens Output',
      'Waterproof Grade': 'IP68 Submersible',
      'Beam Modes': 'Low (3000K Amber), High (6000K Pure White), Dual Flash',
      'Operating Voltage': 'DC 9V-24V'
    },
    seller: {
      id: 'sel-102',
      name: 'Manila Speed Syndicate',
      gcashNumber: '0928-554-1290',
      rating: 4.8,
      location: 'Quiapo, Manila',
      verified: true
    },
    bestseller: true
  },
  {
    id: 'prod-007',
    name: 'SSS 415 Slim Sprocket Set (14T Front / 36T Rear + Gold Chain)',
    brand: 'SSS Racing Malaysia',
    category: 'cvt_transmission',
    price: 1550,
    originalPrice: 1900,
    rating: 4.8,
    reviewCount: 112,
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
    stock: 19,
    condition: 'Brand New',
    compatibleBikes: ['Honda XRM 125 (Carb / Fi)', 'Honda Wave 125 / 110', 'Suzuki Raider 150 (Carb / Fi)', 'Yamaha Sniper 150 / 155'],
    description: 'High-tensile hardened 415 ultra-slim sprocket set with heavy-duty gold O-ring drive chain. Reduces rotational unsprung mass by 35% compared to stock 428 chain for faster rev acceleration.',
    specifications: {
      'Chain Pitch': '415 Racing Slim',
      'Front Sprocket': '14 Teeth Heat-Treated Carbon Steel',
      'Rear Sprocket': '36 Teeth Lightened Anodized',
      'Chain Links': '120 Links Gold Plated',
      'Compatibility': 'Underbone Spline Shaft'
    },
    seller: {
      id: 'sel-103',
      name: 'Bikes & Blocks PH',
      gcashNumber: '0908-112-4433',
      rating: 5.0,
      location: 'Cebu City',
      verified: true
    }
  },
  {
    id: 'prod-008',
    name: 'Maxxis Victra S98 ST High-Grip Street Scooter Tire (90/80-14 & 100/80-14)',
    brand: 'Maxxis Tires',
    category: 'tires_wheels',
    price: 2450,
    originalPrice: 2850,
    rating: 4.9,
    reviewCount: 88,
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    stock: 16,
    condition: 'Brand New',
    compatibleBikes: ['Honda Click 125i (V1 / V2 / V3)', 'Honda Click 160', 'Honda BeAT 110 Fi', 'Yamaha Mio i125 / M3 / Soulty'],
    description: 'Soft dual-compound high silica street racing tire. Designed with aggressive tread siping for exceptional wet cornering grip and high braking confidence on asphalt and concrete highways.',
    specifications: {
      'Rim Diameter': '14 Inch',
      'Available Sizes': '90/80-14 (Front) / 100/80-14 (Rear)',
      'Tire Type': 'Tubeless Radial Ply',
      'Speed Rating': 'P (Up to 150 km/h)',
      'Manufacture Date': 'Fresh 2025/2026 Batch'
    },
    seller: {
      id: 'sel-101',
      name: 'Caloocan Moto Tuners',
      gcashNumber: '0917-882-9310',
      rating: 4.9,
      location: 'Caloocan City',
      verified: true
    }
  },
  {
    id: 'prod-009',
    name: 'Real Hydro-Dip Twill Carbon Fiber Front Fender & Radiator Cover',
    brand: 'MotoCarbon Works',
    category: 'accessories_carbon',
    price: 1299,
    originalPrice: 1650,
    rating: 4.7,
    reviewCount: 45,
    image: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=800&q=80',
    stock: 25,
    condition: 'Brand New',
    compatibleBikes: ['Honda Click 125i (V1 / V2 / V3)', 'Honda Click 160', 'Yamaha Aerox 155 (V1 / V2)', 'Yamaha NMAX 155 (V1 / V2)'],
    description: 'High-gloss UV-protected carbon fiber weave finish body parts. Precision OEM fitment replacement for factory plastic fairings. Resistant to gasoline stains and fading under tropical sun.',
    specifications: {
      'Pattern': '3K Twill Carbon Hydro-Graphic',
      'Coating': '2K High Gloss Automotive Clear Coat',
      'Material': 'High-Impact ABS Polymer',
      'Installation': 'Direct OEM Clip Replacement'
    },
    seller: {
      id: 'sel-104',
      name: 'Poblacion Moto Works',
      gcashNumber: '0945-332-9011',
      rating: 4.7,
      location: 'Makati City',
      verified: true
    }
  },
  {
    id: 'prod-010',
    name: 'KOSO RX-2N Digital LCD Speedometer Multi-Function Gauge',
    brand: 'KOSO Racing',
    category: 'electrical_lighting',
    price: 2150,
    originalPrice: 2600,
    rating: 4.8,
    reviewCount: 54,
    image: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=800&q=80',
    stock: 12,
    condition: 'Brand New',
    compatibleBikes: ['Honda XRM 125 (Carb / Fi)', 'Honda Wave 125 / 110', 'Suzuki Raider 150 (Carb / Fi)', 'Suzuki Smash 115'],
    description: 'Universal 7-color backlight digital dashboard gauge. Features 15,000 RPM tachometer, digital speedometer, gear indicator (1-4/N), fuel gauge, voltmeter, and engine temperature warning light.',
    specifications: {
      'Display': 'Multi-Color LCD Backlit',
      'Tachometer Range': '0 - 15,000 RPM',
      'Sensor Included': 'Magnetic wheel speed sensor + wiring harness',
      'Waterproof Level': 'IP67 Weather-Sealed'
    },
    seller: {
      id: 'sel-102',
      name: 'Manila Speed Syndicate',
      gcashNumber: '0928-554-1290',
      rating: 4.8,
      location: 'Quiapo, Manila',
      verified: true
    }
  },
  {
    id: 'prod-011',
    name: 'RCB S2 Series Floating Front Brake Disc 260mm with Caliper Bracket',
    brand: 'Racing Boy (RCB)',
    category: 'suspension_brakes',
    price: 1950,
    originalPrice: 2400,
    rating: 4.9,
    reviewCount: 167,
    image: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=800&q=80',
    stock: 20,
    condition: 'Brand New',
    compatibleBikes: ['Honda Click 125i (V1 / V2 / V3)', 'Honda Click 160', 'Honda XRM 125 (Carb / Fi)', 'Honda Wave 125 / 110'],
    description: 'CNC stainless steel oversized floating brake rotor with alloy carrier center. Dissipates high brake heat to prevent brake fade on long downhill mountain descents and sudden emergency stops.',
    specifications: {
      'Rotor Diameter': '260mm (Oversized from 190mm stock)',
      'Floating Rivets': 'Stainless Steel 6-Pin',
      'Thickness': '3.5mm Heavy Duty',
      'Bracket': 'Includes CNC Caliper Relocation Adapter'
    },
    seller: {
      id: 'sel-101',
      name: 'Caloocan Moto Tuners',
      gcashNumber: '0917-882-9310',
      rating: 4.9,
      location: 'Caloocan City',
      verified: true
    },
    bestseller: true
  },
  {
    id: 'prod-012',
    name: 'TDR Racing Ball Weight Roller Set (8g / 9g / 10g / 11g / 12g)',
    brand: 'TDR High Performance',
    category: 'cvt_transmission',
    price: 450,
    originalPrice: 600,
    rating: 4.8,
    reviewCount: 380,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    stock: 85,
    condition: 'Brand New',
    compatibleBikes: ['Honda Click 125i (V1 / V2 / V3)', 'Honda Click 160', 'Yamaha Aerox 155 (V1 / V2)', 'Yamaha NMAX 155 (V1 / V2)', 'Yamaha Mio i125 / M3 / Soulty', 'Honda BeAT 110 Fi'],
    description: 'Self-lubricating Teflon-coated CVT roller weights. High thermal wear resistance prevents flat spots under high heat friction. Available in mixed weights for custom acceleration tuning.',
    specifications: {
      'Quantity': '6 Rollers per Pack',
      'Weight Options': '8g, 9g, 10g, 11g, 12g, 13g',
      'Core Material': 'Solid Copper Ring with DuPont Teflon Shell'
    },
    seller: {
      id: 'sel-103',
      name: 'Bikes & Blocks PH',
      gcashNumber: '0908-112-4433',
      rating: 5.0,
      location: 'Cebu City',
      verified: true
    },
    bestseller: true
  }
];

export const MOCK_REVIEWS_DICT: Record<string, ProductReview[]> = {
  'prod-001': [
    {
      id: 'rev-1',
      productId: 'prod-001',
      userName: 'Kuya Jayson R.',
      rating: 5,
      comment: 'Sobrang bilis ng arangkada ng Click 125i V2 ko! Nawala yung dragging sa low speed tapos ramdam yung hatak paahon sa Marilaque. Highly recommended seller!',
      date: '2026-02-14',
      bikeModel: 'Honda Click 125i (V2)',
      verifiedPurchase: true
    },
    {
      id: 'rev-2',
      productId: 'prod-001',
      userName: 'Mark Anthony D.',
      rating: 5,
      comment: 'Authentic JVT with QR verification. Paired with 9g and 11g flyballs, 115 kph agad sa straight highway. Fast shipping via J&T!',
      date: '2026-01-28',
      bikeModel: 'Honda Click 125i (V3)',
      verifiedPurchase: true
    },
    {
      id: 'rev-3',
      productId: 'prod-001',
      userName: 'Christian Vance',
      rating: 4,
      comment: 'Ganda ng build quality and finish. Kailangan lang sakto yung tono sa belt and torque spring para swabe ang shifting.',
      date: '2026-01-10',
      bikeModel: 'Honda BeAT 110 Fi',
      verifiedPurchase: true
    }
  ],
  'prod-002': [
    {
      id: 'rev-4',
      productId: 'prod-002',
      userName: 'Rodelio Bautista',
      rating: 5,
      comment: 'Subok na sa XRM 125 Carb ko. Lakas ng tunog buo ang bass hindi sabog! Pwede ikabit yung silencer pag may checkpoint. Solid stainless talaga!',
      date: '2026-02-20',
      bikeModel: 'Honda XRM 125 Carb',
      verifiedPurchase: true
    },
    {
      id: 'rev-5',
      productId: 'prod-002',
      userName: 'Bryan MotoVlog',
      rating: 5,
      comment: 'Fit na fit sa Raider 150. Header pipe alignment is 100% spot on, no leaks at all. Worth every peso.',
      date: '2026-02-02',
      bikeModel: 'Suzuki Raider 150 Fi',
      verifiedPurchase: true
    }
  ],
  'prod-004': [
    {
      id: 'rev-6',
      productId: 'prod-004',
      userName: 'Arnel Mendoza',
      rating: 5,
      comment: 'Di na masakit sa likod kahit dumaan sa lubak ng EDSA at C5. Ganda pa tingnan ng Titanium finish sa Click 125 ko.',
      date: '2026-02-22',
      bikeModel: 'Honda Click 125i',
      verifiedPurchase: true
    }
  ]
};

export const MOCK_PRODUCTS: Product[] = INITIAL_PRODUCTS;

export const MOCK_REVIEWS: ProductReview[] = [
  {
    id: 'rev-1',
    productId: 'prod-001',
    userName: 'Kuya Jayson R.',
    rating: 5,
    comment: 'Sobrang bilis ng arangkada ng Click 125i V2 ko! Nawala yung dragging sa low speed tapos ramdam yung hatak paahon sa Marilaque. Highly recommended seller!',
    date: '2026-02-14',
    bikeModel: 'Honda Click 125i (V2)',
    verifiedPurchase: true
  },
  {
    id: 'rev-2',
    productId: 'prod-001',
    userName: 'Mark Anthony D.',
    rating: 5,
    comment: 'Authentic JVT with QR verification. Paired with 9g and 11g flyballs, 115 kph agad sa straight highway. Fast shipping via J&T!',
    date: '2026-01-28',
    bikeModel: 'Honda Click 125i (V3)',
    verifiedPurchase: true
  },
  {
    id: 'rev-3',
    productId: 'prod-001',
    userName: 'Christian Vance',
    rating: 4,
    comment: 'Ganda ng build quality and finish. Kailangan lang sakto yung tono sa belt and torque spring para swabe ang shifting.',
    date: '2026-01-10',
    bikeModel: 'Honda BeAT 110 Fi',
    verifiedPurchase: true
  },
  {
    id: 'rev-4',
    productId: 'prod-002',
    userName: 'Rodelio Bautista',
    rating: 5,
    comment: 'Subok na sa XRM 125 Carb ko. Lakas ng tunog buo ang bass hindi sabog! Pwede ikabit yung silencer pag may checkpoint. Solid stainless talaga!',
    date: '2026-02-20',
    bikeModel: 'Honda XRM 125 Carb',
    verifiedPurchase: true
  },
  {
    id: 'rev-5',
    productId: 'prod-002',
    userName: 'Bryan MotoVlog',
    rating: 5,
    comment: 'Fit na fit sa Raider 150. Header pipe alignment is 100% spot on, no leaks at all. Worth every peso.',
    date: '2026-02-02',
    bikeModel: 'Suzuki Raider 150 Fi',
    verifiedPurchase: true
  },
  {
    id: 'rev-6',
    productId: 'prod-004',
    userName: 'Arnel Mendoza',
    rating: 5,
    comment: 'Di na masakit sa likod kahit dumaan sa lubak ng EDSA at C5. Ganda pa tingnan ng Titanium finish sa Click 125 ko.',
    date: '2026-02-22',
    bikeModel: 'Honda Click 125i',
    verifiedPurchase: true
  }
];

export const INITIAL_ORDERS: import('../types').Order[] = [
  {
    id: 'ord-8921',
    trackingNumber: 'MOTO-7829-PH',
    createdAt: '2026-02-28T09:30:00Z',
    customer: {
      name: 'Danilo Marquez',
      email: 'danilo.rider@gmail.com',
      phone: '0917-882-9310',
      gcashNumber: '0917-882-9310',
      address: 'Blk 14 Lot 9, Golden City, Brgy. Dita',
      city: 'Santa Rosa',
      province: 'Laguna'
    },
    items: [
      {
        productId: 'prod-001',
        name: 'JVT Performance High-Torque Pulley Set & Drive Face',
        price: 1850,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80'
      },
      {
        productId: 'prod-012',
        name: 'TDR Racing Ball Weight Roller Set (9g / 11g)',
        price: 450,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
      }
    ],
    subtotal: 2750,
    shippingFee: 120,
    discount: 100,
    total: 2770,
    paymentMethod: 'gcash',
    paymentStatus: 'paid',
    orderStatus: 'in_transit',
    courier: 'J&T Express Moto' as any,
    estimatedDelivery: '2026-03-02',
    trackingHistory: [
      {
        title: 'Order Placed & PayMongo GCash Verified',
        description: 'Payment of ₱2,770.00 confirmed via GCash Source #GC-99210.',
        timestamp: 'Feb 28, 09:30 AM',
        completed: true
      },
      {
        title: 'Seller Packed & Inspected Fitment Tolerances',
        description: 'Caloocan Moto Tuners packed JVT Pulley & TDR 9g/11g flyballs.',
        timestamp: 'Feb 28, 11:45 AM',
        completed: true
      },
      {
        title: 'Handover to J&T Express Logistics Hub',
        description: 'Dispatched to Caloocan Regional Sorting Center (Hub #4).',
        timestamp: 'Feb 28, 04:15 PM',
        completed: true
      },
      {
        title: 'In Transit / South Luzon Sorting Hub',
        description: 'Arrived at Laguna Sorting Hub for final delivery route.',
        timestamp: 'Mar 01, 06:20 AM',
        completed: true
      },
      {
        title: 'Out for Delivery to Rider Address',
        description: 'Courier rider Kuya Marlon (0919-442-8819) out for delivery.',
        timestamp: 'Estimated Today by 4:00 PM',
        completed: false
      }
    ]
  }
];

