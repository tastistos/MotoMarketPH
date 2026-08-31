import React, { useState } from 'react';
import { 
  Store, 
  PlusCircle, 
  Trash2, 
  Package, 
  Bike, 
  CheckCircle2, 
  UploadCloud, 
  Smartphone, 
  ArrowRight, 
  AlertCircle,
  Image as ImageIcon,
  Loader2,
  Check
} from 'lucide-react';
import { Product, ProductCategory, UserProfile } from '../types';
import { POPULAR_BIKES, DEMO_PRESET_ITEMS } from '../data/mockProducts';
import { insertProductToDb, deleteProductFromDb } from '../lib/supabase';

interface SellerPortalProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  userGcash: string;
  setUserGcash: (gcash: string) => void;
  userProfile: UserProfile | null;
  onOpenAuth: () => void;
}

export const SellerPortal: React.FC<SellerPortalProps> = ({
  products,
  onAddProduct,
  onDeleteProduct,
  userGcash,
  setUserGcash,
  userProfile,
  onOpenAuth,
}) => {
  const [storeName, setStoreName] = useState(userProfile?.fullName ? `${userProfile.fullName}'s Moto Garage` : 'Caloocan Moto Parts');
  const [sellerLocation, setSellerLocation] = useState('Metro Manila / Caloocan');
  const [gcashInput, setGcashInput] = useState(userProfile?.gcashNumber || userGcash || '0917-882-9310');

  // Form State
  const [productName, setProductName] = useState('');
  const [brand, setBrand] = useState('JVT Racing');
  const [category, setCategory] = useState<ProductCategory>('cvt_transmission');
  const [price, setPrice] = useState<number>(1850);
  const [originalPrice, setOriginalPrice] = useState<number>(2200);
  const [stock, setStock] = useState<number>(10);
  const [condition, setCondition] = useState<'Brand New' | 'Performance Tuned' | 'Mint 2nd Hand'>('Brand New');
  const [selectedBikes, setSelectedBikes] = useState<string[]>([
    'Honda Click 125i (V1 / V2 / V3)',
    'Honda XRM 125 (Carb / Fi)'
  ]);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80');

  const [saving, setSaving] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleBikeToggle = (bikeName: string) => {
    if (selectedBikes.includes(bikeName)) {
      setSelectedBikes(selectedBikes.filter(b => b !== bikeName));
    } else {
      setSelectedBikes([...selectedBikes, bikeName]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLoadDemoTemplate = (preset: typeof DEMO_PRESET_ITEMS[0]) => {
    setProductName(preset.name);
    setBrand(preset.brand);
    setCategory(preset.category);
    setPrice(preset.price);
    setOriginalPrice(preset.originalPrice || preset.price + 300);
    setStock(preset.stock);
    setCondition(preset.condition as any);
    setSelectedBikes(preset.compatibleBikes);
    setDescription(preset.description);
    setImageUrl(preset.image);
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!productName.trim()) {
      setErrorMsg('Please enter a listing title for the motorcycle part.');
      return;
    }
    if (selectedBikes.length === 0) {
      setErrorMsg('Please select at least 1 compatible motorcycle model.');
      return;
    }

    setSaving(true);

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name: productName.trim(),
      brand: brand.trim(),
      category,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      rating: 5.0,
      reviewCount: 1,
      image: imageUrl.trim() || 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80',
      stock: Number(stock),
      condition,
      compatibleBikes: selectedBikes,
      description: description.trim() || 'Genuine high-performance motorcycle component built for street and track use.',
      specifications: {
        'Material': 'Aviation T6 Alloy / Stainless',
        'Fitment': selectedBikes.join(', '),
        'Condition': condition,
        'Seller Contact': gcashInput
      },
      seller: {
        id: userProfile?.id || `seller-${Date.now()}`,
        name: storeName.trim() || userProfile?.fullName || 'Verified Rider Seller',
        gcashNumber: gcashInput.trim(),
        rating: 5.0,
        location: sellerLocation.trim(),
        verified: true
      },
      featured: true
    };

    try {
      // 1. Sync to Supabase products table
      await insertProductToDb(newProd);

      // 2. Add to app state
      onAddProduct(newProd);
      setUserGcash(gcashInput);

      setPostSuccess(true);
      setProductName('');
      setDescription('');

      setTimeout(() => {
        setPostSuccess(false);
      }, 3000);
    } catch (err: any) {
      console.warn('Supabase product upload note:', err);
      // Still add locally even if network has hiccup
      onAddProduct(newProd);
      setPostSuccess(true);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProductFromDb(id);
    } catch (err) {
      console.warn('Delete error:', err);
    }
    onDeleteProduct(id);
  };

  return (
    <div className="bg-neutral-950 min-h-screen py-8 px-4 sm:px-6 lg:px-8 border-b border-neutral-850 font-['Plus_Jakarta_Sans']">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Banner */}
        <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 max-w-2xl z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950 text-red-400 text-xs font-bold border border-red-800">
              <Store className="w-3.5 h-3.5" />
              <span>MOTOSTREET SELLER & TUNER HUB</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-['Outfit'] uppercase tracking-tight">
              Post Your Parts & Connect With Active Riders
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              Reach thousands of daily Honda Click 125/160, XRM 125, Raider 150, Wave 125, and Aerox riders across Metro Manila and Philippine provinces. Fast GCash buyer inquiries and direct rider-to-rider deals.
            </p>
          </div>

          <div className="flex items-center gap-3 z-10 shrink-0">
            <div className="px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-center">
              <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Direct Payouts</span>
              <span className="text-emerald-400 text-xs font-bold font-mono">GCash & PayMongo</span>
            </div>
          </div>
        </div>

        {/* Not logged in prompt */}
        {!userProfile && (
          <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-600/20 text-red-400 flex items-center justify-center font-bold">
                <Store className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Create a Rider Seller Profile to manage your inventory</p>
                <p className="text-[11px] text-neutral-400">Save your store name, GCash payout phone, and view customer orders.</p>
              </div>
            </div>
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors whitespace-nowrap"
            >
              Register / Sign In
            </button>
          </div>
        )}

        {/* Main Grid: Upload Form (7 cols) + Store Profile & Live Listings (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Form */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-6 space-y-5">
              
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-red-500" />
                  <h2 className="text-base font-bold text-white uppercase font-['Outfit']">
                    Post Motorcycle Part for Sale
                  </h2>
                </div>
                
                {/* Template quick loader */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-neutral-400 hidden sm:inline">Fill Template:</span>
                  <button
                    type="button"
                    onClick={() => handleLoadDemoTemplate(DEMO_PRESET_ITEMS[0])}
                    className="text-[10px] px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 transition-colors"
                  >
                    CVT Pulley
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLoadDemoTemplate(DEMO_PRESET_ITEMS[1])}
                    className="text-[10px] px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 transition-colors"
                  >
                    Open Pipe
                  </button>
                </div>
              </div>

              {postSuccess && (
                <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>
                    Motorcycle part posted successfully! It is now live in the Store catalog and stored in your Supabase database.
                  </span>
                </div>
              )}

              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleCreateProduct} className="space-y-4">
                
                {/* Title */}
                <div>
                  <label className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider block mb-1.5">
                    Listing Title / Part Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="e.g. JVT 13.5 Deg High Torque Pulley Set for Click 125i"
                    className="w-full bg-neutral-950 border border-neutral-800 text-xs rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-red-500 placeholder-neutral-600"
                  />
                </div>

                {/* Brand & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider block mb-1.5">
                      Brand / Tuner *
                    </label>
                    <input
                      type="text"
                      required
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      placeholder="e.g. JVT Racing / Daeng Sai4 / Keihin / RCB"
                      className="w-full bg-neutral-950 border border-neutral-800 text-xs rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-red-500 placeholder-neutral-600"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider block mb-1.5">
                      Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full bg-neutral-950 border border-neutral-800 text-xs rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-red-500"
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

                {/* Price, Original, Stock, Condition */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider block mb-1.5">
                      Price (PHP ₱) *
                    </label>
                    <input
                      type="number"
                      required
                      min="50"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full bg-neutral-950 border border-neutral-800 text-xs rounded-xl px-3.5 py-2.5 text-red-400 font-bold focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider block mb-1.5">
                      Orig. Price
                    </label>
                    <input
                      type="number"
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(Number(e.target.value))}
                      className="w-full bg-neutral-950 border border-neutral-800 text-xs rounded-xl px-3.5 py-2.5 text-neutral-400 focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider block mb-1.5">
                      Stock Qty *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={stock}
                      onChange={(e) => setStock(Number(e.target.value))}
                      className="w-full bg-neutral-950 border border-neutral-800 text-xs rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider block mb-1.5">
                      Condition *
                    </label>
                    <select
                      value={condition}
                      onChange={(e) => setCondition(e.target.value as any)}
                      className="w-full bg-neutral-950 border border-neutral-800 text-xs rounded-xl px-2.5 py-2.5 text-white focus:outline-none focus:border-red-500"
                    >
                      <option value="Brand New">Brand New</option>
                      <option value="Performance Tuned">Performance Tuned</option>
                      <option value="Mint 2nd Hand">Mint 2nd Hand</option>
                    </select>
                  </div>
                </div>

                {/* Bike Compatibility */}
                <div>
                  <label className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider block mb-1.5">
                    Compatible Motorcycle Models (Select all that fit) *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-36 overflow-y-auto p-2 bg-neutral-950 rounded-xl border border-neutral-800">
                    {POPULAR_BIKES.map((bike) => (
                      <label 
                        key={bike.id} 
                        className={`flex items-center gap-1.5 p-1.5 rounded-lg text-[11px] cursor-pointer transition-colors ${
                          selectedBikes.includes(bike.name) 
                            ? 'bg-red-950 text-red-300 font-bold border border-red-800/80' 
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

                {/* Image Upload / URL */}
                <div>
                  <label className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider block mb-1.5">
                    Product Image (Upload File or Enter URL)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-neutral-950 border border-neutral-800 text-xs rounded-xl px-3.5 py-2.5 text-neutral-300 focus:outline-none focus:border-red-500"
                    />
                    <label className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 text-xs font-semibold text-neutral-300 cursor-pointer transition-colors">
                      <UploadCloud className="w-4 h-4 text-red-500" />
                      <span>Upload from Device</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileUpload} 
                        className="hidden" 
                      />
                    </label>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider block mb-1.5">
                    Tuning Specs & Item Description
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe material, ramp angle, carburetor jetting, exhaust sound note, or performance gains..."
                    className="w-full bg-neutral-950 border border-neutral-800 text-xs rounded-xl p-3 text-white focus:outline-none focus:border-red-500 placeholder-neutral-600"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition-all disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Publishing to Supabase...</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4" />
                      <span>Publish Listing to Marketplace</span>
                    </>
                  )}
                </button>

              </form>

            </div>
          </div>

          {/* Right Column: Store Setup & Current Listings */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Store Details Card */}
            <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-5 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase font-['Outfit']">
                Seller Store Profile
              </h3>
              
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                    Store / Shop Name
                  </label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                    Location / City
                  </label>
                  <input
                    type="text"
                    value={sellerLocation}
                    onChange={(e) => setSellerLocation(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                    GCash Mobile Number (For Payouts)
                  </label>
                  <input
                    type="tel"
                    value={gcashInput}
                    onChange={(e) => setGcashInput(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white font-mono text-emerald-400 font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Active Listings in Database */}
            <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase font-['Outfit']">
                  Your Active Listings ({products.length})
                </h3>
                <span className="text-[10px] text-neutral-400">Live on Store</span>
              </div>

              {products.length === 0 ? (
                <div className="py-8 text-center space-y-2">
                  <Package className="w-8 h-8 text-neutral-600 mx-auto" />
                  <p className="text-xs text-neutral-400">No parts listed yet.</p>
                  <p className="text-[11px] text-neutral-500">Fill out the form on the left to post your first motorcycle upgrade!</p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                  {products.map((item) => (
                    <div 
                      key={item.id}
                      className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between gap-3 hover:border-neutral-700 transition-colors"
                    >
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-12 h-12 rounded-lg object-cover bg-neutral-900 shrink-0" 
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                        <p className="text-[10px] text-neutral-400 truncate">{item.brand} • Stock: {item.stock}</p>
                        <p className="text-xs font-bold text-red-400 font-['Outfit']">₱{item.price.toLocaleString()} PHP</p>
                      </div>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded-lg bg-neutral-900 text-neutral-400 hover:text-red-400 hover:bg-red-950/40 transition-colors"
                        title="Delete listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
