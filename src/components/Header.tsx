import React, { useState } from 'react';
import { 
  Wrench, 
  ShoppingCart, 
  Search, 
  Bike, 
  User, 
  Store, 
  LayoutDashboard, 
  Sparkles, 
  Menu, 
  X, 
  Code2, 
  PhoneCall, 
  Info,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { BikeModel } from '../types';
import { POPULAR_BIKES } from '../data/mockProducts';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  cartCount: number;
  openCart: () => void;
  selectedBike: BikeModel | null;
  setSelectedBike: (bike: BikeModel | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  openAIMechanic: () => void;
  openTechDocs: () => void;
  openAuthModal: () => void;
  userGcash: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  cartCount,
  openCart,
  selectedBike,
  setSelectedBike,
  searchQuery,
  setSearchQuery,
  openAIMechanic,
  openTechDocs,
  openAuthModal,
  userGcash,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bikeDropdownOpen, setBikeDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800/80">
      {/* Top Utility Announcement Bar */}
      <div className="bg-gradient-to-r from-red-950 via-neutral-900 to-red-950 text-neutral-300 text-xs py-1.5 px-4 border-b border-red-900/30">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-red-600/30 text-red-400 font-semibold text-[10px] border border-red-500/30">
              PH MARKETPLACE
            </span>
            <span className="hidden sm:inline">🇵🇭 Nationwide Express Delivery for Underbones & Scooters (XRM 125, Click 125, Aerox & more)</span>
            <span className="sm:hidden">🇵🇭 XRM 125 & Click 125 Parts Hub</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <div className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>PayMongo & GCash Verified</span>
            </div>
            <button 
              onClick={openTechDocs}
              className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 transition-colors"
            >
              <Code2 className="w-3 h-3" />
              <span>Supabase SQL & Vercel Guide</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo */}
          <div 
            onClick={() => { setCurrentTab('home'); }} 
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-lg shadow-red-600/20 group-hover:scale-105 transition-transform border border-red-500/40">
              <Wrench className="w-5 h-5 text-white transform -rotate-45" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-white font-['Outfit']">
                  MOTO<span className="text-red-500">STREET</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 font-bold border border-neutral-700">
                  PH
                </span>
              </div>
              <p className="text-[10px] text-neutral-400 font-medium tracking-wider uppercase">
                Underbone & Scooter Parts
              </p>
            </div>
          </div>

          {/* Center Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search XRM 125 pipes, Click 125 CVT pulley, carbs, shocks..."
                className="w-full bg-neutral-900/90 border border-neutral-800 text-neutral-100 text-xs sm:text-sm rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-red-500/80 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-neutral-500"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200 text-xs"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
            <button
              onClick={() => setCurrentTab('home')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                currentTab === 'home' 
                  ? 'text-white bg-neutral-800/90 font-semibold' 
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-900'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setCurrentTab('store')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                currentTab === 'store' 
                  ? 'text-white bg-neutral-800/90 font-semibold' 
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-900'
              }`}
            >
              Store Page
            </button>
            <button
              onClick={() => setCurrentTab('seller')}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
                currentTab === 'seller' 
                  ? 'text-red-400 bg-red-950/40 border border-red-800/50 font-semibold' 
                  : 'text-neutral-300 hover:text-red-400 hover:bg-neutral-900'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Seller Portal</span>
            </button>
            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
                currentTab === 'dashboard' 
                  ? 'text-white bg-neutral-800/90 font-semibold' 
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setCurrentTab('about')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                currentTab === 'about' 
                  ? 'text-white bg-neutral-800/90 font-semibold' 
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-900'
              }`}
            >
              About Us
            </button>
            <button
              onClick={() => setCurrentTab('contact')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                currentTab === 'contact' 
                  ? 'text-white bg-neutral-800/90 font-semibold' 
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-900'
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Right Action Icons & Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick Bike Fitment Selector Pill */}
            <div className="relative">
              <button
                onClick={() => setBikeDropdownOpen(!bikeDropdownOpen)}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 hover:border-red-500/50 transition-colors"
                title="Filter parts matching your motorcycle"
              >
                <Bike className="w-3.5 h-3.5 text-red-500" />
                <span className="max-w-[110px] truncate font-medium">
                  {selectedBike ? selectedBike.name.split('(')[0] : 'Select Bike'}
                </span>
                <ChevronDown className="w-3 h-3 text-neutral-500" />
              </button>

              {/* Bike Dropdown Menu */}
              {bikeDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="text-[11px] font-semibold text-neutral-400 px-2 py-1 uppercase tracking-wider">
                    Select Your Ride (Fitment Filter)
                  </div>
                  <div className="max-h-60 overflow-y-auto divide-y divide-neutral-800/50">
                    <button
                      onClick={() => {
                        setSelectedBike(null);
                        setBikeDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        !selectedBike ? 'bg-red-600/20 text-red-400' : 'text-neutral-300 hover:bg-neutral-800'
                      }`}
                    >
                      🌟 Show All Models
                    </button>
                    {POPULAR_BIKES.map((bike) => (
                      <button
                        key={bike.id}
                        onClick={() => {
                          setSelectedBike(bike);
                          setBikeDropdownOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-2 rounded-md text-xs font-medium flex items-center justify-between transition-colors ${
                          selectedBike?.id === bike.id ? 'bg-red-600/20 text-red-400 font-semibold' : 'text-neutral-300 hover:bg-neutral-800'
                        }`}
                      >
                        <span className="truncate">{bike.name}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded capitalize ${
                          bike.type === 'underbone' ? 'bg-blue-950 text-blue-300' : 'bg-amber-950 text-amber-300'
                        }`}>
                          {bike.type}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* AI Mechanic Quick Trigger */}
            <button
              onClick={openAIMechanic}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-rose-700 text-white text-xs font-semibold shadow-md shadow-red-600/20 hover:brightness-110 active:scale-95 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span className="hidden sm:inline">AI Mechanic</span>
            </button>

            {/* User Account / GCash badge */}
            <button
              onClick={openAuthModal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 text-xs transition-colors"
              title="User Account & GCash Setup"
            >
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline font-medium">
                {userGcash ? `GCash (${userGcash.slice(-4)})` : 'My Account'}
              </span>
            </button>

            {/* Cart Drawer Trigger */}
            <button
              onClick={openCart}
              className="relative p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 transition-colors"
              title="Open Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white font-bold text-[10px] min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1 shadow-md animate-in zoom-in">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search input */}
        <div className="md:hidden pb-3">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search XRM 125, Click 125, Aerox parts..."
              className="w-full bg-neutral-900 border border-neutral-800 text-neutral-100 text-xs rounded-lg pl-8 pr-4 py-2 focus:outline-none focus:border-red-500"
            />
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      {/* Mobile Menu Flyout */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-neutral-800 bg-neutral-950 px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top-4">
          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-neutral-800">
            <button
              onClick={() => { setCurrentTab('home'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-lg text-left text-xs font-semibold ${
                currentTab === 'home' ? 'bg-neutral-800 text-white' : 'text-neutral-300 bg-neutral-900'
              }`}
            >
              🏠 Home
            </button>
            <button
              onClick={() => { setCurrentTab('store'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-lg text-left text-xs font-semibold ${
                currentTab === 'store' ? 'bg-neutral-800 text-white' : 'text-neutral-300 bg-neutral-900'
              }`}
            >
              🛍️ Store Page
            </button>
            <button
              onClick={() => { setCurrentTab('seller'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-lg text-left text-xs font-semibold ${
                currentTab === 'seller' ? 'bg-red-950/60 text-red-400 border border-red-800' : 'text-neutral-300 bg-neutral-900'
              }`}
            >
              🏪 Seller Portal
            </button>
            <button
              onClick={() => { setCurrentTab('dashboard'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-lg text-left text-xs font-semibold ${
                currentTab === 'dashboard' ? 'bg-neutral-800 text-white' : 'text-neutral-300 bg-neutral-900'
              }`}
            >
              📊 Dashboard
            </button>
            <button
              onClick={() => { setCurrentTab('about'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-lg text-left text-xs font-semibold ${
                currentTab === 'about' ? 'bg-neutral-800 text-white' : 'text-neutral-300 bg-neutral-900'
              }`}
            >
              ℹ️ About Us
            </button>
            <button
              onClick={() => { setCurrentTab('contact'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-lg text-left text-xs font-semibold ${
                currentTab === 'contact' ? 'bg-neutral-800 text-white' : 'text-neutral-300 bg-neutral-900'
              }`}
            >
              📞 Contact
            </button>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => { openAIMechanic(); setMobileMenuOpen(false); }}
              className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-red-600 to-rose-700 text-white text-xs font-bold flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ask AI Moto Mechanic & Diagnoser</span>
            </button>
            <button
              onClick={() => { openTechDocs(); setMobileMenuOpen(false); }}
              className="w-full py-2 px-3 rounded-lg bg-neutral-900 border border-neutral-800 text-cyan-400 text-xs font-semibold flex items-center justify-center gap-2"
            >
              <Code2 className="w-4 h-4" />
              <span>View Supabase SQL & Vercel Guides</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
