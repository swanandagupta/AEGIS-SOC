import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Search, 
  CheckCircle, 
  Eye, 
  XCircle, 
  Globe, 
  Server,
  X
} from 'lucide-react';
import type { SIEMAlarm } from '../types';

interface AlertCenterPageProps {
  alarms: SIEMAlarm[];
  selectedAlarm: SIEMAlarm | null;
  setSelectedAlarm: (alarm: SIEMAlarm | null) => void;
  onUpdateStatus: (alarmId: string, status: string) => Promise<void>;
}

export const AlertCenterPage: React.FC<AlertCenterPageProps> = ({
  alarms,
  selectedAlarm,
  setSelectedAlarm,
  onUpdateStatus
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [updating, setUpdating] = useState<boolean>(false);

  const filteredAlarms = alarms.filter(alarm => {
    const matchesStatus = statusFilter === 'ALL' || alarm.status.toUpperCase() === statusFilter.toUpperCase();
    const matchesSeverity = severityFilter === 'ALL' || alarm.severity.toUpperCase() === severityFilter.toUpperCase();
    const matchesSearch = searchTerm === '' || 
      alarm.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alarm.src_ip.includes(searchTerm) ||
      alarm.alarm_id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSeverity && matchesSearch;
  });

  const handleStatusUpdate = async (status: string) => {
    if (!selectedAlarm) return;
    setUpdating(true);
    try {
      await onUpdateStatus(selectedAlarm.alarm_id, status);
      setSelectedAlarm({ ...selectedAlarm, status: status as any });
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-100 uppercase tracking-wider font-mono flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            Security Alert Triage Center
          </h2>
          <p className="text-xs text-slate-400">
            Stateful OSSIM-style Directive Matches & Risk-Adjusted Alarms
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search IP, Title, ID..."
              className="bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 font-mono focus:border-cyan-500 focus:outline-none w-48"
            />
          </div>

          {/* Severity Dropdown */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="ACKNOWLEDGED">Acknowledged</option>
            <option value="RESOLVED">Resolved</option>
            <option value="DISMISSED">Dismissed</option>
          </select>
        </div>
      </div>

      {/* Alarms Grid / List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAlarms.length === 0 ? (
          <div className="col-span-full glass-panel p-12 rounded-2xl text-center font-mono text-xs text-slate-500">
            No alarms matching the selected filters.
          </div>
        ) : (
          filteredAlarms.map((alarm) => (
            <div
              key={alarm.alarm_id}
              onClick={() => setSelectedAlarm(alarm)}
              className="glass-panel rounded-2xl p-5 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all duration-200 hover:scale-[1.01] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    alarm.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' :
                    alarm.severity === 'HIGH' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                    'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                  }`}>
                    {alarm.severity} ({alarm.risk_score}/10)
                  </span>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                    alarm.status === 'OPEN' ? 'bg-rose-500/10 text-rose-400' :
                    alarm.status === 'ACKNOWLEDGED' ? 'bg-amber-500/10 text-amber-400' :
                    'bg-emerald-500/10 text-emerald-400'
                  }`}>
                    {alarm.status}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-100 mb-2 line-clamp-2">{alarm.title}</h3>
                
                <div className="space-y-1.5 font-mono text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Src IP: <strong className="text-slate-200">{alarm.src_ip}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Server className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Dst IP: <strong className="text-slate-200">{alarm.dst_ip}</strong></span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>{alarm.alarm_id}</span>
                <span className="text-cyan-400 flex items-center gap-1 font-semibold hover:underline">
                  Inspect Triage <Eye className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Alarm Detail & Triage Modal */}
      {selectedAlarm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel border-cyan-500/40 rounded-2xl p-6 w-full max-w-2xl shadow-glow-cyan relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedAlarm(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
                selectedAlarm.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' :
                'bg-amber-500/20 text-amber-400 border border-amber-500/40'
              }`}>
                {selectedAlarm.severity} SEVERITY
              </span>
              <span className="text-xs font-mono text-slate-400">ID: {selectedAlarm.alarm_id}</span>
            </div>

            <h2 className="text-lg font-bold text-slate-100 mb-4">{selectedAlarm.title}</h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 font-mono text-xs">
                <span className="text-slate-400 block mb-1">Calculated Risk Score</span>
                <span className="text-2xl font-bold text-rose-400">{selectedAlarm.risk_score} / 10.0</span>
              </div>
              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 font-mono text-xs">
                <span className="text-slate-400 block mb-1">Matched SIEM Directive</span>
                <span className="text-xs font-bold text-cyan-400">{selectedAlarm.matched_directive}</span>
              </div>
            </div>

            {/* Threat Intel Details */}
            <div className="glass-panel p-4 rounded-xl mb-6 border border-slate-800">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono mb-2 flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-400" />
                Threat Intelligence & Vulnerability Enrichment
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div>
                  <span className="text-slate-400">Indicator IP:</span>
                  <p className="text-slate-200 font-bold">{selectedAlarm.threat_intel?.indicator || selectedAlarm.src_ip}</p>
                </div>
                <div>
                  <span className="text-slate-400">Threat Reputation:</span>
                  <p className="text-rose-400 font-bold">{selectedAlarm.threat_intel?.reputation || 'SUSPICIOUS'}</p>
                </div>
                <div>
                  <span className="text-slate-400">Threat Category:</span>
                  <p className="text-slate-200">{selectedAlarm.threat_intel?.threat_category || 'Auth Exploit'}</p>
                </div>
                <div>
                  <span className="text-slate-400">Target IP:</span>
                  <p className="text-slate-200">{selectedAlarm.dst_ip}</p>
                </div>
              </div>
            </div>

            {/* Analyst Triage Actions */}
            <div className="border-t border-slate-800 pt-4">
              <h4 className="text-xs font-bold text-slate-300 font-mono mb-3 uppercase">Analyst Action Workflow</h4>
              <div className="flex flex-wrap gap-3">
                <button
                  disabled={updating}
                  onClick={() => handleStatusUpdate('ACKNOWLEDGED')}
                  className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-mono font-semibold flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" /> Acknowledge
                </button>
                <button
                  disabled={updating}
                  onClick={() => handleStatusUpdate('RESOLVED')}
                  className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-semibold flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" /> Resolve Incident
                </button>
                <button
                  disabled={updating}
                  onClick={() => handleStatusUpdate('DISMISSED')}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700 text-xs font-mono font-semibold flex items-center gap-2"
                >
                  <XCircle className="w-4 h-4" /> Dismiss False Positive
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
