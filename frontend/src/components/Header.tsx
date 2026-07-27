import React, { useState } from 'react';
import { 
  Bell, 
  Wifi, 
  WifiOff, 
  PlusCircle, 
  CheckCircle2, 
  X
} from 'lucide-react';

interface HeaderProps {
  wsConnected: boolean;
  onIngestLog: (log: string) => Promise<void>;
  activeThreatsCount: number;
}

export const Header: React.FC<HeaderProps> = ({ 
  wsConnected, 
  onIngestLog,
  activeThreatsCount 
}) => {
  const [showIngestModal, setShowIngestModal] = useState(false);
  const [rawLogInput, setRawLogInput] = useState('');
  const [ingestStatus, setIngestStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleIngest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawLogInput.trim()) return;
    setLoading(true);
    try {
      await onIngestLog(rawLogInput);
      setIngestStatus('Log ingested & evaluated through pipeline successfully!');
      setRawLogInput('');
      setTimeout(() => setIngestStatus(null), 3000);
    } catch (err) {
      setIngestStatus('Error ingesting log payload');
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="glass-panel border-b border-slate-800 sticky top-0 z-20 px-6 py-3.5 flex items-center justify-between">
      {/* Title & Live Status */}
      <div className="flex items-center space-x-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            Security Operations Center
            <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              v1.0-HYBRID
            </span>
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Unified LogBERT + PyOD + Dsiem Pipeline
          </p>
        </div>

        {/* WS Stream Indicator */}
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono transition-all ${
          wsConnected 
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
            : 'bg-rose-500/10 text-rose-400 border-rose-500/30 animate-pulse'
        }`}>
          {wsConnected ? <Wifi className="w-3.5 h-3.5 animate-pulse" /> : <WifiOff className="w-3.5 h-3.5" />}
          <span>{wsConnected ? 'LIVE WS CONNECTED' : 'WS RECONNECTING...'}</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-4">
        {/* Manual Ingest Log Button */}
        <button
          onClick={() => setShowIngestModal(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/40 text-xs font-medium font-mono transition-all shadow-glow-cyan"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Simulate Log Payload</span>
        </button>

        {/* Notifications Icon */}
        <div className="relative">
          <button className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors">
            <Bell className="w-4 h-4" />
            {activeThreatsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {activeThreatsCount}
              </span>
            )}
          </button>
        </div>

        {/* Analyst Profile */}
        <div className="flex items-center space-x-3 pl-3 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center text-xs font-bold text-white shadow-glow-cyan">
            SO
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-semibold text-slate-200">SOC Analyst L2</p>
            <p className="text-[10px] text-slate-400 font-mono">SecOps Active</p>
          </div>
        </div>
      </div>

      {/* Manual Log Ingestion Modal */}
      {showIngestModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel border-cyan-500/30 rounded-2xl p-6 w-full max-w-lg shadow-2xl relative">
            <button
              onClick={() => setShowIngestModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-slate-100 mb-2 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-cyan-400" />
              Simulate Live Log Ingestion Payload
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Enter a raw log payload to push through the parsing, sequence, statistical, domain rule, and correlation engines.
            </p>

            <form onSubmit={handleIngest} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Raw Log String
                </label>
                <textarea
                  rows={4}
                  value={rawLogInput}
                  onChange={(e) => setRawLogInput(e.target.value)}
                  placeholder="Jul 26 18:45:00 server-01 sshd[9999]: Failed password for invalid user hacker from 192.168.1.100 port 5555"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
                />
              </div>

              {ingestStatus && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  {ingestStatus}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowIngestModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !rawLogInput.trim()}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold font-mono shadow-glow-cyan disabled:opacity-50"
                >
                  {loading ? 'Evaluating...' : 'Push to Pipeline'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
