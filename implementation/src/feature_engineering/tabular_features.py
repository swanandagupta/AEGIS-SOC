from typing import List, Dict
from src.ingestion_parsing.event_abstractor import AbstractedEvent

class TabularFeatureExtractor:
    """Extracts numerical event counts, rates, and failure ratios for statistical modeling."""

    def extract_features(self, events: List[AbstractedEvent]) -> Dict[str, float]:
        if not events:
            return {
                "total_events": 0.0,
                "fail_count": 0.0,
                "success_count": 0.0,
                "invalid_user_count": 0.0,
                "sudo_count": 0.0,
                "failure_ratio": 0.0
            }

        total = float(len(events))
        fail_count = sum(1.0 for e in events if e.event_id in ("E1", "E4"))
        success_count = sum(1.0 for e in events if e.event_id == "E2")
        invalid_user_count = sum(1.0 for e in events if e.event_id == "E4")
        sudo_count = sum(1.0 for e in events if e.event_id == "E3")

        return {
            "total_events": total,
            "fail_count": fail_count,
            "success_count": success_count,
            "invalid_user_count": invalid_user_count,
            "sudo_count": sudo_count,
            "failure_ratio": fail_count / total if total > 0 else 0.0
        }
