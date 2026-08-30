import React, { useState } from 'react';
import { 
  Store, 
  PlusCircle, 
  ShieldCheck, 
  Trash2, 
  Edit3, 
  Package, 
  DollarSign, 
  Bike, 
  CheckCircle2, 
  UploadCloud, 
  Smartphone, 
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { Product, ProductCategory } from '../types';
import { POPULAR_BIKES } from '../data/mockProducts';

interface SellerPortalProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  userGcash: string;
  setUserGcash: (gcash: string) => void;
}

export const SellerPortal: React.FC<SellerPortalProps> = ({
  products,
  onAddProduct,
  onDeleteProduct,
  userGcash,
  setUserGcash,
}) => {
  const [storeName, setStoreName] = useState('Metro Moto Tuners');
  const [sellerName, setSellerName] = useState('Kuya Bryan');
  const [sellerLocation, setSellerLocation] = useState('Caloocan / Quezon City');
  const [gcashInput, setGcashInput] = useState(userGcash || '0917-882-9310');
  const [sellerRegistered, setSellerRegistered] = useState(true);

  // New product form state
  const [productName, setProductName] = useState('');
  const [brand, setBrand] = useState('JVT Racing');
  const [category, setCategory] = useState<ProductCategory>('cvt_transmission');
  const [price, setPrice] = useState<number>(1850);
  const [originalPrice, setOriginalPrice] = useState<number>(2200);
  const [stock, setStock] = useState<number>(15);
  const [condition, setCondition] = useState<'Brand New' | 'Performance Tuned' | 'Mint 2nd Hand'>('Brand New');
  const [selectedBikes, setSelectedBikes] = useState<string[]>([
    'Honda Click 125i (V1 / V2 / V3)',
    'Honda XRM 125 (Carb / Fi)'
  ]);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80');
  const [postSuccess, setPostSuccess] = useState(false);

  // Payout state
  const [payoutSuccess, setPayoutSuccess] = useState(false);
  const [sellerBalance, setSellerBalance] = useState(14850);

  const handleBikeToggle = (bikeName: string) => {
    if (selectedBikes.includes(bikeName)) {
      setSelectedBikes(selectedBikes.filter(b => b !== bikeName));
    } else {
      setSelectedBikes([...selectedBikes, bikeName]);
    }
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim() || selectedBikes.length === 0) return;

    const newProd: Product = {
      id: `prod-custom-${Date.now()}`,
      name: productName.trim(),
      brand: brand.trim(),
      category,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      rating: 5.0,
      reviewCount: 1,
      image: imageUrl || 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80',
      stock: Number(stock),
      condition,
      compatibleBikes: selectedBikes,
      description: description || 'High-performance bolt-on motorcycle parts engineered for street and circuit racing.',
      specifications: {
        'Material': 'Aviation Alloy / Steel',
        'Fitment': selectedBikes.join(', '),
        'Condition': condition,
        'Seller GCash': gcashInput
      },
      seller: {
        id: `seller-${Date.now()}`,
        name: storeName,
        gcashNumber: gcashInput,
        rating: 5.0,
        location: sellerLocation,
        verified: true
      },
      featured: true
    };

    onAddProduct(newProd);
    setUserGcash(gcashInput);
    setPostSuccess(true);
    setProductName('');
    setDescription('');

    setTimeout(() => {
      setPostSuccess(false);
    }, 2500);
  };

  const handlePayoutGCash = () => {
    if (sellerBalance <= 0) return;
    setPayoutSuccess(true);
    setTimeout(() => {
      setSellerBalance(0);
      setPayoutSuccess(false);
    }, 2000);
  };

  // Filter seller's own products or general listings
  const sellerProducts = products.slice(0, 5);

  return (
    <div className="bg-neutral-950 min-h-screen py-8 px-4 sm:px-6 lg:px-8 border-b border-neutral-850">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-red-950 via-neutral-900 to-neutral-900 border border-red-900/40 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 max-w-xl z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950 text-red-400 text-xs font-bold border border-red-800">
              <Store className="w-3.5 h-3.5" />
              <span>MOTOSTREET SELLER & TUNER DASHBOARD</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white font-['Outfit'] uppercase tracking-tight">
              Post Your Motorcycle Parts & Receive GCash Payouts
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 font-['Plus_Jakarta_Sans'] leading-relaxed">
              Sell underbone & scooter performance components directly to thousands of daily Filipino riders across Luzon, Visayas, and Mindanao.
            </p>
          </div>

          {/* Quick GCash Balance Card */}
          <div className="rounded-xl bg-neutral-950/80 border border-neutral-800 p-4 shrink-0 min-w-[260px] space-y-3 z-10">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-neutral-400 font-semibold uppercase">Seller GCash Balance</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800 font-bold">
                PayMongo Auto-Payout
              </span>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">
                ₱{sellerBalance.toLocaleString()} PHP
              </span>
              <p className="text-[10px] text-neutral-400">
                Registered GCash: <strong className="text-emerald-400 font-mono">{gcashInput}</strong>
              </p>
            </div>
            <button
              onClick={handlePayoutGCash}
              disabled={sellerBalance <= 0}
              className={`w-full py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                sellerBalance > 0 
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md' 
                  : 'bg-neutral-850 text-neutral-500 cursor-not-allowed'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{payoutSuccess ? 'Payout Sent to GCash!' : 'Transfer to GCash Wallet'}</span>
            </button>
          </div>
        </div>

        {/* Two Column Layout: Post Product Form (7 cols) + Seller Profile & Active Listings (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Post Product Form */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-6 space-y-5">
              
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-red-500" />
                  <h2 className="text-base sm:text-lg font-bold text-white uppercase font-['Outfit']">
                    Post New Motorcycle Part Listing
                  </h2>
                </div>
                <span className="text-[11px] text-neutral-400">
                  Instant Publication
                </span>
              </div>

              {postSuccess && (
                <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2 animate-in zoom-in-95">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>
                    Item posted successfully! Your part is now live in the Store Page catalog.
                  </span>
                </div>
              )}

              <form onSubmit={handleCreateProduct} className="space-y-4">
                
                {/* Product Title */}
                <div>
                  <label className="text-[11px] font-semibold text-neutral-400 block mb-1">
                    Part Title / Listing Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="e.g. JVT 13.5 Deg High Speed Pulley Set for Click 125i"
                    className="w-full bg-neutral-950 border border-neutral-800 text-xs sm:text-sm rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                {/* Brand & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-neutral-400 block mb-1">
                      Brand / Manufacturer *
                    </label>
                    <input
                      type="text"
                      required
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      placeholder="e.g. JVT / Daeng / BRT / RCB / Keihin"
                      className="w-full bg-neutral-950 border border-neutral-800 text-xs rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-neutral-400 block mb-1">
                      Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full bg-neutral-950 border border-neutral-800 text-xs rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                    >
                      <option value="cvt_transmission">⚙️ CVT & Transmission</option>
                      <option value="engine">🔥 Bore Kits & Engine</option>
                      <option value="exhaust">💨 Exhaust & Stainless Pipes</option>
                      <option value="suspension_brakes">⚡ Shocks & Brakes</option>
                      <option value="electrical_lighting">💡 Lights & Gauges</option>
                      <option value="tires_wheels">🛞 Tires & Wheels</option>
                      <option value="accessories_carbon">✨ Carbon Fairings & Body</option>
                    </select>
                  </div>
                </div>

                {/* Price, Original Price, Stock, Condition */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-neutral-400 block mb-1">
                      Price (PHP ₱) *
                    </label>
                    <input
                      type="number"
                      required
                      min="50"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full bg-neutral-950 border border-neutral-800 text-xs rounded-lg px-3 py-2 text-white font-bold text-red-400 focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-neutral-400 block mb-1">
                      Orig. Price (PHP)
                    </label>
                    <input
                      type="number"
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(Number(e.target.value))}
                      className="w-full bg-neutral-950 border border-neutral-800 text-xs rounded-lg px-3 py-2 text-neutral-400 focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-neutral-400 block mb-1">
                      Stock Qty *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={stock}
                      onChange={(e) => setStock(Number(e.target.value))}
                      className="w-full bg-neutral-950 border border-neutral-800 text-xs rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-neutral-400 block mb-1">
                      Condition *
                    </label>
                    <select
                      value={condition}
                      onChange={(e) => setCondition(e.target.value as any)}
                      className="w-full bg-neutral-950 border border-neutral-800 text-xs rounded-lg px-2 py-2 text-white focus:outline-none focus:border-red-500"
                    >
                      <option value="Brand New">Brand New</option>
                      <option value="Performance Tuned">Performance Tuned</option>
                      <option value="Mint 2nd Hand">Mint 2nd Hand</option>
                    </select>
                  </div>
                </div>

                {/* Bike Compatibility Selection (Multi-check) */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-[11px] font-semibold text-neutral-400 block">
                    Compatible Bike Models (Select all that fit) *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-36 overflow-y-auto p-2 bg-neutral-950 rounded-lg border border-neutral-800">
                    {POPULAR_BIKES.map((bike) => (
                      <label 
                        key={bike.id} 
                        className={`flex items-center gap-1.5 p-1.5 rounded text-[11px] cursor-pointer transition-colors ${
                          selectedBikes.includes(bike.name) 
                            ? 'bg-red-950/60 text-red-300 font-semibold border border-red-800/60' 
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedBikes.includes(bike.name)}
                          onChange={() => handleBikeToggle(bike.name)}
                          className="rounded bg-neutral-900 border-neutral-800 text-red-600 focus:ring-0 w-3.5 h-3.5"
                        />
                        <span className="truncate">{bike.name.split('(')[0]}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Image URL & Description */}
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-semibold text-neutral-400 block mb-1">
                      Product Photo URL
                    </label>
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-neutral-950 border border-neutral-800 text-xs rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-neutral-400 block mb-1">
                      Technical Description & Fitment Details
                    </label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe the material, ramp angle, bore size, or tuning advice..."
                      className="w-full bg-neutral-950 border border-neutral-800 text-xs rounded-lg p-3 text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Publish Part to Marketplace</span>
                </button>

              </form>

            </div>
          </div>

          {/* Right Column: Seller Profile & GCash Configuration + Active Inventory */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* GCash Seller Account Setup */}
            <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-blue-400" />
                  <h3 className="text-sm font-bold text-white uppercase font-['Outfit']">
                    Seller GCash Payout Profile
                  </h3>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                  Verified
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-400 block mb-1">Store / Shop Name</label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 text-xs rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-400 block mb-1">Owner / Technician Name</label>
                  <input
                    type="text"
                    value={sellerName}
                    onChange={(e) => setSellerName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 text-xs rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-400 block mb-1">
                    Registered GCash Mobile Number (For Automated Payouts) *
                  </label>
                  <input
                    type="text"
                    value={gcashInput}
                    onChange={(e) => setGcashInput(e.target.value)}
                    placeholder="09XX-XXX-XXXX"
                    className="w-full bg-neutral-950 border border-blue-900 text-xs rounded-lg px-3 py-2 text-blue-300 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-400 block mb-1">Physical Garage / Shop Location</label>
                  <input
                    type="text"
                    value={sellerLocation}
                    onChange={(e) => setSellerLocation(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 text-xs rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setUserGcash(gcashInput);
                    alert('GCash Seller Profile updated successfully!');
                  }}
                  className="w-full py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold"
                >
                  Save GCash Payout Settings
                </button>
              </div>
            </div>

            {/* Active Listings Manager */}
            <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-red-500" />
                  <h3 className="text-sm font-bold text-white uppercase font-['Outfit']">
                    Your Active Listings ({sellerProducts.length})
                  </h3>
                </div>
              </div>

              <div className="divide-y divide-neutral-850 max-h-72 overflow-y-auto space-y-2">
                {sellerProducts.map((p) => (
                  <div key={p.id} className="pt-2 first:pt-0 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={p.image}
                        alt={p.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-lg object-cover bg-neutral-950 border border-neutral-800 shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">{p.name}</h4>
                        <p className="text-[10px] text-neutral-400">
                          ₱{p.price.toLocaleString()} • {p.stock} in stock
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteProduct(p.id)}
                      className="p-1.5 rounded-lg bg-neutral-950 hover:bg-red-950 text-neutral-400 hover:text-red-400 border border-neutral-800 transition-colors"
                      title="Delete listing"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
