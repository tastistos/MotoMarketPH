import React from 'react';
import { 
  X, 
  Map, 
  Home, 
  Store, 
  User, 
  Package, 
  HelpCircle, 
  Mail, 
  ShieldCheck, 
  Cpu, 
  Database, 
  CreditCard,
  ChevronRight,
  Code,
  Github
} from 'lucide-react';
import { NavTab } from '../types';

interface SiteMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: NavTab) => void;
  onOpenGuides: () => void;
  onOpenVoiceflow: () => void;
}

export const SiteMapModal: React.FC<SiteMapModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenGuides,
  onOpenVoiceflow,
}) => {
  if (!isOpen) return null;

  const sections = [
    {
      title: 'Main Navigation Pages',
      icon: <Home className="w-4 h-4 text-red-500" />,
      links: [
        { name: 'Home (Showcase, Rule of Thirds Hero, Ride Matcher)', tab: 'home' as NavTab },
        { name: 'Store Page (Full Parts Catalog, Filters, Specs)', tab: 'store' as NavTab },
        { name: 'Seller Dashboard (Post Products, GCash Payouts)', tab: 'seller' as NavTab },
        { name: 'User Dashboard (Rider Garage, Orders, GCash Settings)', tab: 'dashboard' as NavTab },
        { name: 'About Us (Our Story, Dyno Hub, Guaranteed Fitment)', tab: 'about' as NavTab },
        { name: 'Contact Garage (Direct Inquiries & Map)', tab: 'contact' as NavTab },
      ]
    },
    {
      title: 'Underbone & Scooter Categories',
      icon: <Store className="w-4 h-4 text-amber-500" />,
      links: [
        { name: 'CVT & Transmission (Pulleys, Drive Faces, Center Springs, Flyballs)', tab: 'store' as NavTab },
        { name: 'Engine & Bore Kits (59mm Ceramic, Keihin Carbs, Camshafts)', tab: 'store' as NavTab },
        { name: 'Exhaust & Stainless Pipes (Full System, Canisters, Silencers)', tab: 'store' as NavTab },
        { name: 'Shocks & Suspension (RCB Gas Shocks, Calipers, Wave Discs)', tab: 'store' as NavTab },
        { name: 'Electrical & Lighting (Mini Driving Lights, CDI, Digital Gauges)', tab: 'store' as NavTab },
        { name: 'Tires & Wheels (Maxxis Street, Takasago Alloy Rims)', tab: 'store' as NavTab },
      ]
    },
    {
      title: 'Customer Services & Tools',
      icon: <Package className="w-4 h-4 text-blue-500" />,
      links: [
        { name: 'Real-Time Order Tracking (J&T / Flash / Lalamove Status)', tab: 'dashboard' as NavTab },
        { name: 'PayMongo GCash Payment Portal & OTP Simulator', tab: 'store' as NavTab },
        { name: 'Star-Rating & Verified Rider Review Submission', tab: 'store' as NavTab },
        { name: 'AI Voiceflow & Gemini Diagnostics Assistant', action: onOpenVoiceflow },
        { name: 'Developer Stack Blueprint (Supabase, Vercel, PayMongo SQL)', action: onOpenGuides },
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-neutral-950 border border-neutral-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-950 text-red-500 flex items-center justify-center font-bold">
              <Map className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white uppercase font-['Outfit']">
                MotoStreet PH Complete Site Map
              </h2>
              <p className="text-[11px] text-neutral-400">
                Hierarchical directory structure & quick navigation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-neutral-900 text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sections.map((sec, idx) => (
            <div key={idx} className="space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-200 uppercase font-['Outfit'] pb-1 border-b border-neutral-850">
                {sec.icon}
                <span>{sec.title}</span>
              </div>
              <ul className="space-y-2">
                {sec.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <button
                      onClick={() => {
                        onClose();
                        if (link.action) {
                          link.action();
                        } else if (link.tab) {
                          onNavigate(link.tab);
                        }
                      }}
                      className="text-left text-xs text-neutral-400 hover:text-red-400 flex items-start gap-1 group transition-colors leading-relaxed"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-neutral-600 group-hover:text-red-400 shrink-0 mt-0.5" />
                      <span>{link.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer info in Site Map */}
        <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-850 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 gap-3">
          <span>MotoStreet PH • High-Performance Motorcycle Parts Marketplace</span>
          <button
            onClick={() => {
              onClose();
              onOpenGuides();
            }}
            className="text-red-400 font-bold hover:underline flex items-center gap-1"
          >
            <Code className="w-3.5 h-3.5" />
            <span>View Full GitHub, Vercel & Supabase SQL Schema</span>
          </button>
        </div>

      </div>
    </div>
  );
};
