import React, { useState } from 'react';
import { 
  User, 
  Bike, 
  Package, 
  Smartphone, 
  ShieldCheck, 
  Clock, 
  Wrench, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Order, BikeModel } from '../types';
import { POPULAR_BIKES } from '../data/mockProducts';

interface UserDashboardProps {
  orders: Order[];
  onTrackOrder: (trackingNumber: string) => void;
  userGcash: string;
  setUserGcash: (gcash: string) => void;
  onNavigateToStore: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  orders,
  onTrackOrder,
  userGcash,
  setUserGcash,
  onNavigateToStore,
}) => {
  const [userName, setUserName] = useState('Danilo Marquez');
  const [userEmail, setUserEmail] = useState('danilo.rider@gmail.com');
  const [userPhone, setUserPhone] = useState('0917-882-9310');
  const [gcashNumber, setGcashNumber] = useState(userGcash || '0917-882-9310');
  const [city, setCity] = useState('Quezon City, Metro Manila');
  
  // Rider Garage (Bikes owned by user)
  const [garageBikes, setGarageBikes] = useState<string[]>([
    'Honda Click 125i (V2 Game Changer)',
    'Honda XRM 125 Motard (Carb Edition)'
  ]);
  const [newBikeToAdd, setNewBikeToAdd] = useState('Suzuki Raider R150 Fi');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUserGcash(gcashNumber);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleAddBike = () => {
    if (!garageBikes.includes(newBikeToAdd)) {
      setGarageBikes([...garageBikes, newBikeToAdd]);
    }
  };

  const handleRemoveBike = (bike: string) => {
    setGarageBikes(garageBikes.filter(b => b !== bike));
  };

  return (
    <div className="bg-neutral-950 min-h-screen py-8 px-4 sm:px-6 lg:px-8 border-b border-neutral-850">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Profile Header */}
        <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-rose-600 text-white font-black text-2xl flex items-center justify-center font-['Outfit'] shadow-lg shadow-red-600/30">
              {userName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white font-['Outfit']">{userName}</h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
                  Verified Rider
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-['Plus_Jakarta_Sans'] mt-0.5">
                {userEmail} • {city}
              </p>
              <div className="flex items-center gap-2 text-xs text-neutral-300 mt-1">
                <Smartphone className="w-3.5 h-3.5 text-blue-400" />
                <span>GCash: <strong className="font-mono text-white">{gcashNumber}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={onNavigateToStore}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider shadow-md active:scale-95 transition-all"
            >
              Explore Parts for My Bikes
            </button>
          </div>
        </div>

        {/* 2-Column Layout: Order History (7 cols) + Rider Garage & Settings (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Orders & Purchases */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-red-500" />
                  <h2 className="text-base font-bold text-white uppercase font-['Outfit']">
                    Purchase & Order History ({orders.length})
                  </h2>
                </div>
                <span className="text-[11px] text-neutral-400">PayMongo & GCash Records</span>
              </div>

              {orders.length === 0 ? (
                <div className="py-8 text-center space-y-2">
                  <Package className="w-10 h-10 text-neutral-600 mx-auto" />
                  <p className="text-xs text-neutral-400">You haven't placed any parts orders yet.</p>
                  <button
                    onClick={onNavigateToStore}
                    className="text-xs font-bold text-red-400 hover:underline"
                  >
                    Browse Street Parts Store →
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="p-4 rounded-xl bg-neutral-950 border border-neutral-850 space-y-3 hover:border-neutral-700 transition-colors"
                    >
                      <div className="flex items-center justify-between text-xs pb-2 border-b border-neutral-850">
                        <div>
                          <span className="text-neutral-400">Order Ref: </span>
                          <span className="font-mono font-bold text-red-400">{order.trackingNumber}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800 text-[10px] font-bold uppercase">
                          {order.paymentStatus}
                        </span>
                      </div>

                      {/* Items */}
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <img
                                src={item.image}
                                alt={item.name}
                                referrerPolicy="no-referrer"
                                className="w-8 h-8 rounded object-cover bg-neutral-900"
                              />
                              <div>
                                <h4 className="font-semibold text-white truncate max-w-[220px]">{item.name}</h4>
                                <span className="text-[10px] text-neutral-400">Qty: {item.quantity}</span>
                              </div>
                            </div>
                            <span className="font-bold text-neutral-200">
                              ₱{(item.price * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Footer & Action */}
                      <div className="flex items-center justify-between pt-2 border-t border-neutral-850 text-xs">
                        <span className="text-neutral-400">
                          Total: <strong className="text-white font-['Outfit']">₱{order.total.toLocaleString()} PHP</strong>
                        </span>
                        <button
                          onClick={() => onTrackOrder(order.trackingNumber)}
                          className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-red-400 font-bold text-xs flex items-center gap-1 border border-neutral-800 transition-colors"
                        >
                          <span>Track Delivery</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Garage & Profile Settings */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* My Motorcycle Garage */}
            <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-6 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <Bike className="w-5 h-5 text-red-500" />
                  <h3 className="text-sm font-bold text-white uppercase font-['Outfit']">
                    My Motorcycle Garage
                  </h3>
                </div>
                <span className="text-[10px] text-neutral-400">Auto-Fitment Enabled</span>
              </div>

              <div className="space-y-2">
                {garageBikes.map((bike, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-950 border border-neutral-850 text-xs">
                    <div className="flex items-center gap-2">
                      <Bike className="w-4 h-4 text-red-400 shrink-0" />
                      <span className="font-semibold text-neutral-200">{bike}</span>
                    </div>
                    <button
                      onClick={() => handleRemoveBike(bike)}
                      className="text-neutral-500 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Bike Form */}
              <div className="pt-2 flex gap-1.5">
                <select
                  value={newBikeToAdd}
                  onChange={(e) => setNewBikeToAdd(e.target.value)}
                  className="flex-1 bg-neutral-950 border border-neutral-800 text-xs rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-red-500"
                >
                  {POPULAR_BIKES.map(b => (
                    <option key={b.id} value={b.name}>{b.name}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddBike}
                  className="px-3 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Profile & GCash Settings Form */}
            <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-6 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-red-500" />
                  <h3 className="text-sm font-bold text-white uppercase font-['Outfit']">
                    Account & GCash Settings
                  </h3>
                </div>
              </div>

              {savedSuccess && (
                <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Profile & GCash updated successfully!</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-3">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-400 block mb-1">Rider Full Name</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 text-xs rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-400 block mb-1">GCash Mobile Number</label>
                  <input
                    type="text"
                    value={gcashNumber}
                    onChange={(e) => setGcashNumber(e.target.value)}
                    className="w-full bg-neutral-950 border border-blue-900 text-xs rounded-lg px-3 py-2 text-blue-300 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-400 block mb-1">Delivery City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 text-xs rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider shadow-md"
                >
                  Save Rider Profile
                </button>
              </form>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
