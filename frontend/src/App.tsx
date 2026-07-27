import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { OverviewPage } from './components/OverviewPage';
import { AlertCenterPage } from './components/AlertCenterPage';
import { LiveLogFeedPage } from './components/LiveLogFeedPage';
import { UserBehaviorPage } from './components/UserBehaviorPage';
import { AnalyticsPage } from './components/AnalyticsPage';
import { ModelHealthPage } from './components/ModelHealthPage';

import type { 
  KPIs, 
  SIEMAlarm, 
  LogEntry, 
  UserProfile, 
  AnalyticsData, 
  ModelHealth 
} from './types';

const API_BASE = 'http://127.0.0.1:8000/api';
const WS_URL = 'ws://127.0.0.1:8000/ws/live-stream';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  // State data
  const [kpis, setKpis] = useState<KPIs | null>(null);
  const [alarms, setAlarms] = useState<SIEMAlarm[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [modelHealth, setModelHealth] = useState<ModelHealth | null>(null);
  
  const [selectedAlarm, setSelectedAlarm] = useState<SIEMAlarm | null>(null);
  const [wsConnected, setWsConnected] = useState<boolean>(false);
  const [isLogStreamPaused, setIsLogStreamPaused] = useState<boolean>(false);

  const wsRef = useRef<WebSocket | null>(null);

  // Fetch initial REST data
  const fetchData = async () => {
    try {
      const [kpiRes, alarmsRes, logsRes, usersRes, analyticsRes, modelRes] = await Promise.all([
        fetch(`${API_BASE}/kpis`).then(r => r.json()).catch(() => null),
        fetch(`${API_BASE}/alarms`).then(r => r.json()).catch(() => []),
        fetch(`${API_BASE}/logs`).then(r => r.json()).catch(() => []),
        fetch(`${API_BASE}/user-profiles`).then(r => r.json()).catch(() => []),
        fetch(`${API_BASE}/analytics`).then(r => r.json()).catch(() => null),
        fetch(`${API_BASE}/model-health`).then(r => r.json()).catch(() => null)
      ]);

      if (kpiRes) setKpis(kpiRes);
      if (alarmsRes) setAlarms(alarmsRes);
      if (logsRes) setLogs(logsRes);
      if (usersRes) setUserProfiles(usersRes);
      if (analyticsRes) setAnalytics(analyticsRes);
      if (modelRes) setModelHealth(modelRes);
    } catch (err) {
      console.warn('Backend REST API unavailable, using local dynamic state');
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 8000);
    return () => clearInterval(interval);
  }, []);

  // WebSocket Connection
  useEffect(() => {
    const connectWS = () => {
      try {
        const ws = new WebSocket(WS_URL);
        wsRef.current = ws;

        ws.onopen = () => {
          setWsConnected(true);
        };

        ws.onmessage = (event) => {
          if (isLogStreamPaused) return;
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'NEW_LOG') {
              if (data.log) {
                setLogs(prev => [data.log, ...prev].slice(0, 100));
              }
              if (data.new_alarms && data.new_alarms.length > 0) {
                setAlarms(prev => [...data.new_alarms, ...prev]);
                setKpis(prev => prev ? {
                  ...prev,
                  active_threats: prev.active_threats + data.new_alarms.length,
                  total_logs: prev.total_logs + 1
                } : null);
              }
            }
          } catch (e) {
            console.error('Error parsing WS message', e);
          }
        };

        ws.onclose = () => {
          setWsConnected(false);
          setTimeout(connectWS, 3000);
        };

        ws.onerror = () => {
          setWsConnected(false);
        };
      } catch (err) {
        setWsConnected(false);
      }
    };

    connectWS();
    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, [isLogStreamPaused]);

  // Handler to ingest custom log
  const handleIngestLog = async (rawLog: string) => {
    try {
      const res = await fetch(`${API_BASE}/logs/ingest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ raw_log: rawLog })
      });
      await res.json();
      await fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // Handler to update alarm status
  const handleUpdateAlarmStatus = async (alarmId: string, status: string) => {
    try {
      await fetch(`${API_BASE}/alarms/${alarmId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      setAlarms(prev => prev.map(a => a.alarm_id === alarmId ? { ...a, status: status as any } : a));
    } catch (err) {
      console.error(err);
    }
  };

  // Handler to update model threshold
  const handleUpdateThreshold = async (newThreshold: number) => {
    try {
      await fetch(`${API_BASE}/model-health/threshold`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threshold: newThreshold })
      });
      if (modelHealth) {
        setModelHealth({ ...modelHealth, current_threshold: newThreshold });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0A0E17] text-slate-100 font-sans">
      {/* Collapsible Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <Header
          wsConnected={wsConnected}
          onIngestLog={handleIngestLog}
          activeThreatsCount={alarms.filter(a => a.status === 'OPEN').length}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'overview' && (
            <OverviewPage
              kpis={kpis}
              alarms={alarms}
              logs={logs}
              analytics={analytics}
              onSelectTab={setActiveTab}
              onSelectAlarm={(alarm) => {
                setSelectedAlarm(alarm);
                setActiveTab('alerts');
              }}
            />
          )}

          {activeTab === 'alerts' && (
            <AlertCenterPage
              alarms={alarms}
              selectedAlarm={selectedAlarm}
              setSelectedAlarm={setSelectedAlarm}
              onUpdateStatus={handleUpdateAlarmStatus}
            />
          )}

          {activeTab === 'logs' && (
            <LiveLogFeedPage
              logs={logs}
              isPaused={isLogStreamPaused}
              setIsPaused={setIsLogStreamPaused}
              onClearLogs={() => setLogs([])}
            />
          )}

          {activeTab === 'users' && (
            <UserBehaviorPage userProfiles={userProfiles} />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsPage analytics={analytics} />
          )}

          {activeTab === 'model-health' && (
            <ModelHealthPage
              modelHealth={modelHealth}
              onUpdateThreshold={handleUpdateThreshold}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
