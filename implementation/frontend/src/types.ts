export interface KPIs {
  total_logs: number;
  active_threats: number;
  critical_alarms: number;
  high_risk_users: number;
  model_anomaly_rate: number;
  mean_time_to_detect_ms: number;
  system_status: string;
  websocket_active: number;
}

export interface ThreatIntel {
  indicator: string;
  reputation: string;
  threat_category: string;
  intel_risk_score: number;
}

export interface SIEMAlarm {
  alarm_id: string;
  timestamp: string;
  title: string;
  src_ip: string;
  dst_ip: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  risk_score: number;
  threat_intel: ThreatIntel;
  matched_directive: string;
  status: 'OPEN' | 'ACKNOWLEDGED' | 'RESOLVED' | 'DISMISSED';
}

export interface LogEntry {
  id: string;
  timestamp: string;
  event_id: string;
  meaning: string;
  service: string;
  src_ip: string;
  dst_ip: string;
  user: string;
  message: string;
  log_source: string;
}

export interface UserProfile {
  username: string;
  risk_score: number;
  status: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  department: string;
  last_active: string;
  anomalies_detected: number;
  failed_auth_count: number;
  sudo_escalations: number;
  typical_ip: string;
  anomalous_ip: string;
  risk_factors: string[];
}

export interface HourlyTrend {
  hour: string;
  normal: number;
  anomaly: number;
}

export interface LogSourceDist {
  name: string;
  value: number;
}

export interface AttackVector {
  vector: string;
  count: number;
  percentage: number;
}

export interface ThreatIP {
  ip: string;
  country: string;
  attacks: number;
  threat_level: string;
}

export interface AnalyticsData {
  hourly_trends: HourlyTrend[];
  log_sources: LogSourceDist[];
  attack_vectors: AttackVector[];
  top_threat_ips: ThreatIP[];
}

export interface ModelDetail {
  name: string;
  status: string;
  accuracy?: string;
  masked_lm_loss?: number;
  vocabulary_size?: number;
  algorithms?: string[];
  aggregation_method?: string;
  active_domain?: string;
  domain_divergence_loss?: number;
  active_directives?: number;
  threat_cache_entries?: number;
  weight_inspiration: string;
}

export interface ModelHealth {
  overall_status: string;
  current_threshold: number;
  throughput_eps: number;
  inference_latency_ms: number;
  memory_usage_mb: number;
  models: {
    logbert_transformer: ModelDetail;
    pyod_ensemble: ModelDetail;
    grl_domain_adapter: ModelDetail;
    dsiem_correlation_engine: ModelDetail;
  };
}
