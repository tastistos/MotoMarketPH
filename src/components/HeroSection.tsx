import React, { useState } from 'react';
import { 
  Bike, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Truck, 
  CheckCircle2, 
  Flame, 
  CreditCard,
  Store,
  ChevronRight
} from 'lucide-react';
import { BikeModel } from '../types';
import { POPULAR_BIKES } from '../data/mockProducts';

interface HeroSectionProps {
  onExploreCatalog: () => void;
  onOpenAIMechanic: () => void;
  onOpenSellerPortal: () => void;
  selectedBike: BikeModel | null;
  setSelectedBike: (bike: BikeModel | null) => void;
  onSelectCategory: (category: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreCatalog,
  onOpenAIMechanic,
  onOpenSellerPortal,
  selectedBike,
  setSelectedBike,
  onSelectCategory,
}) => {
  const [selectedType, setSelectedType] = useState<'all' | 'underbone' | 'scooter'>('all');
  const [tempBikeId, setTempBikeId] = useState<string>(selectedBike?.id || 'click-125');

  const filteredBikes = POPULAR_BIKES.filter(b => selectedType === 'all' || b.type === selectedType);

  const handleApplyBike = () => {
    const found = POPULAR_BIKES.find(b => b.id === tempBikeId);
    if (found) {
      setSelectedBike(found);
      onExploreCatalog();
    }
  };

  return (
    <section className="relative overflow-hidden bg-neutral-950 border-b border-neutral-850 pt-6 pb-12 lg:pt-10 lg:pb-16">
      {/* Dynamic Background Glow & Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(225,29,72,0.15),rgba(255,255,255,0))]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f2315_1px,transparent_1px),linear-gradient(to_bottom,#1f1f2315_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Rule of Thirds Layout: 2/3 Content & Visuals, 1/3 Interactive Ride Matcher */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column (8 of 12 cols - 2/3 ratio) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-950/60 border border-red-800/60 text-red-400 text-xs font-semibold tracking-wide">
              <Flame className="w-3.5 h-3.5 text-red-500 animate-pulse" />
              <span>PHILIPPINES' #1 UNDERBONE & SCOOTER TUNING MARKETPLACE</span>
            </div>

            {/* Hierarchical Display Headline */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white font-['Outfit'] uppercase leading-none">
                UNLEASH PEAK <br />
                <span className="bg-gradient-to-r from-red-500 via-rose-400 to-amber-400 bg-clip-text text-transparent">
                  STREET PERFORMANCE
                </span>
              </h1>
              <p className="text-sm sm:text-lg text-neutral-400 max-w-2xl font-['Plus_Jakarta_Sans'] leading-relaxed">
                Precision tuning parts for <strong className="text-neutral-200">Honda XRM 125, Wave 125, Click 125i/160, Suzuki Raider 150, Aerox & NMAX</strong>. 
                Full stainless exhaust systems, ceramic 59mm bore kits, high-torque CVT pulleys, and racing carburetors backed by PayMongo & GCash buyer protection.
              </p>
            </div>

            {/* Primary & Secondary Action CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <button
                onClick={onExploreCatalog}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-sm sm:text-base shadow-xl shadow-red-600/25 flex items-center gap-2 group transition-all transform active:scale-95"
              >
                <span>Explore Parts Catalog</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onOpenAIMechanic}
                className="px-5 py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-750 text-neutral-200 font-semibold text-sm sm:text-base flex items-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>AI Moto Mechanic</span>
              </button>

              <button
                onClick={onOpenSellerPortal}
                className="px-4 py-3.5 rounded-xl bg-neutral-950/80 hover:bg-neutral-900 border border-red-900/40 text-red-400 hover:text-red-300 font-semibold text-sm flex items-center gap-1.5 transition-all"
              >
                <Store className="w-4 h-4" />
                <span>Sell Your Parts (GCash)</span>
              </button>
            </div>

            {/* Trust & Guarantee Markers */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-neutral-900">
              <div className="flex items-center gap-2 text-xs text-neutral-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>PayMongo & GCash Verified</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-300">
                <Truck className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Nationwide J&T Delivery</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-300">
                <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                <span>100% Bolt-On Fitment</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-300">
                <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Verified Buyer Reviews</span>
              </div>
            </div>

          </div>

          {/* Right Column (4 of 12 cols - 1/3 ratio): Interactive Ride Matcher Card */}
          <div className="lg:col-span-4">
            <div className="rounded-2xl bg-neutral-900/90 border border-neutral-800 p-5 shadow-2xl shadow-black/60 relative overflow-hidden backdrop-blur-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-red-600/20 text-red-500 flex items-center justify-center font-bold">
                    <Bike className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white font-['Outfit'] uppercase">
                      Quick Ride Matcher
                    </h2>
                    <p className="text-[11px] text-neutral-400">
                      Guaranteed compatibility filter
                    </p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-800 text-amber-400 font-bold border border-neutral-700">
                  LIVE FIT
                </span>
              </div>

              {/* Step 1: Bike Category Toggle */}
              <div className="space-y-1.5 mb-3">
                <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  1. Motorcycle Architecture
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedType('all')}
                    className={`py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      selectedType === 'all' 
                        ? 'bg-red-600 text-white shadow-md' 
                        : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
                    }`}
                  >
                    All Types
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedType('underbone')}
                    className={`py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      selectedType === 'underbone' 
                        ? 'bg-red-600 text-white shadow-md' 
                        : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
                    }`}
                  >
                    Underbone
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedType('scooter')}
                    className={`py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      selectedType === 'scooter' 
                        ? 'bg-red-600 text-white shadow-md' 
                        : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
                    }`}
                  >
                    Scooter
                  </button>
                </div>
              </div>

              {/* Step 2: Specific Motorcycle Model Select */}
              <div className="space-y-1.5 mb-4">
                <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  2. Choose Your Bike Model
                </label>
                <select
                  value={tempBikeId}
                  onChange={(e) => setTempBikeId(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 text-white text-xs sm:text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                >
                  {filteredBikes.map((bike) => (
                    <option key={bike.id} value={bike.id}>
                      {bike.name} ({bike.displacement}) - {bike.type.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quick Category Jump Badges */}
              <div className="space-y-1.5 mb-4">
                <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Popular Upgrades
                </label>
                <div className="flex flex-wrap gap-1.5">
                  <button 
                    onClick={() => onSelectCategory('cvt_transmission')}
                    className="text-[11px] px-2 py-1 rounded bg-neutral-950 hover:bg-neutral-800 text-neutral-300 border border-neutral-800"
                  >
                    ⚙️ CVT Pulley & Belts
                  </button>
                  <button 
                    onClick={() => onSelectCategory('exhaust')}
                    className="text-[11px] px-2 py-1 rounded bg-neutral-950 hover:bg-neutral-800 text-neutral-300 border border-neutral-800"
                  >
                    💨 Stainless Pipes
                  </button>
                  <button 
                    onClick={() => onSelectCategory('engine')}
                    className="text-[11px] px-2 py-1 rounded bg-neutral-950 hover:bg-neutral-800 text-neutral-300 border border-neutral-800"
                  >
                    🔥 59mm Bore Kits
                  </button>
                  <button 
                    onClick={() => onSelectCategory('suspension_brakes')}
                    className="text-[11px] px-2 py-1 rounded bg-neutral-950 hover:bg-neutral-800 text-neutral-300 border border-neutral-800"
                  >
                    ⚡ RCB Shocks & Discs
                  </button>
                </div>
              </div>

              {/* Match Button */}
              <button
                type="button"
                onClick={handleApplyBike}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs sm:text-sm font-bold uppercase tracking-wider shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <span>Filter Matched Parts</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-center text-neutral-500 mt-2.5">
                Instant filtering across exhausts, blocks, pulleys, and carbs
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
