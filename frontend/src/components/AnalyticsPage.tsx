import React from 'react';
import { BarChart3, Globe } from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell 
} from 'recharts';
import type { AnalyticsData } from '../types';

interface AnalyticsPageProps {
  analytics: AnalyticsData | null;
}

const BAR_COLORS = ['#F43F5E', '#F59E0B', '#3B82F6', '#8B5CF6'];

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ analytics }) => {
  const attackVectors = analytics?.attack_vectors || [
    { vector: 'Brute Force Authentication', count: 84, percentage: 42 },
    { vector: 'Invalid User Enumeration', count: 52, percentage: 26 },
    { vector: 'Privilege Escalation (sudo)', count: 40, percentage: 20 },
    { vector: 'Cross-Domain Sequence Shift', count: 24, percentage: 12 }
  ];

  const topIPs = analytics?.top_threat_ips || [
    { ip: '192.168.1.100', country: 'US (Simulated)', attacks: 48, threat_level: 'CRITICAL' },
    { ip: '10.0.0.55', country: 'DE (Simulated)', attacks: 22, threat_level: 'HIGH' },
    { ip: '172.16.0.4', country: 'Internal Subnet', attacks: 14, threat_level: 'MEDIUM' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-100 uppercase tracking-wider font-mono flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            Threat Analytics & Intelligence Insights
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Attack Vector Frequency, Geo Intelligence & Multi-Source Distribution
          </p>
        </div>
      </div>

      {/* Grid for Attack Vector Chart & IP Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attack Vector Bar Chart */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono mb-1">
            Top Detected Attack Vectors
          </h3>
          <p className="text-xs text-slate-400 mb-4">Rule + Model Sequence Classification</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attackVectors} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                <XAxis type="number" stroke="#64748B" fontSize={11} />
                <YAxis dataKey="vector" type="category" stroke="#64748B" fontSize={10} width={130} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                  {attackVectors.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Threat IP Intelligence */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono mb-1 flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              Top Threat Origin IPs
            </h3>
            <p className="text-xs text-slate-400 mb-4">Enriched via Wise / AlienVault OTX Plugins</p>

            <div className="space-y-3 font-mono text-xs">
              {topIPs.map((threat, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-cyan-400 text-sm">{threat.ip}</span>
                    <p className="text-[11px] text-slate-400">{threat.country}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                      threat.threat_level === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' :
                      'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    }`}>
                      {threat.threat_level}
                    </span>
                    <p className="text-[11px] text-slate-300 mt-1">{threat.attacks} Triggered Events</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
