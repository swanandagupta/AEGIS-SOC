from typing import List
from src.ingestion_parsing.event_abstractor import AbstractedEvent

class SequenceWindowGenerator:
    """Generates sliding sequence windows of Event IDs and template IDs."""

    def __init__(self, window_size: int = 10, step_size: int = 1):
        self.window_size = window_size
        self.step_size = step_size

    def create_windows(self, events: List[AbstractedEvent]) -> List[List[str]]:
        event_ids = [e.event_id for e in events]
        windows = []
        if len(event_ids) < self.window_size:
            if event_ids:
                # Pad to window_size
                padded = event_ids + ["E0"] * (self.window_size - len(event_ids))
                windows.append(padded)
            return windows

        for i in range(0, len(event_ids) - self.window_size + 1, self.step_size):
            windows.append(event_ids[i : i + self.window_size])
        return windows
