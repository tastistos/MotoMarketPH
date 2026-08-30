import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  ShoppingCart, 
  ArrowRight, 
  ShieldCheck, 
  Tag, 
  Bike,
  CreditCard
} from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
  discount: number;
  setDiscount: (discount: number) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  discount,
  setDiscount,
}) => {
  if (!isOpen) return null;

  const [voucherCode, setVoucherCode] = useState('');
  const [voucherError, setVoucherError] = useState('');
  const [voucherSuccess, setVoucherSuccess] = useState('');

  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const shippingFee = items.length > 0 ? 120 : 0;
  const total = Math.max(0, subtotal + shippingFee - discount);

  const applyVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    setVoucherError('');
    setVoucherSuccess('');

    const code = voucherCode.trim().toUpperCase();
    if (code === 'MOTO100' || code === 'GCASH50' || code === 'CLICKXRM') {
      const discountAmount = code === 'MOTO100' ? 100 : code === 'CLICKXRM' ? 150 : 50;
      setDiscount(discountAmount);
      setVoucherSuccess(`₱${discountAmount} voucher applied!`);
    } else {
      setVoucherError('Invalid promo code. Try "MOTO100" for ₱100 off!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end animate-in fade-in">
      <div className="w-full max-w-md bg-neutral-950 h-full border-l border-neutral-800 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-600/20 text-red-500 flex items-center justify-center font-bold">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase font-['Outfit']">Your Moto Cart</h3>
              <p className="text-[11px] text-neutral-400">
                {items.length} {items.length === 1 ? 'part item' : 'part items'} selected
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-neutral-900 space-y-3">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-neutral-900 text-neutral-500 flex items-center justify-center">
                <ShoppingCart className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-white font-['Outfit']">Your Cart is Empty</h4>
              <p className="text-xs text-neutral-400 max-w-xs">
                Browse our XRM 125, Click 125, Raider 150 exhausts, pulleys, and bore kits to start upgrading your ride.
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-xs font-bold uppercase tracking-wider"
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.product.id} className="pt-3 first:pt-0 flex gap-3">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-lg object-cover bg-neutral-900 border border-neutral-800 shrink-0"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-xs font-bold text-white line-clamp-1 font-['Outfit']">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-neutral-500 hover:text-red-400 p-0.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[10px] text-neutral-400 truncate">
                      {item.product.compatibleBikes[0]}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-black text-red-500 font-['Outfit']">
                      ₱{(item.product.price * item.quantity).toLocaleString()}
                    </span>

                    {/* Stepper */}
                    <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-md">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, -1)}
                        className="px-2 py-0.5 text-neutral-400 hover:text-white text-xs"
                      >
                        -
                      </button>
                      <span className="px-2 py-0.5 text-[11px] font-bold text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, 1)}
                        className="px-2 py-0.5 text-neutral-400 hover:text-white text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout Summary */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-neutral-850 bg-neutral-900/60 space-y-3">
            
            {/* Voucher Form */}
            <form onSubmit={applyVoucher} className="space-y-1">
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  placeholder="Promo Code (e.g. MOTO100)"
                  className="flex-1 bg-neutral-950 border border-neutral-800 text-xs rounded-lg px-3 py-1.5 text-white uppercase placeholder:normal-case focus:outline-none focus:border-red-500"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-lg"
                >
                  Apply
                </button>
              </div>
              {voucherSuccess && (
                <p className="text-[10px] text-emerald-400">{voucherSuccess}</p>
              )}
              {voucherError && (
                <p className="text-[10px] text-red-400">{voucherError}</p>
              )}
            </form>

            {/* Calculations */}
            <div className="space-y-1.5 text-xs text-neutral-300 pt-1 border-t border-neutral-800">
              <div className="flex justify-between">
                <span>Subtotal ({items.length} items)</span>
                <span>₱{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Standard Moto Shipping (J&T)</span>
                <span>₱{shippingFee.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Voucher Discount</span>
                  <span>-₱{discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-black text-white pt-1.5 border-t border-neutral-800 font-['Outfit']">
                <span>Total Amount</span>
                <span className="text-red-500 text-base">₱{total.toLocaleString()}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 active:scale-95 transition-all"
            >
              <span>Proceed to PayMongo Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-neutral-500 text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Secured by PayMongo • GCash, Maya & Cards Protected</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
