import React from 'react';
import { 
  ShieldAlert, 
  LayoutDashboard, 
  AlertTriangle, 
  Terminal, 
  Users, 
  BarChart3, 
  Cpu, 
  ChevronLeft, 
  ChevronRight,
  Activity
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed
}) => {
  const navItems = [
    { id: 'overview', label: 'SOC Overview', icon: LayoutDashboard },
    { id: 'alerts', label: 'Alert Center', icon: AlertTriangle, badge: 'LIVE' },
    { id: 'logs', label: 'Live Log Feed', icon: Terminal },
    { id: 'users', label: 'User Behavior', icon: Users },
    { id: 'analytics', label: 'Threat Analytics', icon: BarChart3 },
    { id: 'model-health', label: 'AI Model Health', icon: Cpu },
  ];

  return (
    <aside 
      className={`glass-panel border-r border-slate-800 h-screen sticky top-0 transition-all duration-300 z-30 flex flex-col ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400 shadow-glow-cyan">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="font-bold text-slate-100 text-sm tracking-wider uppercase font-mono">
                AEGIS<span className="text-cyan-400">.SOC</span>
              </h1>
              <p className="text-xs text-slate-400">SIEM & Log AI</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="mx-auto p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-cyan-400 transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-cyan-500/5 text-cyan-400 border border-cyan-500/40 shadow-glow-cyan'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              {!collapsed && (
                <div className="flex items-center justify-between w-full">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* System Status Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/40">
          <div className="flex items-center space-x-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <div>
              <p className="text-xs font-semibold text-slate-300">Pipeline Engine</p>
              <p className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <Activity className="w-3 h-3" /> ONLINE (850+ EPS)
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
