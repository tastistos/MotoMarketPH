import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Bike, 
  ShieldCheck, 
  Store, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import { supabase, upsertUserProfile } from '../lib/supabase';
import { POPULAR_BIKES } from '../data/mockProducts';
import { UserProfile, AuthMode } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (profile: UserProfile) => void;
  initialMode?: AuthMode;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  initialMode = 'login'
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [gcashNumber, setGcashNumber] = useState('');
  const [primaryBike, setPrimaryBike] = useState('Honda Click 125i (V1 / V2 / V3)');
  const [isSeller, setIsSeller] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          // If Supabase credentials or user not found, give clear message
          if (error.message.includes('Invalid login credentials')) {
            throw new Error('Invalid email or password. Please verify your credentials or register a new account.');
          }
          throw error;
        }

        const user = data.user;
        if (!user) throw new Error('No user returned from login');

        // Fetch or create profile
        const profile: UserProfile = {
          id: user.id,
          email: user.email,
          fullName: user.user_metadata?.full_name || email.split('@')[0],
          phone: user.user_metadata?.phone || '',
          gcashNumber: user.user_metadata?.gcash_number || '',
          primaryBike: user.user_metadata?.primary_bike || 'Honda Click 125i (V1 / V2 / V3)',
          isSeller: Boolean(user.user_metadata?.is_seller),
          createdAt: user.created_at,
        };

        // Try syncing to profiles table
        await upsertUserProfile(profile);

        setSuccessMsg('Welcome back, rider! Logging you in...');
        setTimeout(() => {
          onAuthSuccess(profile);
          onClose();
        }, 1000);

      } else if (mode === 'register') {
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters long.');
        }

        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: fullName.trim() || email.split('@')[0],
              phone: phone.trim(),
              gcash_number: gcashNumber.trim() || phone.trim(),
              primary_bike: primaryBike,
              is_seller: isSeller,
            }
          }
        });

        if (error) throw error;

        const user = data.user;
        const profile: UserProfile = {
          id: user?.id || `user-${Date.now()}`,
          email: email.trim(),
          fullName: fullName.trim() || 'Rider Member',
          phone: phone.trim(),
          gcashNumber: gcashNumber.trim() || phone.trim(),
          primaryBike,
          isSeller,
          createdAt: new Date().toISOString(),
        };

        if (user) {
          await upsertUserProfile(profile);
        }

        setSuccessMsg(
          data.session 
            ? 'Account registered successfully! Welcome to MotoStreet PH.' 
            : 'Registration submitted! If confirmation is enabled, please check your email.'
        );

        setTimeout(() => {
          onAuthSuccess(profile);
          onClose();
        }, 1200);

      } else if (mode === 'forgot_password') {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/?mode=reset_password`,
        });

        if (error) throw error;

        setSuccessMsg('Password reset instructions sent to your email.');
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setErrorMsg(err.message || 'Authentication failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in">
      <div className="bg-neutral-950 border border-neutral-800 rounded-2xl w-full max-w-md max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col my-auto relative">
        
        {/* Header */}
        <div className="p-5 border-b border-neutral-850 flex items-center justify-between bg-neutral-900/60 sticky top-0 z-10 backdrop-blur-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center font-bold">
              <Bike className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-white uppercase tracking-tight font-['Outfit']">
                {mode === 'login' && 'Rider Login'}
                {mode === 'register' && 'Create Rider Account'}
                {mode === 'forgot_password' && 'Reset Password'}
              </h2>
              <p className="text-[11px] text-neutral-400">
                {mode === 'login' && 'Access your orders, garage, and seller dashboard'}
                {mode === 'register' && 'Join the premier Philippine motorcycle tuning marketplace'}
                {mode === 'forgot_password' && 'Enter your email to receive recovery instructions'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch for Login / Register */}
        {mode !== 'forgot_password' && (
          <div className="grid grid-cols-2 p-1.5 bg-neutral-900/50 border-b border-neutral-850 text-xs font-bold">
            <button
              onClick={() => { setMode('login'); setErrorMsg(null); setSuccessMsg(null); }}
              className={`py-2 rounded-lg transition-all ${
                mode === 'login' 
                  ? 'bg-neutral-800 text-white shadow-sm' 
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('register'); setErrorMsg(null); setSuccessMsg(null); }}
              className={`py-2 rounded-lg transition-all ${
                mode === 'register' 
                  ? 'bg-red-600 text-white shadow-sm' 
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Register Account
            </button>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Notifications */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-start gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Registration Fields */}
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Full Name / Rider Nickname
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. John 'Speed' Santos"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0917-xxx-xxxx"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                    GCash Number
                  </label>
                  <input
                    type="tel"
                    value={gcashNumber}
                    onChange={(e) => setGcashNumber(e.target.value)}
                    placeholder="0917-xxx-xxxx"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Primary Motorcycle Model
                </label>
                <div className="relative">
                  <Bike className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <select
                    value={primaryBike}
                    onChange={(e) => setPrimaryBike(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 transition-colors"
                  >
                    {POPULAR_BIKES.map((bike) => (
                      <option key={bike.id} value={bike.name} className="bg-neutral-900 text-white">
                        {bike.name} ({bike.displacement})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Seller Registration Checkbox */}
              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 cursor-pointer hover:border-neutral-700 transition-colors">
                <input
                  type="checkbox"
                  checked={isSeller}
                  onChange={(e) => setIsSeller(e.target.checked)}
                  className="rounded bg-neutral-950 border-neutral-700 text-red-600 focus:ring-red-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                    <Store className="w-3.5 h-3.5 text-red-400" />
                    <span>Register as Moto Parts Seller</span>
                  </div>
                  <p className="text-[10px] text-neutral-400">Post parts, receive PayMongo GCash escrow payouts, and manage inventory.</p>
                </div>
              </label>
            </>
          )}

          {/* Email Field */}
          <div>
            <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rider@gmail.com"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>
          </div>

          {/* Password Field */}
          {mode !== 'forgot_password' && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider">
                  Password
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => { setMode('forgot_password'); setErrorMsg(null); setSuccessMsg(null); }}
                    className="text-[11px] text-red-400 hover:text-red-300 hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition-all disabled:opacity-50 mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>
                  {mode === 'login' && 'Sign In to Marketplace'}
                  {mode === 'register' && 'Complete Registration'}
                  {mode === 'forgot_password' && 'Send Reset Link'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Footer switch for Forgot Password mode */}
          {mode === 'forgot_password' && (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMsg(null); }}
                className="text-xs text-neutral-400 hover:text-white underline"
              >
                Back to Sign In
              </button>
            </div>
          )}

        </form>

        {/* Security Trust Footer */}
        <div className="px-6 py-3 bg-neutral-900/40 border-t border-neutral-850 flex items-center justify-between text-[11px] text-neutral-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Supabase PostgreSQL Encrypted Auth</span>
          </div>
          <span className="text-neutral-400 font-mono">PH Metro</span>
        </div>

      </div>
    </div>
  );
};
