import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Search, 
  Bike, 
  Store, 
  LayoutDashboard, 
  Menu, 
  X, 
  ChevronDown, 
  LogOut, 
  LogIn 
} from 'lucide-react';
import { BikeModel, NavTab, UserProfile } from '../types';
import { POPULAR_BIKES } from '../data/mockProducts';
import logoIcon from '../assets/images/motostreet_logo_icon_1788169595873.jpg';

interface HeaderProps {
  currentTab: NavTab;
  setCurrentTab: (tab: NavTab) => void;
  cartCount: number;
  onOpenCart: () => void;
  selectedBike: BikeModel | null;
  setSelectedBike: (bike: BikeModel | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenVoiceflow?: () => void;
  onOpenGuides?: () => void;
  onOpenSiteMap?: () => void;
  userProfile: UserProfile | null;
  onOpenAuth: () => void;
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  cartCount,
  onOpenCart,
  selectedBike,
  setSelectedBike,
  searchQuery,
  setSearchQuery,
  userProfile,
  onOpenAuth,
  onSignOut,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bikeDropdownOpen, setBikeDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-neutral-950/95 backdrop-blur-md border-b border-neutral-850 font-['Plus_Jakarta_Sans']">
      {/* Main Navigation Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-6">
          
          {/* Logo & Emblem */}
          <div 
            onClick={() => setCurrentTab('home')} 
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-neutral-750 bg-neutral-900 shadow-md shadow-red-600/10 group-hover:border-red-500 transition-all shrink-0">
              <img 
                src={logoIcon} 
                alt="MotoStreet PH Logo" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
              />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-black text-lg sm:text-xl tracking-tight text-white font-['Outfit']">
                  MOTO<span className="text-red-500">STREET</span>
                </span>
                <span className="text-[10px] px-1 rounded bg-neutral-800 text-neutral-300 font-bold border border-neutral-700">
                  PH
                </span>
              </div>
              <p className="text-[9px] sm:text-[10px] text-neutral-400 font-medium tracking-wider uppercase">
                Underbone & Scooter Tuning
              </p>
            </div>
          </div>

          {/* Search Box */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Click 125 pulley, XRM 125 pipe, carbs, flyballs..."
                className="w-full bg-neutral-900 border border-neutral-800 text-neutral-100 text-xs rounded-xl pl-9 pr-8 py-2 focus:outline-none focus:border-red-500 transition-colors placeholder:text-neutral-500"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-bold font-['Outfit'] uppercase tracking-wider">
            <button
              onClick={() => setCurrentTab('home')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                currentTab === 'home' 
                  ? 'text-white bg-neutral-850' 
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setCurrentTab('store')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                currentTab === 'store' 
                  ? 'text-white bg-neutral-850' 
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              Store
            </button>
            <button
              onClick={() => setCurrentTab('seller')}
              className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
                currentTab === 'seller' 
                  ? 'text-red-400 bg-red-950/50 border border-red-800/60' 
                  : 'text-neutral-400 hover:text-red-400 hover:bg-neutral-900'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Sell Parts</span>
            </button>
            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
                currentTab === 'dashboard' 
                  ? 'text-white bg-neutral-850' 
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Garage</span>
            </button>
          </nav>

          {/* Action Bar */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Bike Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setBikeDropdownOpen(!bikeDropdownOpen)}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 hover:border-neutral-700 transition-colors"
                title="Filter parts matching your motorcycle"
              >
                <Bike className="w-3.5 h-3.5 text-red-500" />
                <span className="max-w-[100px] truncate font-medium text-[11px]">
                  {selectedBike ? selectedBike.name.split('(')[0] : 'All Bikes'}
                </span>
                <ChevronDown className="w-3 h-3 text-neutral-500" />
              </button>

              {bikeDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-neutral-950 border border-neutral-800 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in">
                  <div className="text-[10px] font-bold text-neutral-400 px-2 py-1 uppercase tracking-wider">
                    Select Your Bike Model
                  </div>
                  <div className="max-h-60 overflow-y-auto divide-y divide-neutral-900">
                    <button
                      onClick={() => {
                        setSelectedBike(null);
                        setBikeDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium ${
                        !selectedBike ? 'bg-red-950 text-red-400' : 'text-neutral-300 hover:bg-neutral-900'
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
                        className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium flex items-center justify-between ${
                          selectedBike?.id === bike.id ? 'bg-red-950 text-red-400 font-bold' : 'text-neutral-300 hover:bg-neutral-900'
                        }`}
                      >
                        <span className="truncate">{bike.name}</span>
                        <span className="text-[9px] px-1 py-0.5 rounded bg-neutral-900 text-neutral-400 capitalize">
                          {bike.displacement}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Auth / Profile Button */}
            {userProfile ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-200 hover:text-white text-xs font-semibold"
                >
                  <div className="w-5 h-5 rounded-full bg-red-600/30 text-red-400 flex items-center justify-center text-[10px] font-bold">
                    {userProfile.fullName.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:inline max-w-[90px] truncate text-[11px]">
                    {userProfile.fullName.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-neutral-500" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-neutral-950 border border-neutral-800 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in">
                    <div className="px-3 py-2 border-b border-neutral-850">
                      <p className="text-xs font-bold text-white truncate">{userProfile.fullName}</p>
                      <p className="text-[10px] text-neutral-400 truncate">{userProfile.email}</p>
                      {userProfile.gcashNumber && (
                        <p className="text-[10px] text-blue-400 mt-0.5">GCash: {userProfile.gcashNumber}</p>
                      )}
                    </div>
                    <div className="py-1 space-y-0.5 text-xs">
                      <button
                        onClick={() => { setCurrentTab('dashboard'); setUserMenuOpen(false); }}
                        className="w-full text-left px-3 py-1.5 rounded-lg text-neutral-300 hover:bg-neutral-900 flex items-center gap-2"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5" />
                        <span>Rider Garage & Orders</span>
                      </button>
                      <button
                        onClick={() => { setCurrentTab('seller'); setUserMenuOpen(false); }}
                        className="w-full text-left px-3 py-1.5 rounded-lg text-neutral-300 hover:bg-neutral-900 flex items-center gap-2"
                      >
                        <Store className="w-3.5 h-3.5 text-red-400" />
                        <span>Seller Portal</span>
                      </button>
                    </div>
                    <div className="pt-1 border-t border-neutral-850">
                      <button
                        onClick={() => { onSignOut(); setUserMenuOpen(false); }}
                        className="w-full text-left px-3 py-1.5 rounded-lg text-red-400 hover:bg-red-950/40 text-xs flex items-center gap-2 font-semibold"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 text-xs font-bold transition-colors"
              >
                <LogIn className="w-3.5 h-3.5 text-cyan-400" />
                <span>Log In</span>
              </button>
            )}

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 transition-colors"
              title="Shopping Cart"
            >
              <ShoppingCart className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white font-black text-[10px] min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1 shadow-md">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
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
              className="w-full bg-neutral-900 border border-neutral-800 text-neutral-100 text-xs rounded-xl pl-8 pr-4 py-2 focus:outline-none focus:border-red-500"
            />
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-neutral-850 bg-neutral-950 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-4">
          <div className="grid grid-cols-2 gap-2 pb-2">
            <button
              onClick={() => { setCurrentTab('home'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-xl text-left text-xs font-bold ${
                currentTab === 'home' ? 'bg-neutral-850 text-white' : 'text-neutral-300 bg-neutral-900'
              }`}
            >
              🏠 Home
            </button>
            <button
              onClick={() => { setCurrentTab('store'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-xl text-left text-xs font-bold ${
                currentTab === 'store' ? 'bg-neutral-850 text-white' : 'text-neutral-300 bg-neutral-900'
              }`}
            >
              🛍️ Store
            </button>
            <button
              onClick={() => { setCurrentTab('seller'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-xl text-left text-xs font-bold ${
                currentTab === 'seller' ? 'bg-red-950/60 text-red-400 border border-red-800' : 'text-neutral-300 bg-neutral-900'
              }`}
            >
              🏪 Post Parts
            </button>
            <button
              onClick={() => { setCurrentTab('dashboard'); setMobileMenuOpen(false); }}
              className={`p-2.5 rounded-xl text-left text-xs font-bold ${
                currentTab === 'dashboard' ? 'bg-neutral-850 text-white' : 'text-neutral-300 bg-neutral-900'
              }`}
            >
              📊 My Garage
            </button>
          </div>
        </div>
      )}

    </header>
  );
};
