import sys
import unittest
from src.orchestrator.pipeline_controller import UnifiedPipelineOrchestrator

class TestUnifiedPipeline(unittest.TestCase):

    def test_pipeline_normal_logs(self):
        orchestrator = UnifiedPipelineOrchestrator(domain="linux")
        normal_logs = [
            "Jul 26 10:00:01 server1 sshd[1234]: Accepted password for root from 192.168.1.5 port 22 ssh2",
            "Jul 26 10:00:05 server1 sshd[1234]: pam_unix(sshd:session): session opened for user root",
            "Jul 26 10:05:00 server1 sshd[1234]: pam_unix(sshd:session): session closed for user root"
        ]
        alarms = orchestrator.process_log_batch(normal_logs)
        self.assertEqual(len(alarms), 0, "Normal logs should not produce high severity correlation alarms")

    def test_pipeline_attack_sequence(self):
        orchestrator = UnifiedPipelineOrchestrator(domain="linux")
        attack_logs = [
            "Jul 26 10:15:01 server1 sshd[5678]: Failed password for invalid user admin from 192.168.1.100 port 4567 ssh2",
            "Jul 26 10:15:03 server1 sshd[5678]: Failed password for invalid user admin from 192.168.1.100 port 4568 ssh2",
            "Jul 26 10:15:05 server1 sshd[5678]: Failed password for invalid user root from 192.168.1.100 port 4569 ssh2",
            "Jul 26 10:15:08 server1 sudo: pam_unix(sudo:auth): authentication failure; logname= uid=0 euid=0 tty=/dev/pts/1 ruser= rhost= user=root"
        ]
        alarms = orchestrator.process_log_batch(attack_logs)
        self.assertGreaterEqual(len(alarms), 1, "Attack sequence should trigger at least one SIEM Alarm")
        self.assertIn("192.168.1.100", alarms[0].src_ip)

if __name__ == "__main__":
    unittest.main()
