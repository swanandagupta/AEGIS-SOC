from src.siem_correlation.alarm_generator import SIEMAlarm

class AlertDispatcher:
    """Dispatches alarm notifications to analysts / SOC logs."""

    def dispatch(self, alarm: SIEMAlarm) -> None:
        print(f"\n[ALERT DISPATCHED] ID: {alarm.alarm_id} | Severity: {alarm.severity} | Risk Score: {alarm.risk_score}/10")
        print(f"                   Title: {alarm.title}")
        print(f"                   Source IP: {alarm.src_ip} -> Destination IP: {alarm.dst_ip}")
        print(f"                   Directive: {alarm.matched_directive} | Reputation: {alarm.threat_intel['reputation']}")
