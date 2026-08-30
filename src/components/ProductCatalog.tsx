import React, { useState, useMemo } from 'react';
import { 
  Filter, 
  Sparkles, 
  Star, 
  ShoppingCart, 
  Bike, 
  Check, 
  ShieldCheck, 
  Tag, 
  SlidersHorizontal,
  Eye,
  X,
  Layers,
  Fuel,
  Volume2,
  Cpu,
  Gauge
} from 'lucide-react';
import { Product, ProductCategory, BikeModel } from '../types';
import { POPULAR_BIKES } from '../data/mockProducts';

interface ProductCatalogProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  selectedBike: BikeModel | null;
  setSelectedBike: (bike: BikeModel | null) => void;
  searchQuery: string;
  selectedCategory: ProductCategory;
  setSelectedCategory: (cat: ProductCategory) => void;
}

const CATEGORIES: { id: ProductCategory; label: string; icon: string }[] = [
  { id: 'all', label: 'All Street Parts', icon: '🏍️' },
  { id: 'cvt_transmission', label: 'CVT & Transmission', icon: '⚙️' },
  { id: 'engine', label: 'Bore Kits & Engine', icon: '🔥' },
  { id: 'exhaust', label: 'Exhaust & Pipes', icon: '💨' },
  { id: 'suspension_brakes', label: 'Shocks & Brakes', icon: '⚡' },
  { id: 'electrical_lighting', label: 'Lights & Gauges', icon: '💡' },
  { id: 'tires_wheels', label: 'Tires & Rims', icon: '🛞' },
  { id: 'accessories_carbon', label: 'Carbon Fairings', icon: '✨' },
];

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
  selectedBike,
  setSelectedBike,
  searchQuery,
  selectedCategory,
  setSelectedCategory,
}) => {
  const [maxPrice, setMaxPrice] = useState<number>(6000);
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'rating' | 'price_low' | 'price_high'>('featured');
  const [showOnlyInStock, setShowOnlyInStock] = useState<boolean>(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Category filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesBrand = product.brand.toLowerCase().includes(q);
        const matchesBike = product.compatibleBikes.some(b => b.toLowerCase().includes(q));
        const matchesDesc = product.description.toLowerCase().includes(q);
        if (!matchesName && !matchesBrand && !matchesBike && !matchesDesc) {
          return false;
        }
      }

      // Bike fitment filter
      if (selectedBike) {
        const isCompatible = product.compatibleBikes.some(b => 
          b.toLowerCase().includes(selectedBike.name.toLowerCase().split('(')[0].trim()) ||
          (selectedBike.type === 'underbone' && b.toLowerCase().includes('underbone')) ||
          (selectedBike.type === 'scooter' && b.toLowerCase().includes('scooter'))
        );
        if (!isCompatible) {
          return false;
        }
      }

      // Max price filter
      if (product.price > maxPrice) {
        return false;
      }

      // Condition filter
      if (selectedCondition !== 'all' && product.condition !== selectedCondition) {
        return false;
      }

      // Stock filter
      if (showOnlyInStock && product.stock <= 0) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price_low') return a.price - b.price;
      if (sortBy === 'price_high') return b.price - a.price;
      // Default: featured / bestseller first
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  }, [products, selectedCategory, searchQuery, selectedBike, maxPrice, selectedCondition, showOnlyInStock, sortBy]);

  return (
    <section className="bg-neutral-950 py-8 px-4 sm:px-6 lg:px-8 border-b border-neutral-850">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Catalog Header & Category Pills */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl sm:text-3xl font-black text-white font-['Outfit'] uppercase tracking-tight">
                  Parts & Upgrades Catalog
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-red-950 text-red-400 font-bold border border-red-800">
                  {filteredProducts.length} Available
                </span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-400 font-['Plus_Jakarta_Sans']">
                {selectedBike 
                  ? `Showing 100% compatible parts for ${selectedBike.name}`
                  : 'Displaying high performance underbone & scooter parts across the Philippines'}
              </p>
            </div>

            {/* Quick Sort & Filter Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-semibold text-neutral-200 flex items-center gap-1.5"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters ({selectedBike ? 'Bike active' : 'All'})</span>
              </button>

              <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-neutral-300">
                <span className="text-neutral-500 font-medium">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-neutral-200 font-semibold focus:outline-none text-xs cursor-pointer"
                >
                  <option value="featured" className="bg-neutral-900">Featured First</option>
                  <option value="rating" className="bg-neutral-900">Highest Rated ⭐</option>
                  <option value="price_low" className="bg-neutral-900">Price: Low to High</option>
                  <option value="price_high" className="bg-neutral-900">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Horizontal Category Scroll */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-neutral-800">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                    : 'bg-neutral-900/90 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-850 border border-neutral-800'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Active Fitment Alert Banner if bike is chosen */}
          {selectedBike && (
            <div className="flex items-center justify-between px-3.5 py-2 rounded-lg bg-red-950/40 border border-red-800/40 text-xs">
              <div className="flex items-center gap-2 text-red-300">
                <Bike className="w-4 h-4 text-red-400" />
                <span>
                  Filtering parts tested & verified for: <strong>{selectedBike.name}</strong> ({selectedBike.displacement})
                </span>
              </div>
              <button
                onClick={() => setSelectedBike(null)}
                className="text-neutral-400 hover:text-white underline font-medium text-[11px]"
              >
                Clear Bike Filter
              </button>
            </div>
          )}
        </div>

        {/* Main Grid with Sidebar Filter (1/4 sidebar, 3/4 products) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Desktop Filter Sidebar (3 of 12 cols) */}
          <div className="hidden lg:block lg:col-span-3 space-y-5">
            <div className="rounded-xl bg-neutral-900/80 border border-neutral-800 p-4 space-y-4">
              
              <div className="flex items-center justify-between pb-2 border-b border-neutral-800 text-xs font-bold text-white uppercase font-['Outfit']">
                <div className="flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-red-500" />
                  <span>Precision Filters</span>
                </div>
                <button
                  onClick={() => {
                    setSelectedBike(null);
                    setSelectedCategory('all');
                    setMaxPrice(6000);
                    setSelectedCondition('all');
                    setShowOnlyInStock(false);
                  }}
                  className="text-[10px] text-neutral-400 hover:text-red-400 capitalize underline"
                >
                  Reset All
                </button>
              </div>

              {/* Specific Bike Model Selector */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Target Motorcycle Model
                </label>
                <select
                  value={selectedBike?.id || 'all'}
                  onChange={(e) => {
                    if (e.target.value === 'all') {
                      setSelectedBike(null);
                    } else {
                      const found = POPULAR_BIKES.find(b => b.id === e.target.value);
                      setSelectedBike(found || null);
                    }
                  }}
                  className="w-full bg-neutral-950 border border-neutral-800 text-xs rounded-lg px-2.5 py-2 text-neutral-200 focus:outline-none focus:border-red-500"
                >
                  <option value="all">🌟 All Underbones & Scooters</option>
                  <optgroup label="Underbone Models">
                    {POPULAR_BIKES.filter(b => b.type === 'underbone').map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Scooter Models">
                    {POPULAR_BIKES.filter(b => b.type === 'scooter').map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* Price Range Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-neutral-400 uppercase text-[11px]">Max Budget</span>
                  <span className="font-bold text-red-400">₱{maxPrice.toLocaleString()} PHP</span>
                </div>
                <input
                  type="range"
                  min="400"
                  max="6000"
                  step="100"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-red-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-neutral-500">
                  <span>₱400 (Rollers/Jets)</span>
                  <span>₱6,000+ (Bore/Pipes)</span>
                </div>
              </div>

              {/* Condition Filter */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Part Condition
                </label>
                <div className="space-y-1">
                  {['all', 'Brand New', 'Performance Tuned', 'Mint 2nd Hand'].map((cond) => (
                    <button
                      key={cond}
                      onClick={() => setSelectedCondition(cond)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                        selectedCondition === cond 
                          ? 'bg-red-600/20 text-red-400 border border-red-800/40' 
                          : 'text-neutral-300 hover:bg-neutral-800'
                      }`}
                    >
                      <span className="capitalize">{cond === 'all' ? 'Any Condition' : cond}</span>
                      {selectedCondition === cond && <Check className="w-3.5 h-3.5 text-red-400" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* In-Stock Toggle */}
              <div className="pt-2 border-t border-neutral-800">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300">
                  <input
                    type="checkbox"
                    checked={showOnlyInStock}
                    onChange={(e) => setShowOnlyInStock(e.target.checked)}
                    className="rounded bg-neutral-950 border-neutral-800 text-red-600 focus:ring-0 w-4 h-4 cursor-pointer"
                  />
                  <span>Ready Stock Only (Fast Dispatch)</span>
                </label>
              </div>

            </div>

            {/* Quick Promo / Tuning Tip Card */}
            <div className="rounded-xl bg-gradient-to-br from-neutral-900 to-red-950/40 border border-red-900/30 p-4 space-y-2">
              <div className="flex items-center gap-1.5 text-red-400 text-xs font-bold font-['Outfit'] uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Rider Mechanic Tip</span>
              </div>
              <p className="text-[11px] text-neutral-300 leading-relaxed font-['Plus_Jakarta_Sans']">
                For <strong>Honda Click 125i</strong>: combining 9g and 11g flyballs with a 1000 RPM center spring eliminates takeoff dragging without losing top-end speed!
              </p>
            </div>
          </div>

          {/* Product Grid (9 of 12 cols) */}
          <div className="lg:col-span-9">
            {filteredProducts.length === 0 ? (
              <div className="rounded-2xl bg-neutral-900/50 border border-neutral-800 p-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-neutral-800 text-neutral-400 flex items-center justify-center mx-auto">
                  <Bike className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white font-['Outfit']">No Matching Motorcycle Parts Found</h3>
                  <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                    Try loosening your price filter, clearing the bike model fitment, or searching for general categories like "pulley", "pipe", or "carb".
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedBike(null);
                    setSelectedCategory('all');
                    setMaxPrice(6000);
                  }}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors"
                >
                  Clear Filters & Show All Parts
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
                {filteredProducts.map((product) => {
                  const discountPercent = product.originalPrice 
                    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
                    : 0;

                  return (
                    <div
                      key={product.id}
                      className="group rounded-2xl bg-neutral-900/90 border border-neutral-800 hover:border-red-600/50 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-red-950/30"
                    >
                      {/* Top Media & Badges */}
                      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-950">
                        <img
                          src={product.image}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        
                        {/* Overlay Badges */}
                        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
                          {product.bestseller && (
                            <span className="px-2 py-0.5 rounded bg-red-600 text-white font-extrabold text-[10px] uppercase tracking-wider shadow-md">
                              🔥 BESTSELLER
                            </span>
                          )}
                          {discountPercent > 0 && (
                            <span className="px-2 py-0.5 rounded bg-amber-500 text-black font-extrabold text-[10px] uppercase tracking-wider shadow-md">
                              -{discountPercent}% OFF
                            </span>
                          )}
                        </div>

                        {/* Condition Badge */}
                        <div className="absolute top-2.5 right-2.5 z-10">
                          <span className="px-2 py-0.5 rounded-full bg-neutral-950/80 backdrop-blur-sm text-neutral-300 border border-neutral-700 text-[10px] font-semibold">
                            {product.condition}
                          </span>
                        </div>

                        {/* Quick View Button on Hover */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            onClick={() => onSelectProduct(product)}
                            className="px-3 py-1.5 rounded-lg bg-neutral-900/90 hover:bg-neutral-800 text-white text-xs font-semibold backdrop-blur-md flex items-center gap-1 border border-neutral-700 transition-transform active:scale-95"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Quick Specs & Fit</span>
                          </button>
                        </div>
                      </div>

                      {/* Content Info */}
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div className="space-y-1.5">
                          {/* Brand & Star Rating */}
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                              {product.brand}
                            </span>
                            <div className="flex items-center gap-1 text-amber-400 font-bold text-[11px]">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              <span>{product.rating.toFixed(1)}</span>
                              <span className="text-neutral-500 font-normal">({product.reviewCount})</span>
                            </div>
                          </div>

                          {/* Product Title */}
                          <h3 
                            onClick={() => onSelectProduct(product)}
                            className="text-sm font-bold text-white group-hover:text-red-400 transition-colors line-clamp-2 cursor-pointer font-['Outfit']"
                          >
                            {product.name}
                          </h3>

                          {/* Bike Fitment Badges (First 2) */}
                          <div className="flex flex-wrap gap-1 pt-1">
                            {product.compatibleBikes.slice(0, 2).map((bike, idx) => (
                              <span 
                                key={idx}
                                className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-950 text-neutral-300 border border-neutral-800 truncate max-w-[140px]"
                              >
                                🛵 {bike.split('(')[0]}
                              </span>
                            ))}
                            {product.compatibleBikes.length > 2 && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-950 text-neutral-400 border border-neutral-800">
                                +{product.compatibleBikes.length - 2} more
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Price, Stock & Action Button */}
                        <div className="pt-2 border-t border-neutral-800/80 space-y-2">
                          <div className="flex items-baseline justify-between">
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-lg font-black text-red-500 font-['Outfit']">
                                ₱{product.price.toLocaleString()}
                              </span>
                              {product.originalPrice && (
                                <span className="text-xs text-neutral-500 line-through">
                                  ₱{product.originalPrice.toLocaleString()}
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
                              <ShieldCheck className="w-3 h-3" />
                              GCash Ready
                            </span>
                          </div>

                          {/* Action Buttons */}
                          <div className="grid grid-cols-2 gap-2 pt-1">
                            <button
                              onClick={() => onSelectProduct(product)}
                              className="w-full py-2 rounded-lg bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs font-semibold transition-colors"
                            >
                              Reviews & Fit
                            </button>
                            <button
                              onClick={() => onAddToCart(product, 1)}
                              className="w-full py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center justify-center gap-1 shadow-md shadow-red-600/20 active:scale-95 transition-all"
                            >
                              <ShoppingCart className="w-3.5 h-3.5" />
                              <span>Add to Cart</span>
                            </button>
                          </div>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Mobile Filter Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end lg:hidden animate-in fade-in">
          <div className="w-full max-w-xs bg-neutral-950 h-full p-5 overflow-y-auto border-l border-neutral-800 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-sm font-bold text-white uppercase font-['Outfit']">Filter Parts</h3>
              <button 
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 rounded bg-neutral-900 text-neutral-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Bike Model Select */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-neutral-400 uppercase">Motorcycle Model</label>
              <select
                value={selectedBike?.id || 'all'}
                onChange={(e) => {
                  if (e.target.value === 'all') {
                    setSelectedBike(null);
                  } else {
                    const found = POPULAR_BIKES.find(b => b.id === e.target.value);
                    setSelectedBike(found || null);
                  }
                }}
                className="w-full bg-neutral-900 border border-neutral-800 text-xs rounded-lg px-2.5 py-2 text-white"
              >
                <option value="all">🌟 All Models</option>
                {POPULAR_BIKES.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            {/* Mobile Price Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-neutral-400">Max Budget</span>
                <span className="font-bold text-red-400">₱{maxPrice.toLocaleString()} PHP</span>
              </div>
              <input
                type="range"
                min="400"
                max="6000"
                step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-red-600"
              />
            </div>

            {/* Apply Button */}
            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs uppercase tracking-wider"
            >
              Apply ({filteredProducts.length} Parts)
            </button>
          </div>
        </div>
      )}

    </section>
  );
};
