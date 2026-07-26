from dataclasses import dataclass, field
from typing import List, Dict, Any, Optional

@dataclass
class DirectiveMatch:
    directive_id: str
    name: str
    matched_events_count: int
    rule_name: str
    src_ip: str
    dst_ip: str
    severity: str

class CorrelationEngine:
    """OSSIM-style correlation directive state matcher inspired by Dsiem."""

    def __init__(self):
        self.state_buffer: Dict[str, List[Any]] = {}

    def correlate(self, src_ip: str, dst_ip: str, rule_name: str, fused_score: float) -> Optional[DirectiveMatch]:
        key = f"{src_ip}->{dst_ip}"
        if key not in self.state_buffer:
            self.state_buffer[key] = []
        
        self.state_buffer[key].append({"rule": rule_name, "score": fused_score})

        # Match OSSIM-style directive: >= 2 anomalous occurrences from same IP pair
        if len(self.state_buffer[key]) >= 2:
            match = DirectiveMatch(
                directive_id="DIR_AUTHENTICATION_ATTACK_SERIES",
                name="Repeated Anomaly Auth Attack Chain",
                matched_events_count=len(self.state_buffer[key]),
                rule_name=rule_name,
                src_ip=src_ip,
                dst_ip=dst_ip,
                severity="HIGH" if fused_score >= 0.7 else "MEDIUM"
            )
            # Reset state buffer for key
            self.state_buffer[key] = []
            return match

        return None
