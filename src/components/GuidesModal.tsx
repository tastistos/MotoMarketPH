import React, { useState } from 'react';
import { 
  X, 
  Code, 
  Github, 
  Layers, 
  Database, 
  CreditCard, 
  Sparkles, 
  Copy, 
  Check, 
  Terminal,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { TECH_GUIDES } from '../data/guidesData';

interface GuidesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuidesModal: React.FC<GuidesModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'github' | 'vercel' | 'supabase' | 'paymongo' | 'voiceflow' | 'gemini'>('github');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const guide = TECH_GUIDES[activeTab];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in">
      <div className="bg-neutral-950 border border-neutral-800 rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col my-auto relative">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-850 flex items-center justify-between bg-neutral-900/80 sticky top-0 z-20 backdrop-blur-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-950 text-red-400 flex items-center justify-center font-bold">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white uppercase font-['Outfit']">
                Production Stack Architecture & Deployment Blueprint
              </h2>
              <p className="text-[11px] text-neutral-400">
                GitHub, Vercel, Supabase SQL, PayMongo & Voiceflow verified code
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-neutral-850 bg-neutral-900/40 overflow-x-auto p-2 gap-1.5 scrollbar-none">
          {[
            { id: 'github', label: 'GitHub Repository', icon: <Github className="w-3.5 h-3.5" /> },
            { id: 'vercel', label: 'Vercel Deployment', icon: <Layers className="w-3.5 h-3.5" /> },
            { id: 'supabase', label: 'Supabase SQL Schema', icon: <Database className="w-3.5 h-3.5" /> },
            { id: 'paymongo', label: 'PayMongo & GCash', icon: <CreditCard className="w-3.5 h-3.5" /> },
            { id: 'voiceflow', label: 'Voiceflow Chatbot', icon: <Sparkles className="w-3.5 h-3.5" /> },
            { id: 'gemini', label: 'Gemini AI Backend', icon: <Code className="w-3.5 h-3.5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all shrink-0 ${
                activeTab === tab.id
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-850'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-5 sm:p-7 space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-black text-white font-['Outfit'] uppercase">
              {guide.title}
            </h3>
            <p className="text-xs text-neutral-400">
              {guide.description}
            </p>
          </div>

          {/* Code Snippet Box */}
          <div className="rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden space-y-0 relative">
            <div className="flex items-center justify-between px-4 py-2 bg-neutral-950 border-b border-neutral-800 text-xs">
              <span className="font-mono text-neutral-400 text-[11px]">{guide.language.toUpperCase()} Configuration</span>
              <button
                onClick={() => handleCopy(guide.snippet, activeTab)}
                className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                {copiedKey === activeTab ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 text-xs font-mono text-emerald-400 overflow-x-auto max-h-72 leading-relaxed whitespace-pre-wrap">
              {guide.snippet}
            </pre>
          </div>

          {/* Steps List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase font-['Outfit'] tracking-wider">
              Implementation & Deployment Steps:
            </h4>
            <div className="space-y-2">
              {guide.steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-lg bg-neutral-900/60 border border-neutral-850 text-xs">
                  <span className="w-5 h-5 rounded-full bg-red-950 text-red-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-neutral-300 leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
