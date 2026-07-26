from typing import Tuple, Dict, Any

class DynamicThresholdTuner:
    """Evaluates fused hybrid anomaly scores against adaptive thresholds to trigger SIEM events."""

    def __init__(self, base_threshold: float = 0.50):
        self.base_threshold = base_threshold

    def evaluate(self, fused_score: float) -> Tuple[bool, Dict[str, Any]]:
        is_anomaly = fused_score >= self.base_threshold
        severity = "LOW"
        if fused_score >= 0.85:
            severity = "CRITICAL"
        elif fused_score >= 0.70:
            severity = "HIGH"
        elif fused_score >= 0.50:
            severity = "MEDIUM"

        return is_anomaly, {
            "fused_score": fused_score,
            "threshold": self.base_threshold,
            "severity": severity
        }
