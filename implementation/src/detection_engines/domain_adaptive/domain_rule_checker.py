from dataclasses import dataclass
from typing import List
from src.ingestion_parsing.event_abstractor import AbstractedEvent

@dataclass
class RuleScore:
    rule_name: str
    triggered: bool
    score: float
    description: str

class DomainRuleChecker:
    """Heuristic rule checker for detecting brute force attacks, invalid users, and privilege escalation."""

    def evaluate(self, events: List[AbstractedEvent]) -> RuleScore:
        if not events:
            return RuleScore("NoEvents", False, 0.0, "No events present")

        # Brute Force Check (e.g. >= 3 failed logins in window)
        failed_attempts = [e for e in events if e.event_id in ("E1", "E4")]
        if len(failed_attempts) >= 3:
            return RuleScore(
                rule_name="BruteForceAuthFailure",
                triggered=True,
                score=0.95,
                description=f"Detected {len(failed_attempts)} failed authentication attempts in window"
            )

        # Excessive Sudo Escalation Check
        sudo_events = [e for e in events if e.event_id == "E3"]
        if len(sudo_events) >= 2:
            return RuleScore(
                rule_name="ExcessiveSudoUsage",
                triggered=True,
                score=0.75,
                description=f"Detected {len(sudo_events)} sudo commands in window"
            )

        # Invalid User Enumeration
        invalid_users = [e for e in events if e.event_id == "E4"]
        if len(invalid_users) >= 2:
            return RuleScore(
                rule_name="InvalidUserEnumeration",
                triggered=True,
                score=0.85,
                description=f"Detected {len(invalid_users)} invalid user login attempts"
            )

        return RuleScore("NormalBehavior", False, 0.0, "No suspicious rule violations")
