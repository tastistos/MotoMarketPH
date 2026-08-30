import React, { useState } from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  Send, 
  CheckCircle2, 
  Bike, 
  Store, 
  Award, 
  Sparkles,
  Smartphone,
  Cpu,
  Clock
} from 'lucide-react';

export const AboutContactPage: React.FC<{ onNavigateToStore: () => void }> = ({ onNavigateToStore }) => {
  const [activeSubTab, setActiveSubTab] = useState<'about' | 'contact'>('about');
  
  // Contact Form State
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [senderBike, setSenderBike] = useState('Honda Click 125i');
  const [inquiryType, setInquiryType] = useState('fitment');
  const [message, setMessage] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName || !senderEmail || !message) return;
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      setMessage('');
    }, 3000);
  };

  return (
    <div className="bg-neutral-950 min-h-screen py-10 px-4 sm:px-6 lg:px-8 border-b border-neutral-850">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Navigation Sub-Tabs */}
        <div className="flex justify-center">
          <div className="bg-neutral-900 p-1.5 rounded-xl border border-neutral-800 flex gap-2">
            <button
              onClick={() => setActiveSubTab('about')}
              className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                activeSubTab === 'about'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              About MotoStreet PH
            </button>
            <button
              onClick={() => setActiveSubTab('contact')}
              className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                activeSubTab === 'contact'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Contact Garage & Support
            </button>
          </div>
        </div>

        {/* ABOUT SECTION */}
        {activeSubTab === 'about' && (
          <div className="space-y-10 animate-in fade-in">
            
            {/* Story Hero */}
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/60 border border-red-800 text-red-400 text-xs font-bold uppercase">
                <Bike className="w-3.5 h-3.5" />
                <span>BORN ON THE PHILIPPINE HIGHWAYS & CIRCUITS</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white font-['Outfit'] uppercase leading-tight">
                Empowering Filipino Riders With Verified Bolt-On Performance
              </h1>
              <p className="text-sm sm:text-base text-neutral-300 font-['Plus_Jakarta_Sans'] leading-relaxed">
                MotoStreet PH was created by passionate tuners and mechanics who understand the heartbeat of Philippine motorcycle culture. From daily commuters navigating EDSA on a <strong>Honda Click 125i</strong> to provincial touring on an <strong>XRM 125</strong> or track days on a <strong>Raider 150</strong>, we ensure genuine fitment, honest prices, and instant GCash/PayMongo transactions.
              </p>
            </div>

            {/* Core Values / Rule of Thirds Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-6 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-red-950 text-red-400 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white font-['Outfit']">100% Fitment Guaranteed</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Every bore kit, pulley angle, and stainless elbow pipe is cataloged with exact millimeter tolerances for Philippine bike variants. No guessed compatibility.
                </p>
              </div>

              <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-6 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-blue-950 text-blue-400 flex items-center justify-center font-bold">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white font-['Outfit']">PayMongo & GCash Protected</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Secure escrow and lightning-fast GCash payouts for both individual riders selling custom parts and verified moto performance shops.
                </p>
              </div>

              <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-6 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-purple-950 text-purple-400 flex items-center justify-center font-bold">
                  <Cpu className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white font-['Outfit']">AI Mechanic Assistant</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Integrated Voiceflow and Gemini AI diagnostics to calculate flyball weights, carburetor jetting, and suspension preload for your exact weight and bike model.
                </p>
              </div>

            </div>

            {/* CTA Banner */}
            <div className="rounded-2xl bg-gradient-to-r from-red-600 to-rose-700 p-8 text-center text-white space-y-4 shadow-2xl">
              <h2 className="text-2xl sm:text-3xl font-black uppercase font-['Outfit']">
                Ready to Upgrade Your Ride's Hatak & Top Speed?
              </h2>
              <p className="text-xs sm:text-sm text-red-100 max-w-xl mx-auto">
                Explore hundreds of dyno-tested parts or list your unused motorcycle performance components for free.
              </p>
              <button
                onClick={onNavigateToStore}
                className="px-8 py-3.5 rounded-xl bg-neutral-950 hover:bg-neutral-900 text-white font-black text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all inline-block"
              >
                Launch Street Store Catalog →
              </button>
            </div>

          </div>
        )}

        {/* CONTACT SECTION */}
        {activeSubTab === 'contact' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in">
            
            {/* Left: Contact Info & Garage Details (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-6 space-y-5">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-white font-['Outfit'] uppercase">
                    Connect With MotoStreet Garage
                  </h2>
                  <p className="text-xs text-neutral-400 font-['Plus_Jakarta_Sans']">
                    Have fitment questions or need specialized dyno-tuning consultation? Reach out to our master mechanics.
                  </p>
                </div>

                <div className="space-y-4 pt-2 text-xs">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">Main Dyno & Distribution Hub:</strong>
                      <span className="text-neutral-400">10th Ave. cor. Rizal Ave. Extension, Grace Park, Caloocan City, Metro Manila, Philippines</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">Hotline & Rider Support:</strong>
                      <span className="text-neutral-400">+63 (02) 8921-MOTO / +63 917-882-9310</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">Support & Seller Inquiries:</strong>
                      <span className="text-neutral-400">support@motostreetph.com</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">Operating Hours:</strong>
                      <span className="text-neutral-400">Monday - Saturday: 8:00 AM – 7:00 PM (PHT)</span>
                    </div>
                  </div>
                </div>

                {/* GCash Merchant QR badge */}
                <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-800/50 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-blue-300">
                    <Smartphone className="w-4 h-4 text-blue-400" />
                    <span>PayMongo Direct GCash Merchant ID</span>
                  </div>
                  <span className="font-mono font-bold text-white">#MS-PH-9920</span>
                </div>
              </div>
            </div>

            {/* Right: Interactive Contact Form (7 cols) */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-6 sm:p-8 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <h3 className="text-base font-bold text-white uppercase font-['Outfit']">
                    Send Technical Inquiry or Seller Application
                  </h3>
                  <span className="text-[11px] text-red-400 font-semibold">
                    Avg Response: &lt;15 mins
                  </span>
                </div>

                {sentSuccess ? (
                  <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2 animate-in zoom-in-95">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>
                      Salamat! Your message has been sent to our tuning technicians. We will reach out via email/SMS shortly.
                    </span>
                  </div>
                ) : (
                  <form onSubmit={handleSendMessage} className="space-y-4">
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-neutral-400 block mb-1">Your Name *</label>
                        <input
                          type="text"
                          required
                          value={senderName}
                          onChange={(e) => setSenderName(e.target.value)}
                          placeholder="e.g. Rico Morales"
                          className="w-full bg-neutral-950 border border-neutral-800 text-xs rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-neutral-400 block mb-1">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={senderEmail}
                          onChange={(e) => setSenderEmail(e.target.value)}
                          placeholder="rico@gmail.com"
                          className="w-full bg-neutral-950 border border-neutral-800 text-xs rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-neutral-400 block mb-1">Your Motorcycle Model</label>
                        <input
                          type="text"
                          value={senderBike}
                          onChange={(e) => setSenderBike(e.target.value)}
                          placeholder="e.g. Honda XRM 125, Click 125"
                          className="w-full bg-neutral-950 border border-neutral-800 text-xs rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-neutral-400 block mb-1">Inquiry Topic</label>
                        <select
                          value={inquiryType}
                          onChange={(e) => setInquiryType(e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-800 text-xs rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                        >
                          <option value="fitment">Bike Fitment & Tuning Advice</option>
                          <option value="seller">Seller / Shop Registration</option>
                          <option value="paymongo">GCash / PayMongo Payment Issue</option>
                          <option value="order">Order Tracking & Delivery</option>
                          <option value="wholesale">Wholesale Garage Inquiries</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-neutral-400 block mb-1">Message or Specific Part Requirement *</label>
                      <textarea
                        required
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tell us what performance part you need or what issue you're experiencing on your ride..."
                        className="w-full bg-neutral-950 border border-neutral-800 text-xs rounded-lg p-3 text-white focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 active:scale-95 transition-all"
                    >
                      <Send className="w-4 h-4" />
                      <span>Send Message to Moto Technicians</span>
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
