import React, { useState } from 'react';
import { 
  Truck, 
  Search, 
  Package, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Bike, 
  Phone, 
  ShieldCheck, 
  AlertCircle,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { Order } from '../types';

interface OrderTrackingViewProps {
  orders: Order[];
  selectedTrackingNumber?: string;
  onSelectOrder?: (order: Order) => void;
}

export const OrderTrackingView: React.FC<OrderTrackingViewProps> = ({
  orders,
  selectedTrackingNumber,
}) => {
  const [searchCode, setSearchCode] = useState(selectedTrackingNumber || (orders[0]?.trackingNumber || ''));
  const [activeOrder, setActiveOrder] = useState<Order | null>(
    orders.find(o => o.trackingNumber === searchCode) || orders[0] || null
  );
  const [isSimulatingUpdate, setIsSimulatingUpdate] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchCode.trim().toUpperCase();
    const found = orders.find(o => o.trackingNumber.toUpperCase() === query || o.id === query);
    if (found) {
      setActiveOrder(found);
    } else {
      alert(`No active order found with tracking number "${searchCode}". Please check your tracking code or order history.`);
    }
  };

  const handleSimulateNextStep = () => {
    if (!activeOrder) return;
    setIsSimulatingUpdate(true);

    setTimeout(() => {
      setIsSimulatingUpdate(false);
      const updatedHistory = activeOrder.trackingHistory.map((step, idx) => {
        if (!step.completed) {
          return {
            ...step,
            completed: true,
            timestamp: 'Just Now (' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ')'
          };
        }
        return step;
      });

      const updatedOrder: Order = {
        ...activeOrder,
        orderStatus: activeOrder.orderStatus === 'placed' ? 'processing' : activeOrder.orderStatus === 'processing' ? 'shipped' : 'in_transit',
        trackingHistory: updatedHistory
      };
      setActiveOrder(updatedOrder);
    }, 1000);
  };

  return (
    <div className="bg-neutral-950 min-h-screen py-8 px-4 sm:px-6 lg:px-8 border-b border-neutral-850">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/60 border border-red-800 text-red-400 text-xs font-bold uppercase">
            <Truck className="w-3.5 h-3.5" />
            <span>LIVE MOTORCYCLE PARTS DISPATCH & TRACKING</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white font-['Outfit'] uppercase">
            Real-Time Express Delivery Tracker
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 font-['Plus_Jakarta_Sans'] max-w-lg mx-auto">
            Track your underbone exhausts, scooter CVT pulleys, and racing bore kits across nationwide transit hubs.
          </p>
        </div>

        {/* Tracking Code Search Box */}
        <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mx-auto">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              placeholder="Enter Tracking ID (e.g. MOTO-8291-PH)"
              className="w-full bg-neutral-900 border border-neutral-800 text-xs sm:text-sm rounded-xl pl-9 pr-4 py-3 text-white font-mono uppercase focus:outline-none focus:border-red-500"
            />
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          <button
            type="submit"
            className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 transition-all active:scale-95"
          >
            Track Ride
          </button>
        </form>

        {/* Active Order Card & Progress Timeline */}
        {activeOrder ? (
          <div className="rounded-2xl bg-neutral-900/90 border border-neutral-800 p-6 space-y-6 shadow-2xl">
            
            {/* Top Status Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-800 gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-400">Tracking Code:</span>
                  <span className="text-sm sm:text-base font-black text-red-500 font-mono">
                    {activeOrder.trackingNumber}
                  </span>
                </div>
                <p className="text-xs text-neutral-300 mt-0.5">
                  Courier: <strong className="text-white">{activeOrder.courier}</strong> • Estimated Delivery: <strong className="text-emerald-400">{activeOrder.estimatedDelivery}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs px-3 py-1 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800 font-bold uppercase tracking-wider">
                  ● PayMongo GCash Paid
                </span>
                <button
                  onClick={handleSimulateNextStep}
                  disabled={isSimulatingUpdate}
                  className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                  title="Simulate next courier hub update"
                >
                  <RefreshCw className={`w-3 h-3 ${isSimulatingUpdate ? 'animate-spin' : ''}`} />
                  <span>Update Milestone</span>
                </button>
              </div>
            </div>

            {/* Courier & Rider Info Card */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-neutral-950 border border-neutral-850 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-red-950 text-red-400 flex items-center justify-center font-bold">
                  <Bike className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-neutral-400 text-[10px] uppercase font-bold block">Assigned Rider</span>
                  <span className="text-white font-bold">Kuya Marlon (Plate: 8291-AB)</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-neutral-400 text-[10px] uppercase font-bold block">Rider Contact</span>
                  <span className="text-white font-mono">0919-442-8819</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-950 text-cyan-400 flex items-center justify-center font-bold">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-neutral-400 text-[10px] uppercase font-bold block">Destination</span>
                  <span className="text-white truncate block max-w-[180px]">{activeOrder.customer.city}, {activeOrder.customer.province}</span>
                </div>
              </div>
            </div>

            {/* Visual Timeline */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Live Transit Milestones & Delivery Status
              </h3>

              <div className="space-y-4 relative pl-6 border-l-2 border-neutral-800 ml-2">
                {activeOrder.trackingHistory.map((step, idx) => (
                  <div key={idx} className="relative group">
                    {/* Circle Node */}
                    <div className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      step.completed 
                        ? 'bg-red-600 border-red-500 text-white shadow-md shadow-red-600/50' 
                        : 'bg-neutral-900 border-neutral-700 text-neutral-600'
                    }`}>
                      {step.completed && <CheckCircle2 className="w-2.5 h-2.5" />}
                    </div>

                    {/* Step Details */}
                    <div className="space-y-0.5">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-xs font-bold ${step.completed ? 'text-white' : 'text-neutral-500'}`}>
                          {step.title}
                        </h4>
                        <span className={`text-[10px] font-mono ${step.completed ? 'text-red-400' : 'text-neutral-600'}`}>
                          {step.timestamp}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Itemized Order Summary in Tracking */}
            <div className="pt-4 border-t border-neutral-800 space-y-3">
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Package Contents ({activeOrder.items.length} parts)
              </h3>
              <div className="divide-y divide-neutral-850">
                {activeOrder.items.map((item, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <img
                        src={item.image}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-9 h-9 rounded object-cover bg-neutral-950 border border-neutral-800"
                      />
                      <div>
                        <span className="font-semibold text-white block">{item.name}</span>
                        <span className="text-[10px] text-neutral-400">Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-bold text-neutral-200">
                      ₱{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : (
          <div className="rounded-2xl bg-neutral-900/50 border border-neutral-800 p-8 text-center space-y-3">
            <Package className="w-10 h-10 text-neutral-500 mx-auto" />
            <h3 className="text-base font-bold text-white">No Tracking History Available</h3>
            <p className="text-xs text-neutral-400">
              Place an order on the Store Page or enter an existing tracking number like <code className="text-red-400">MOTO-7829-PH</code>.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
