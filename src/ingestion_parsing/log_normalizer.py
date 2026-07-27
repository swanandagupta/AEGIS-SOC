import re
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Dict, Any, Optional

@dataclass
class NormalizedEvent:
    timestamp: str
    log_source: str
    service: str
    src_ip: Optional[str]
    dst_ip: Optional[str]
    user: Optional[str]
    message: str
    raw_log: str
    attributes: Dict[str, Any] = field(default_factory=dict)

class LogNormalizer:
    """Parses heterogeneous raw log strings into standard NormalizedEvent structures."""

    IP_PATTERN = re.compile(r'\b(?:\d{1,3}\.){3}\d{1,3}\b')
    USER_PATTERN = re.compile(r'(?:user|for|account)\s+([a-zA-Z0-9_\-\.]+)', re.IGNORECASE)

    def parse(self, raw_log: str, log_source: str = "linux_auth") -> NormalizedEvent:
        log_str = raw_log.strip()
        timestamp = datetime.now(timezone.utc).isoformat()
        
        # Extract IPs
        ips = self.IP_PATTERN.findall(log_str)
        src_ip = ips[0] if len(ips) > 0 else "127.0.0.1"
        dst_ip = ips[1] if len(ips) > 1 else "192.168.1.1"

        # Extract User
        user_match = self.USER_PATTERN.search(log_str)
        user = user_match.group(1) if user_match else "unknown"

        # Extract Service / Process
        service = "sshd"
        if "sudo" in log_str.lower():
            service = "sudo"
        elif "pam" in log_str.lower():
            service = "pam"
        elif "kernel" in log_str.lower():
            service = "kernel"

        return NormalizedEvent(
            timestamp=timestamp,
            log_source=log_source,
            service=service,
            src_ip=src_ip,
            dst_ip=dst_ip,
            user=user,
            message=log_str,
            raw_log=log_str,
            attributes={"length": len(log_str)}
        )
