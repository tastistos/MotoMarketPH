import React from 'react';
import { ShoppingCart, ArrowRight, ShieldCheck, Zap, PackageCheck } from 'lucide-react';
import { CartItem, UserProfile } from '../types';

interface FloatingCartBarProps {
  items: CartItem[];
  discount: number;
  onOpenCart: () => void;
  onProceedToCheckout: () => void;
  userProfile: UserProfile | null;
  onOpenAuth: () => void;
}

export const FloatingCartBar: React.FC<FloatingCartBarProps> = ({
  items,
  discount,
  onOpenCart,
  onProceedToCheckout,
  userProfile,
  onOpenAuth,
}) => {
  if (items.length === 0) return null;

  const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + (i.product.price * i.quantity), 0);
  const shippingFee = 120;
  const estimatedTotal = Math.max(0, subtotal + shippingFee - discount);

  const handleCheckoutClick = () => {
    if (!userProfile) {
      onOpenAuth();
    } else {
      onProceedToCheckout();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/95 border-t border-neutral-800 backdrop-blur-xl shadow-2xl p-3 sm:p-4 animate-in slide-in-from-bottom font-['Plus_Jakarta_Sans']">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Left: Cart Info & Next Steps Guide */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="relative w-10 h-10 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center font-bold border border-red-600/30">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-600 text-white font-extrabold text-[10px] flex items-center justify-center border-2 border-neutral-950">
                {totalQuantity}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white font-['Outfit'] uppercase">
                  {totalQuantity} {totalQuantity === 1 ? 'Part Ready' : 'Parts Ready'}
                </span>
                <span className="text-xs font-black text-red-500 font-['Outfit']">
                  ₱{estimatedTotal.toLocaleString()} PHP
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 hidden xs:flex items-center gap-1.5">
                <span>1. Cart</span>
                <span>➔</span>
                <span className="text-emerald-400 font-semibold">2. PayMongo GCash / Maya</span>
                <span>➔</span>
                <span>3. Live Tracking</span>
              </p>
            </div>
          </div>

          <button
            onClick={onOpenCart}
            className="sm:hidden text-xs text-neutral-300 hover:text-white underline px-2 py-1"
          >
            Review Cart
          </button>
        </div>

        {/* Right: Direct Checkout & Buy Now Button */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={onOpenCart}
            className="hidden sm:flex px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 text-xs font-bold border border-neutral-800 transition-colors items-center gap-1.5 shrink-0"
          >
            <span>Review Items</span>
          </button>

          <button
            onClick={handleCheckoutClick}
            className="flex-1 sm:flex-initial px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 active:scale-95 transition-all"
          >
            <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
            <span>Proceed to Checkout Now (₱{estimatedTotal.toLocaleString()})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
