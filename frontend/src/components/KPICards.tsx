import React from 'react';
import { 
  FileText, 
  AlertTriangle, 
  ShieldAlert, 
  Users, 
  Activity, 
  Clock 
} from 'lucide-react';
import type { KPIs } from '../types';

interface KPICardsProps {
  kpis: KPIs | null;
}

export const KPICards: React.FC<KPICardsProps> = ({ kpis }) => {
  const cards = [
    {
      title: 'Total Logs Processed',
      value: kpis?.total_logs.toLocaleString() ?? '1,427',
      subtext: '+120 logs/sec stream',
      icon: FileText,
      color: 'text-cyan-400',
      borderColor: 'border-cyan-500/30',
      glow: 'shadow-glow-cyan'
    },
    {
      title: 'Active Threat Alarms',
      value: kpis?.active_threats ?? 1,
      subtext: 'Requires Analyst Action',
      icon: AlertTriangle,
      color: 'text-amber-400',
      borderColor: 'border-amber-500/30',
      glow: ''
    },
    {
      title: 'Critical Severity Alarms',
      value: kpis?.critical_alarms ?? 1,
      subtext: 'High Risk Directives Matched',
      icon: ShieldAlert,
      color: 'text-rose-400',
      borderColor: 'border-rose-500/30',
      glow: 'shadow-glow-danger'
    },
    {
      title: 'High-Risk Users Flagged',
      value: kpis?.high_risk_users ?? 2,
      subtext: 'Anomalous Auth Attempts',
      icon: Users,
      color: 'text-purple-400',
      borderColor: 'border-purple-500/30',
      glow: ''
    },
    {
      title: 'Model Anomaly Rate',
      value: `${kpis?.model_anomaly_rate ?? 3.4}%`,
      subtext: 'Fused LogBERT + PyOD',
      icon: Activity,
      color: 'text-emerald-400',
      borderColor: 'border-emerald-500/30',
      glow: 'shadow-glow-success'
    },
    {
      title: 'Mean Time to Detect (MTTD)',
      value: `${kpis?.mean_time_to_detect_ms ?? 14} ms`,
      subtext: 'Real-time Pipeline Latency',
      icon: Clock,
      color: 'text-indigo-400',
      borderColor: 'border-indigo-500/30',
      glow: ''
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`glass-panel rounded-2xl p-4 border ${card.borderColor} ${card.glow} transition-all duration-300 hover:scale-[1.02]`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-400 truncate">{card.title}</span>
              <div className={`p-2 rounded-xl bg-slate-800/80 ${card.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline space-x-1">
              <span className="text-xl font-bold font-mono text-slate-100">{card.value}</span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono mt-1">{card.subtext}</p>
          </div>
        );
      })}
    </div>
  );
};
