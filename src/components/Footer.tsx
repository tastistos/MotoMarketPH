import React from 'react';
import { 
  Bike, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  Github, 
  Cpu, 
  Database, 
  CreditCard, 
  Smartphone,
  ChevronRight,
  Code,
  Layers,
  Sparkles
} from 'lucide-react';
import { NavTab } from '../types';

interface FooterProps {
  onNavigate: (tab: NavTab) => void;
  onOpenSiteMap: () => void;
  onOpenGuides: () => void;
  onOpenVoiceflow: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenSiteMap,
  onOpenGuides,
  onOpenVoiceflow,
}) => {
  return (
    <footer className="bg-neutral-950 text-neutral-400 border-t border-neutral-850 font-['Plus_Jakarta_Sans']">
      
      {/* Top Value Banner */}
      <div className="border-b border-neutral-850 py-8 px-4 sm:px-6 lg:px-8 bg-neutral-900/40">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-950 text-red-500 flex items-center justify-center font-bold shrink-0">
              <Bike className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase font-['Outfit']">100% Bolt-On Fitment</h4>
              <p className="text-[11px] text-neutral-400">Tested on XRM 125, Click 125, Raider 150</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-950 text-blue-400 flex items-center justify-center font-bold shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase font-['Outfit']">PayMongo & GCash</h4>
              <p className="text-[11px] text-neutral-400">Instant checkout & escrow seller payouts</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-950 text-purple-400 flex items-center justify-center font-bold shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase font-['Outfit']">AI Voiceflow & Gemini</h4>
              <p className="text-[11px] text-neutral-400">24/7 dyno diagnostics & CVT advice</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase font-['Outfit']">Verified Rider Reviews</h4>
              <p className="text-[11px] text-neutral-400">Honest 5-star ratings from real builders</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        
        {/* Brand & Description (2 cols on lg) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-rose-600 flex items-center justify-center text-white shadow-md shadow-red-600/30">
              <Bike className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white font-['Outfit']">
                MOTO<span className="text-red-500">STREET</span><span className="text-xs text-neutral-500 ml-1">PH</span>
              </span>
            </div>
          </div>

          <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
            The premier Philippine marketplace for high-performance underbone and scooter motorcycle parts. Buy, sell, rate, and tune with complete confidence.
          </p>

          <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
            <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">
              🇵🇭 Metro Manila
            </span>
            <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">
              ⚡ J&T / Flash / Lalamove
            </span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-white uppercase font-['Outfit'] tracking-wider">
            Explore Moto
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => onNavigate('home')} className="hover:text-red-400 transition-colors">
                Home Showcase
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('store')} className="hover:text-red-400 transition-colors">
                Store Parts Catalog
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('seller')} className="hover:text-red-400 transition-colors">
                Seller Dashboard (Post Parts)
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('dashboard')} className="hover:text-red-400 transition-colors">
                Rider Garage & Orders
              </button>
            </li>
            <li>
              <button onClick={onOpenSiteMap} className="text-red-400 font-semibold hover:underline">
                Full Site Map Directory →
              </button>
            </li>
          </ul>
        </div>

        {/* Popular Fitments */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-white uppercase font-['Outfit'] tracking-wider">
            Target Bike Models
          </h4>
          <ul className="space-y-2 text-xs text-neutral-400">
            <li>• Honda Click 125i / 150i / 160</li>
            <li>• Honda XRM 125 (Carb & Fi)</li>
            <li>• Suzuki Raider R150 (Carb & Fi)</li>
            <li>• Honda Wave 125 / Wave 110</li>
            <li>• Yamaha Aerox 155 / NMAX 155</li>
            <li>• Yamaha Mio i125 / Sporty / Soul</li>
          </ul>
        </div>

        {/* Stack & Chatbot Tech */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-white uppercase font-['Outfit'] tracking-wider">
            Integrated Tech Stack
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={onOpenGuides} className="hover:text-white flex items-center gap-1.5 text-neutral-300">
                <Code className="w-3.5 h-3.5 text-red-500" />
                <span>GitHub Repository</span>
              </button>
            </li>
            <li>
              <button onClick={onOpenGuides} className="hover:text-white flex items-center gap-1.5 text-neutral-300">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>Vercel Hosting</span>
              </button>
            </li>
            <li>
              <button onClick={onOpenGuides} className="hover:text-white flex items-center gap-1.5 text-neutral-300">
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                <span>Supabase PostgreSQL</span>
              </button>
            </li>
            <li>
              <button onClick={onOpenGuides} className="hover:text-white flex items-center gap-1.5 text-neutral-300">
                <CreditCard className="w-3.5 h-3.5 text-blue-400" />
                <span>PayMongo (GCash/Cards)</span>
              </button>
            </li>
            <li>
              <button onClick={onOpenVoiceflow} className="hover:text-white flex items-center gap-1.5 text-red-400 font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Voiceflow & Gemini AI</span>
              </button>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Legal & Developer Bar */}
      <div className="border-t border-neutral-850 py-5 px-4 sm:px-6 lg:px-8 text-center sm:text-left text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} MotoStreet PH. All rights reserved. Designed with Rule of Thirds, High Contrast & Hierarchical Typography.</p>
          <div className="flex items-center gap-4">
            <button onClick={onOpenSiteMap} className="hover:text-white underline">Site Map</button>
            <button onClick={() => onNavigate('about')} className="hover:text-white underline">About Us</button>
            <button onClick={() => onNavigate('contact')} className="hover:text-white underline">Contact Support</button>
          </div>
        </div>
      </div>

    </footer>
  );
};
