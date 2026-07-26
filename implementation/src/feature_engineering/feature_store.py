from typing import List, Dict, Any, Optional
from collections import deque
from src.ingestion_parsing.event_abstractor import AbstractedEvent

class FeatureStore:
    """In-memory feature queue and data buffer for real-time window processing."""

    def __init__(self, max_capacity: int = 1000):
        self.events: deque = deque(maxlen=max_capacity)
        self.sequence_windows: List[List[str]] = []
        self.feature_vectors: List[Dict[str, float]] = []

    def add_event(self, event: AbstractedEvent) -> None:
        self.events.append(event)

    def get_recent_events(self, count: int) -> List[AbstractedEvent]:
        return list(self.events)[-count:]

    def get_all_events(self) -> List[AbstractedEvent]:
        return list(self.events)

    def clear(self) -> None:
        self.events.clear()
        self.sequence_windows.clear()
        self.feature_vectors.clear()
