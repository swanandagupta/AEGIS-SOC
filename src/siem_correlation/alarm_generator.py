from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Dict, Any
from src.siem_correlation.correlation_engine import DirectiveMatch
from src.siem_correlation.threat_intel_lookup import ThreatIntelResult

@dataclass
class SIEMAlarm:
    alarm_id: str
    timestamp: str
    title: str
    src_ip: str
    dst_ip: str
    severity: str
    risk_score: float
    threat_intel: Dict[str, Any]
    matched_directive: str
    status: str = "OPEN"

class AlarmGenerator:
    """Generates risk-adjusted SIEM Alarms enriched with Threat Intel."""

    def __init__(self):
        self.counter = 1000

    def generate_alarm(self, match: DirectiveMatch, intel: ThreatIntelResult, fused_score: float) -> SIEMAlarm:
        self.counter += 1
        alarm_id = f"ALARM-{self.counter}"
        
        # Risk adjustment calculation: Fused Model Score * Threat Intel Multiplier
        intel_multiplier = 1.5 if intel.reputation == "SUSPICIOUS" else 1.0
        final_risk = min(10.0, round(fused_score * 7.0 * intel_multiplier, 2))

        return SIEMAlarm(
            alarm_id=alarm_id,
            timestamp=datetime.now(timezone.utc).isoformat(),
            title=f"Security Alarm: {match.name} on {match.src_ip}",
            src_ip=match.src_ip,
            dst_ip=match.dst_ip,
            severity=match.severity,
            risk_score=final_risk,
            threat_intel={
                "indicator": intel.indicator,
                "reputation": intel.reputation,
                "threat_category": intel.threat_category,
                "intel_risk_score": intel.risk_score
            },
            matched_directive=match.directive_id
        )
