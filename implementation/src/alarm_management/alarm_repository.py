from typing import List, Dict, Optional
from src.siem_correlation.alarm_generator import SIEMAlarm

class AlarmRepository:
    """In-memory storage and state manager for SIEM alarms."""

    def __init__(self):
        self.alarms: Dict[str, SIEMAlarm] = {}

    def save(self, alarm: SIEMAlarm) -> None:
        self.alarms[alarm.alarm_id] = alarm

    def get_all(self) -> List[SIEMAlarm]:
        return list(self.alarms.values())

    def update_status(self, alarm_id: str, new_status: str) -> Optional[SIEMAlarm]:
        if alarm_id in self.alarms:
            self.alarms[alarm_id].status = new_status
            return self.alarms[alarm_id]
        return None
