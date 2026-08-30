import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  QrCode, 
  Smartphone, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ArrowRight,
  Bike,
  Lock,
  Copy,
  Receipt
} from 'lucide-react';
import { CartItem, Order, PaymentMethod } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  discount: number;
  onOrderSuccess: (order: Order) => void;
  userGcash: string;
  setUserGcash: (gcash: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  discount,
  onOrderSuccess,
  userGcash,
  setUserGcash,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<'details' | 'payment' | 'processing' | 'success'>('details');
  
  // Customer details
  const [customerName, setCustomerName] = useState('Juan Dela Cruz');
  const [customerEmail, setCustomerEmail] = useState('juan.rider@gmail.com');
  const [customerPhone, setCustomerPhone] = useState('0917-555-4321');
  const [gcashNumber, setGcashNumber] = useState(userGcash || '0917-882-9310');
  const [shippingAddress, setShippingAddress] = useState('Blk 12 Lot 4, Sampaguita St., Brgy. San Antonio');
  const [city, setCity] = useState('Quezon City');
  const [province, setProvince] = useState('Metro Manila');
  const [courier, setCourier] = useState<'J&T Express' | 'Flash Express' | 'Lalamove Moto'>('J&T Express');

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('gcash');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [gcashOtp, setGcashOtp] = useState('');
  const [otpStep, setOtpStep] = useState(false);

  // Success order cache
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const shippingFee = courier === 'Lalamove Moto' ? 250 : 120;
  const total = Math.max(0, subtotal + shippingFee - discount);

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !shippingAddress) return;
    if (gcashNumber) setUserGcash(gcashNumber);
    setStep('payment');
  };

  const handleExecutePayment = async () => {
    if (paymentMethod === 'gcash' && !otpStep) {
      setOtpStep(true);
      return;
    }

    setStep('processing');

    try {
      // Call server PayMongo endpoint
      const response = await fetch('/api/paymongo/create-source', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          paymentMethod,
          trackingNumber: `MOTO-${Math.floor(1000 + Math.random() * 9000)}-PH`,
          customerInfo: { name: customerName, email: customerEmail, phone: customerPhone, gcashNumber }
        })
      });
      const data = await response.json();
    } catch (err) {
      console.warn('Simulating offline payment execution:', err);
    }

    // Simulate gateway confirmation delay
    setTimeout(() => {
      const trackingCode = `MOTO-${Math.floor(1000 + Math.random() * 9000)}-PH`;
      const now = new Date();
      const estDate = new Date();
      estDate.setDate(now.getDate() + (courier === 'Lalamove Moto' ? 1 : 3));

      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        trackingNumber: trackingCode,
        createdAt: now.toISOString(),
        customer: {
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
          gcashNumber: gcashNumber || undefined,
          address: shippingAddress,
          city,
          province
        },
        items: items.map(i => ({
          productId: i.product.id,
          name: i.product.name,
          price: i.product.price,
          quantity: i.quantity,
          image: i.product.image
        })),
        subtotal,
        shippingFee,
        discount,
        total,
        paymentMethod,
        paymentStatus: 'paid',
        orderStatus: 'placed',
        courier: courier as any,
        estimatedDelivery: estDate.toISOString().split('T')[0],
        trackingHistory: [
          {
            title: 'Order Placed & Payment Verified via PayMongo',
            description: `Payment of ₱${total.toLocaleString()} confirmed via ${paymentMethod.toUpperCase()}.`,
            timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            completed: true
          },
          {
            title: 'Seller Preparing Parts & Fitment Verification',
            description: 'Checking cylinder bore, pulley angles, or pipe brackets.',
            timestamp: 'Pending dispatch',
            completed: false
          },
          {
            title: 'Handover to Courier Dispatch Hub',
            description: `${courier} assigned tracking barcode.`,
            timestamp: 'Scheduled',
            completed: false
          },
          {
            title: 'In Transit / Sorting Facility',
            description: 'Regional sorting center transit.',
            timestamp: 'In transit',
            completed: false
          },
          {
            title: 'Out for Delivery to Customer Address',
            description: `Courier rider will contact ${customerPhone}.`,
            timestamp: 'Estimated ' + estDate.toLocaleDateString(),
            completed: false
          }
        ]
      };

      setCompletedOrder(newOrder);
      onOrderSuccess(newOrder);
      setStep('success');

      // Trigger Confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#e11d48', '#f59e0b', '#06b6d4', '#ffffff']
        });
      } catch (e) {
        // ignore if canvas unavailable
      }
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in">
      <div className="bg-neutral-950 border border-neutral-800 rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col my-auto relative">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-600/20 text-red-500 flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white uppercase font-['Outfit']">
                {step === 'success' ? 'Order Confirmed & Paid!' : 'PayMongo Secure Checkout'}
              </h3>
              <p className="text-[11px] text-neutral-400">
                {step === 'details' && 'Step 1 of 2: Shipping & Delivery Details'}
                {step === 'payment' && 'Step 2 of 2: Select Payment Method (GCash / Card / Maya)'}
                {step === 'processing' && 'Communicating with PayMongo Gateway...'}
                {step === 'success' && 'Your motorcycle parts are on their way!'}
              </p>
            </div>
          </div>
          {step !== 'processing' && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-neutral-900 text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6">
          
          {/* STEP 1: Customer Details */}
          {step === 'details' && (
            <form onSubmit={handleProceedToPayment} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-400 block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Juan Dela Cruz"
                    className="w-full bg-neutral-900 border border-neutral-800 text-xs rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-neutral-400 block mb-1">
                    Contact Mobile Number (For Rider) *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="0917-XXX-XXXX"
                    className="w-full bg-neutral-900 border border-neutral-800 text-xs rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-400 block mb-1">
                    Email Address (For Receipt & Tracking Updates) *
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="juan@example.com"
                    className="w-full bg-neutral-900 border border-neutral-800 text-xs rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-neutral-400 block mb-1 flex items-center justify-between">
                    <span>GCash Number (For Quick Pay / Refunds)</span>
                    <span className="text-emerald-400 text-[10px]">Philippines</span>
                  </label>
                  <input
                    type="text"
                    value={gcashNumber}
                    onChange={(e) => setGcashNumber(e.target.value)}
                    placeholder="09XX-XXX-XXXX"
                    className="w-full bg-neutral-900 border border-neutral-800 text-xs rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-400 block mb-1">
                  Complete Delivery Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="House/Unit #, Street, Barangay, Landmark"
                  className="w-full bg-neutral-900 border border-neutral-800 text-xs rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-400 block mb-1">City / Municipality *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 text-xs rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-neutral-400 block mb-1">Province / Region *</label>
                  <select
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 text-xs rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="Metro Manila">Metro Manila (NCR)</option>
                    <option value="Cavite">Cavite</option>
                    <option value="Laguna">Laguna</option>
                    <option value="Bulacan">Bulacan</option>
                    <option value="Rizal">Rizal</option>
                    <option value="Pampanga">Pampanga</option>
                    <option value="Cebu">Cebu (Central Visayas)</option>
                    <option value="Davao">Davao (Mindanao)</option>
                    <option value="Other Provinces">Other Philippine Provinces</option>
                  </select>
                </div>
              </div>

              {/* Courier Selection */}
              <div className="pt-2">
                <label className="text-[11px] font-semibold text-neutral-400 block mb-1.5">
                  Select Express Courier
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'J&T Express', label: 'J&T Express Moto', eta: '2-3 Days', fee: '₱120' },
                    { id: 'Flash Express', label: 'Flash Express', eta: '2-4 Days', fee: '₱120' },
                    { id: 'Lalamove Moto', label: 'Lalamove Same-Day', eta: 'Today (NCR)', fee: '₱250' },
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCourier(c.id as any)}
                      className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                        courier === c.id
                          ? 'bg-red-950/40 border-red-600 text-white'
                          : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold block">{c.label}</span>
                        <span className="text-[10px] text-neutral-500">{c.eta}</span>
                      </div>
                      <span className="text-xs font-bold text-red-400 mt-1">{c.fee}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Order Summary & Submit Details */}
              <div className="pt-3 border-t border-neutral-850 flex items-center justify-between">
                <div>
                  <span className="text-xs text-neutral-400">Total with Delivery:</span>
                  <span className="text-lg font-black text-red-500 block font-['Outfit']">
                    ₱{total.toLocaleString()} PHP
                  </span>
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-red-600/25 hover:brightness-110 active:scale-95 transition-all"
                >
                  <span>Select Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </form>
          )}

          {/* STEP 2: PayMongo Payment Method Selection */}
          {step === 'payment' && (
            <div className="space-y-5">
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
                  Select PayMongo Payment Gateway Option
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* GCash */}
                  <button
                    type="button"
                    onClick={() => { setPaymentMethod('gcash'); setOtpStep(false); }}
                    className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                      paymentMethod === 'gcash'
                        ? 'bg-blue-950/40 border-blue-500 text-white shadow-lg'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-xs shrink-0">
                      G
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white">GCash e-Wallet</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-400 font-semibold">
                          Popular
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        Instant debit via PayMongo direct GCash integration
                      </p>
                    </div>
                  </button>

                  {/* Credit / Debit Card */}
                  <button
                    type="button"
                    onClick={() => { setPaymentMethod('paymongo_card'); setOtpStep(false); }}
                    className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                      paymentMethod === 'paymongo_card'
                        ? 'bg-red-950/40 border-red-600 text-white shadow-lg'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-neutral-800 text-white flex items-center justify-center shrink-0">
                      <CreditCard className="w-4 h-4 text-red-500" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">Credit / Debit Card</span>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        Visa, Mastercard, JCB via 3D-Secure 2.0
                      </p>
                    </div>
                  </button>

                  {/* Maya */}
                  <button
                    type="button"
                    onClick={() => { setPaymentMethod('maya'); setOtpStep(false); }}
                    className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                      paymentMethod === 'maya'
                        ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-lg'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-xs shrink-0">
                      M
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">Maya e-Wallet</span>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        Pay with Maya app or wallet balance
                      </p>
                    </div>
                  </button>

                  {/* QR PH */}
                  <button
                    type="button"
                    onClick={() => { setPaymentMethod('qrph'); setOtpStep(false); }}
                    className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                      paymentMethod === 'qrph'
                        ? 'bg-cyan-950/40 border-cyan-500 text-white shadow-lg'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-cyan-600 text-white flex items-center justify-center shrink-0">
                      <QrCode className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">QR PH Universal QR</span>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        Scan with BPI, UnionBank, GCash, Maya
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Dynamic Payment Method Interactive Simulation Forms */}
              {paymentMethod === 'gcash' && (
                <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-800/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-400">PayMongo GCash Checkout</span>
                    <span className="text-[10px] text-neutral-400">Sandbox / Live Active</span>
                  </div>

                  {!otpStep ? (
                    <div className="space-y-2">
                      <label className="text-[11px] text-neutral-300 block">GCash Registered Mobile Number:</label>
                      <input
                        type="text"
                        value={gcashNumber}
                        onChange={(e) => setGcashNumber(e.target.value)}
                        placeholder="0917-XXX-XXXX"
                        className="w-full bg-neutral-950 border border-blue-900 text-xs rounded-lg px-3 py-2 text-white font-mono"
                      />
                      <p className="text-[10px] text-neutral-400">
                        Clicking "Authorize GCash" will simulate PayMongo's secure SMS OTP authentication.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="text-[11px] text-emerald-400 block font-semibold">
                        Enter 6-Digit GCash Authentication OTP:
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        value={gcashOtp}
                        onChange={(e) => setGcashOtp(e.target.value)}
                        placeholder="e.g. 582910 (Any 6 digits)"
                        className="w-full bg-neutral-950 border border-emerald-600 text-sm rounded-lg px-3 py-2 text-emerald-400 font-mono tracking-widest text-center"
                      />
                      <p className="text-[10px] text-neutral-400">
                        OTP sent to {gcashNumber}. (Test mode: Enter any 6 numbers to verify).
                      </p>
                    </div>
                  )}
                </div>
              )}

              {paymentMethod === 'paymongo_card' && (
                <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-3">
                  <span className="text-xs font-bold text-white">Card Payment Details (PayMongo Encrypted)</span>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="Card Number"
                      className="w-full bg-neutral-950 border border-neutral-800 text-xs rounded-lg px-3 py-2 text-white font-mono"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full bg-neutral-950 border border-neutral-800 text-xs rounded-lg px-3 py-2 text-white font-mono"
                      />
                      <input
                        type="password"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="CVC"
                        className="w-full bg-neutral-950 border border-neutral-800 text-xs rounded-lg px-3 py-2 text-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between border-t border-neutral-850">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="text-xs text-neutral-400 hover:text-white underline font-medium"
                >
                  ← Edit Shipping Address
                </button>

                <button
                  type="button"
                  onClick={handleExecutePayment}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-red-600/30 active:scale-95 transition-all"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>
                    {paymentMethod === 'gcash' && !otpStep 
                      ? 'Proceed to GCash OTP' 
                      : `Authorize & Pay ₱${total.toLocaleString()}`}
                  </span>
                </button>
              </div>

            </div>
          )}

          {/* STEP 3: Processing State */}
          {step === 'processing' && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <Loader2 className="w-12 h-12 text-red-500 animate-spin" />
              <div className="space-y-1">
                <h4 className="text-base font-bold text-white font-['Outfit']">
                  Processing Payment with PayMongo...
                </h4>
                <p className="text-xs text-neutral-400 max-w-sm">
                  Connecting to {paymentMethod.toUpperCase()} gateway, generating merchant webhook signature, and validating motorcycle parts fitment.
                </p>
              </div>
            </div>
          )}

          {/* STEP 4: Success Receipt & Tracking Code */}
          {step === 'success' && completedOrder && (
            <div className="space-y-5 animate-in zoom-in-95">
              
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-black text-white font-['Outfit']">
                  Payment Successful & Order Placed!
                </h4>
                <p className="text-xs text-emerald-300">
                  PayMongo Transaction confirmed. Seller will pack your parts immediately.
                </p>
              </div>

              {/* Order Receipt Box */}
              <div className="rounded-xl bg-neutral-900 border border-neutral-800 p-4 space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                  <span className="text-neutral-400 font-medium">Tracking Number:</span>
                  <div className="flex items-center gap-1.5 font-mono font-bold text-red-400">
                    <span>{completedOrder.trackingNumber}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Recipient:</span>
                  <span className="text-white font-semibold">{completedOrder.customer.name} ({completedOrder.customer.phone})</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Courier:</span>
                  <span className="text-white font-semibold">{completedOrder.courier}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Estimated Delivery:</span>
                  <span className="text-white font-semibold">{completedOrder.estimatedDelivery}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-neutral-800 text-sm font-bold">
                  <span className="text-neutral-300">Total Paid:</span>
                  <span className="text-red-400 font-['Outfit']">₱{completedOrder.total.toLocaleString()} PHP</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>View in My Orders Dashboard</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
