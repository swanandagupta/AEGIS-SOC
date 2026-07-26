from dataclasses import dataclass
from typing import Dict, Any
from src.ingestion_parsing.log_normalizer import NormalizedEvent

@dataclass
class AbstractedEvent:
    event_id: str
    meaning: str
    normalized_event: NormalizedEvent

class EventAbstractor:
    """Maps normalized security log events into discrete abstract Event IDs (E0-E7)."""

    def __init__(self):
        self.rules = [
            ("E1", "Failed password authentication", lambda msg: "failed password" in msg.lower() or "authentication failure" in msg.lower()),
            ("E2", "Successful login", lambda msg: "accepted password" in msg.lower() or "session opened" in msg.lower()),
            ("E3", "Sudo command usage", lambda msg: "sudo:" in msg.lower() or "COMMAND=" in msg),
            ("E4", "Invalid user attempt", lambda msg: "invalid user" in msg.lower() or "illegal user" in msg.lower()),
            ("E5", "Session closed", lambda msg: "session closed" in msg.lower()),
            ("E6", "Connection closed", lambda msg: "connection closed" in msg.lower() or "disconnected" in msg.lower()),
            ("E7", "PAM authentication event", lambda msg: "pam" in msg.lower())
        ]

    def abstract(self, event: NormalizedEvent) -> AbstractedEvent:
        msg = event.message
        for event_id, meaning, cond in self.rules:
            if cond(msg):
                return AbstractedEvent(event_id=event_id, meaning=meaning, normalized_event=event)
        
        return AbstractedEvent(event_id="E0", meaning="Normal/Background event", normalized_event=event)
