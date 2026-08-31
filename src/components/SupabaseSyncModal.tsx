import React, { useState } from 'react';
import { 
  Database, 
  Copy, 
  Check, 
  X, 
  Sparkles, 
  RefreshCw, 
  CheckCircle2, 
  Terminal, 
  ExternalLink,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { SUPABASE_SCHEMA_SQL, supabase } from '../lib/supabase';

interface SupabaseSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshData: () => Promise<void>;
}

export const SupabaseSyncModal: React.FC<SupabaseSyncModalProps> = ({
  isOpen,
  onClose,
  onRefreshData,
}) => {
  const [copied, setCopied] = useState(false);
  const [testing, setTesting] = useState(false);
  const [status, setStatus] = useState<{
    tested: boolean;
    productsCount?: number;
    profilesCount?: number;
    error?: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setStatus(null);
    try {
      // Test products table
      const { data: prodData, error: prodErr } = await supabase
        .from('products')
        .select('id');

      // Test profiles table
      const { data: profData, error: profErr } = await supabase
        .from('profiles')
        .select('id');

      if (prodErr || profErr) {
        setStatus({
          tested: true,
          error: (prodErr || profErr)?.message || 'Database error: tables need to be created with the SQL script below.'
        });
      } else {
        setStatus({
          tested: true,
          productsCount: prodData?.length || 0,
          profilesCount: profData?.length || 0,
        });
      }
      await onRefreshData();
    } catch (err: any) {
      setStatus({
        tested: true,
        error: err.message || 'Connection test failed'
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in">
      <div className="bg-neutral-950 border border-neutral-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col my-auto relative font-['Plus_Jakarta_Sans']">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/70 sticky top-0 z-10 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold border border-emerald-500/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-['Outfit'] uppercase tracking-wide flex items-center gap-2">
                Supabase Cross-Device Cloud Sync
              </h2>
              <p className="text-xs text-neutral-400">
                Fix cross-device products, multi-device logins, and verified rider reviews
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          
          {/* Quick Status / Test */}
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Connected Database Endpoint:
              </div>
              <p className="text-xs font-mono text-emerald-400/90 break-all">
                cegizjoxnidynhdcglmj.supabase.co
              </p>
            </div>

            <button
              onClick={handleTestConnection}
              disabled={testing}
              className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-white flex items-center gap-2 transition-all shrink-0 border border-neutral-700 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
              {testing ? 'Testing Tables...' : 'Test Connection & Reload'}
            </button>
          </div>

          {/* Test Status Banner */}
          {status && (
            <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
              status.error 
                ? 'bg-amber-950/30 border-amber-800 text-amber-300' 
                : 'bg-emerald-950/30 border-emerald-800 text-emerald-300'
            }`}>
              {status.error ? (
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold block">Tables need to be updated in Supabase:</strong>
                    <span>{status.error}</span>
                    <p className="mt-1 text-neutral-400">
                      Copy the clean SQL script below and execute it in your Supabase SQL Editor to enable cross-device sync and disable blocking RLS policies.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <strong>Supabase Tables Active!</strong> Found {status.productsCount} live products and {status.profilesCount} profiles in cloud database.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Instructions Step-by-Step */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Terminal className="w-4 h-4 text-red-500" />
              How to Run the New SQL Query in Supabase (3 Simple Steps)
            </h3>
            
            <ol className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-neutral-300">
              <li className="bg-neutral-900 border border-neutral-800 p-3.5 rounded-xl space-y-1.5">
                <span className="w-5 h-5 rounded-full bg-red-600/20 text-red-400 font-bold flex items-center justify-center text-[10px]">1</span>
                <p className="font-bold text-white">Open Supabase Dashboard</p>
                <p className="text-neutral-400 text-[11px]">
                  Go to <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="text-red-400 underline inline-flex items-center gap-0.5">supabase.com/dashboard <ExternalLink className="w-2.5 h-2.5" /></a> and select your project.
                </p>
              </li>
              <li className="bg-neutral-900 border border-neutral-800 p-3.5 rounded-xl space-y-1.5">
                <span className="w-5 h-5 rounded-full bg-red-600/20 text-red-400 font-bold flex items-center justify-center text-[10px]">2</span>
                <p className="font-bold text-white">Click "SQL Editor"</p>
                <p className="text-neutral-400 text-[11px]">
                  In the left sidebar, click the <strong>SQL Editor</strong> (terminal icon) & create a <strong>New Query</strong>.
                </p>
              </li>
              <li className="bg-neutral-900 border border-neutral-800 p-3.5 rounded-xl space-y-1.5">
                <span className="w-5 h-5 rounded-full bg-red-600/20 text-red-400 font-bold flex items-center justify-center text-[10px]">3</span>
                <p className="font-bold text-white">Paste & Click "Run"</p>
                <p className="text-neutral-400 text-[11px]">
                  Paste the SQL code below and click the green <strong>Run</strong> button. It drops any broken old schema, creates clean tables, and disables blocking RLS!
                </p>
              </li>
            </ol>
          </div>

          {/* SQL Code Box with 1-Click Copy */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                New Production SQL Script:
              </span>
              <button
                onClick={handleCopySql}
                className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-red-600/20"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied to Clipboard!' : 'Copy SQL Script'}
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-[11px] font-mono text-neutral-300 max-h-72 overflow-y-auto leading-relaxed select-all">
              {SUPABASE_SCHEMA_SQL}
            </pre>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-900/50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-white transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
