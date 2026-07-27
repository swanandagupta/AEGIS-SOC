import React, { useState } from 'react';
import { 
  Terminal, 
  Pause, 
  Play, 
  Search, 
  Trash2, 
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import type { LogEntry } from '../types';

interface LiveLogFeedPageProps {
  logs: LogEntry[];
  isPaused: boolean;
  setIsPaused: (paused: boolean) => void;
  onClearLogs: () => void;
}

export const LiveLogFeedPage: React.FC<LiveLogFeedPageProps> = ({
  logs,
  isPaused,
  setIsPaused,
  onClearLogs
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState('ALL');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = searchTerm === '' || 
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.src_ip.includes(searchTerm) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesService = selectedService === 'ALL' || log.service.toLowerCase() === selectedService.toLowerCase();
    return matchesSearch && matchesService;
  });

  return (
    <div className="space-y-6">
      {/* Feed Controls */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-cyan-500/10 rounded-xl border border-cyan-500/30 text-cyan-400">
            <Terminal className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100 uppercase tracking-wider font-mono">
              Live Ingestion Log Stream
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Real-time Log Normalization & Template Abstraction Feed
            </p>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Pause / Play Streaming */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`px-3.5 py-1.5 rounded-xl border text-xs font-mono font-semibold flex items-center gap-2 transition-all ${
              isPaused 
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-glow-cyan' 
                : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
            }`}
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            <span>{isPaused ? 'RESUME STREAM' : 'PAUSE STREAM'}</span>
          </button>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter log message, IP, user..."
              className="bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 font-mono focus:border-cyan-500 focus:outline-none w-56"
            />
          </div>

          {/* Service Filter */}
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
          >
            <option value="ALL">All Services</option>
            <option value="sshd">sshd</option>
            <option value="sudo">sudo</option>
            <option value="pam">pam</option>
            <option value="kernel">kernel</option>
          </select>

          {/* Clear Button */}
          <button
            onClick={onClearLogs}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors"
            title="Clear current stream buffer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stream Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden font-mono">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3 w-8"></th>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Event ID</th>
                <th className="p-3">Service</th>
                <th className="p-3">Source IP</th>
                <th className="p-3">User</th>
                <th className="p-3">Log Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No log events in current buffer.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const isExpanded = expandedLogId === log.id;
                  return (
                    <React.Fragment key={log.id}>
                      <tr 
                        onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                        className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                      >
                        <td className="p-3 text-slate-500">
                          {isExpanded ? <ChevronDown className="w-4 h-4 text-cyan-400" /> : <ChevronRight className="w-4 h-4" />}
                        </td>
                        <td className="p-3 text-slate-400">{log.timestamp.slice(11, 19)}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            log.event_id === 'E1' || log.event_id === 'E4' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' :
                            log.event_id === 'E3' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                            'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                          }`}>
                            {log.event_id}
                          </span>
                        </td>
                        <td className="p-3 text-slate-300 font-semibold">{log.service}</td>
                        <td className="p-3 text-cyan-400">{log.src_ip}</td>
                        <td className="p-3 text-slate-300">{log.user}</td>
                        <td className="p-3 text-slate-200 max-w-md truncate">{log.message}</td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-slate-950/90 border-b border-slate-800">
                          <td colSpan={7} className="p-4">
                            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-2">
                              <div className="flex items-center justify-between text-slate-400">
                                <span>Normalized Meaning: <strong className="text-slate-200">{log.meaning}</strong></span>
                                <span>Destination IP: <strong className="text-indigo-400">{log.dst_ip}</strong></span>
                              </div>
                              <div>
                                <span className="text-slate-400 block mb-1">Full Raw Payload:</span>
                                <pre className="p-2 rounded bg-slate-950 text-cyan-300 font-mono text-[11px] whitespace-pre-wrap overflow-x-auto border border-slate-800">
                                  {log.message}
                                </pre>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
