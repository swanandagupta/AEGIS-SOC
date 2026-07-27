import React from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { ShieldAlert, ArrowRight, Terminal } from 'lucide-react';
import type { KPIs, SIEMAlarm, LogEntry, AnalyticsData } from '../types';
import { KPICards } from './KPICards';

interface OverviewPageProps {
  kpis: KPIs | null;
  alarms: SIEMAlarm[];
  logs: LogEntry[];
  analytics: AnalyticsData | null;
  onSelectTab: (tab: string) => void;
  onSelectAlarm: (alarm: SIEMAlarm) => void;
}

const SEVERITY_COLORS = {
  CRITICAL: '#F43F5E',
  HIGH: '#F59E0B',
  MEDIUM: '#3B82F6',
  LOW: '#10B981'
};

export const OverviewPage: React.FC<OverviewPageProps> = ({
  kpis,
  alarms,
  logs,
  analytics,
  onSelectTab,
  onSelectAlarm
}) => {
  const pieData = [
    { name: 'CRITICAL', value: alarms.filter(a => a.severity === 'CRITICAL').length || 1, color: SEVERITY_COLORS.CRITICAL },
    { name: 'HIGH', value: alarms.filter(a => a.severity === 'HIGH').length || 2, color: SEVERITY_COLORS.HIGH },
    { name: 'MEDIUM', value: alarms.filter(a => a.severity === 'MEDIUM').length || 3, color: SEVERITY_COLORS.MEDIUM },
    { name: 'LOW', value: alarms.filter(a => a.severity === 'LOW').length || 4, color: SEVERITY_COLORS.LOW },
  ];

  const hourlyData = analytics?.hourly_trends || [
    { hour: '00:00', normal: 420, anomaly: 12 },
    { hour: '04:00', normal: 310, anomaly: 8 },
    { hour: '08:00', normal: 890, anomaly: 25 },
    { hour: '12:00', normal: 1250, anomaly: 42 },
    { hour: '16:00', normal: 1420, anomaly: 68 },
    { hour: '20:00', normal: 980, anomaly: 35 },
    { hour: '24:00', normal: 610, anomaly: 19 }
  ];

  return (
    <div className="space-y-6">
      {/* Top KPI Cards */}
      <KPICards kpis={kpis} />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Anomaly Trend Area Chart */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">
                Log Volume & Anomaly Rate Trend
              </h3>
              <p className="text-xs text-slate-400">Normal Log Events vs Model Flagged Anomalies</p>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              24-Hour Horizon
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorNormal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAnomaly" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#F43F5E" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="hour" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: '12px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="normal" stroke="#06B6D4" fillOpacity={1} fill="url(#colorNormal)" name="Normal Events" />
                <Area type="monotone" dataKey="anomaly" stroke="#F43F5E" fillOpacity={1} fill="url(#colorAnomaly)" name="Model Anomalies" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Severity Distribution Donut */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono mb-1">
              Alarm Severity Breakout
            </h3>
            <p className="text-xs text-slate-400 mb-4">Active SIEM Directives Distribution</p>
            
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: '12px', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2 font-mono text-xs">
            {pieData.map((item, i) => (
              <div key={i} className="flex items-center space-x-2 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-300 font-medium">{item.name}:</span>
                <span className="text-slate-100 font-bold ml-auto">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alarms and Live Logs Dual Column */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Alarms List */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              High Priority SIEM Alarms
            </h3>
            <button
              onClick={() => onSelectTab('alerts')}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              View Alert Center <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {alarms.length === 0 ? (
              <div className="p-8 text-center text-slate-500 font-mono text-xs">
                No active security alarms. All baseline systems nominal.
              </div>
            ) : (
              alarms.slice(0, 4).map((alarm) => (
                <div
                  key={alarm.alarm_id}
                  onClick={() => onSelectAlarm(alarm)}
                  className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all hover:bg-slate-800/60"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      alarm.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' :
                      alarm.severity === 'HIGH' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                      'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                    }`}>
                      {alarm.severity} (Risk: {alarm.risk_score}/10)
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{alarm.alarm_id}</span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-200 truncate">{alarm.title}</h4>
                  <p className="text-[11px] text-slate-400 font-mono mt-1">
                    Directive: {alarm.matched_directive} | Src: {alarm.src_ip}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Live Streaming Log Ticker */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400 animate-pulse" />
              Real-time Ingestion Feed
            </h3>
            <button
              onClick={() => onSelectTab('logs')}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              Full Feed Stream <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto font-mono text-xs">
            {logs.slice(0, 6).map((log) => (
              <div
                key={log.id}
                className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                  <span className="text-cyan-400 font-bold">[{log.event_id}] {log.service}</span>
                  <span>{log.timestamp.slice(11, 19)}</span>
                </div>
                <p className="text-slate-300 text-[11px] truncate">{log.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
