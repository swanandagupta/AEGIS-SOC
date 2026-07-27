import React from 'react';
import { Users } from 'lucide-react';
import type { UserProfile } from '../types';

interface UserBehaviorPageProps {
  userProfiles: UserProfile[];
}

export const UserBehaviorPage: React.FC<UserBehaviorPageProps> = ({ userProfiles }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-100 uppercase tracking-wider font-mono flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            User Entity Behavior Analytics (UEBA) Profiles
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            User Authentication Patterns, Privilege Escalations & Risk Baseline Scores
          </p>
        </div>
      </div>

      {/* User Risk Profile Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {userProfiles.map((user) => {
          const isCritical = user.risk_score >= 8.0;
          const isHigh = user.risk_score >= 5.0 && user.risk_score < 8.0;

          return (
            <div
              key={user.username}
              className={`glass-panel rounded-2xl p-6 border transition-all duration-300 ${
                isCritical ? 'border-rose-500/40 shadow-glow-danger' :
                isHigh ? 'border-amber-500/40' :
                'border-slate-800'
              }`}
            >
              {/* User Card Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-sm ${
                    isCritical ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' :
                    isHigh ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                    'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  }`}>
                    {user.username.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-100 font-mono">{user.username}</h3>
                    <p className="text-xs text-slate-400 font-mono">{user.department}</p>
                  </div>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
                  isCritical ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' :
                  isHigh ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                  'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                }`}>
                  {user.status} RISK ({user.risk_score}/10)
                </span>
              </div>

              {/* Risk Score Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                  <span>Calculated Risk Score</span>
                  <span className="font-bold text-slate-200">{user.risk_score} / 10.0</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      isCritical ? 'bg-rose-500' : isHigh ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${(user.risk_score / 10) * 100}%` }}
                  />
                </div>
              </div>

              {/* Behavior Metrics Grid */}
              <div className="grid grid-cols-3 gap-3 mb-4 text-center font-mono">
                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Anomalies</span>
                  <span className="text-sm font-bold text-slate-200">{user.anomalies_detected}</span>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Auth Failures</span>
                  <span className="text-sm font-bold text-rose-400">{user.failed_auth_count}</span>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Sudo Calls</span>
                  <span className="text-sm font-bold text-amber-400">{user.sudo_escalations}</span>
                </div>
              </div>

              {/* IP Information */}
              <div className="space-y-1.5 text-xs font-mono text-slate-400 mb-4 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div className="flex justify-between">
                  <span>Baseline IP:</span>
                  <span className="text-emerald-400 font-semibold">{user.typical_ip}</span>
                </div>
                <div className="flex justify-between">
                  <span>Anomalous IP:</span>
                  <span className={user.anomalous_ip !== 'None' ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                    {user.anomalous_ip}
                  </span>
                </div>
              </div>

              {/* Risk Factors Badges */}
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-400 block mb-2">Primary Risk Indicators</span>
                <div className="flex flex-wrap gap-1.5">
                  {user.risk_factors.map((factor, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-[10px] font-mono text-slate-300"
                    >
                      {factor}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
