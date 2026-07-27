import sys
from src.orchestrator.pipeline_controller import UnifiedPipelineOrchestrator

def main():
    print("=" * 70)
    print(" UNIFIED SECURITY LOG ANOMALY DETECTION & SIEM CORRELATION SYSTEM ")
    print("=" * 70)

    orchestrator = UnifiedPipelineOrchestrator(domain="linux")

    # Sample heterogenous log stream (Normal -> Attack -> System Incident)
    raw_log_stream = [
        "Jul 26 18:00:01 server-01 sshd[1020]: Accepted password for devuser from 192.168.1.15 port 51234",
        "Jul 26 18:00:10 server-01 sshd[1020]: pam_unix(sshd:session): session opened for user devuser",
        "Jul 26 18:02:00 server-01 sshd[1025]: Failed password for invalid user admin from 192.168.1.100 port 54321",
        "Jul 26 18:02:02 server-01 sshd[1026]: Failed password for invalid user admin from 192.168.1.100 port 54322",
        "Jul 26 18:02:04 server-01 sshd[1027]: Failed password for invalid user root from 192.168.1.100 port 54323",
        "Jul 26 18:02:10 server-01 sudo: devuser : TTY=pts/0 ; PWD=/home/devuser ; USER=root ; COMMAND=/bin/su",
        "Jul 26 18:02:12 server-01 sudo: pam_unix(sudo:auth): authentication failure; user=root host=192.168.1.100"
    ]

    print(f"\n[*] Processing {len(raw_log_stream)} heterogeneous security log entries...")
    alarms = orchestrator.process_log_batch(raw_log_stream)

    print("\n" + "=" * 70)
    print(f" PIPELINE SUMMARY: {len(alarms)} Alarms Generated & Indexed in Repository")
    print("=" * 70)
    for idx, alarm in enumerate(alarms, 1):
        print(f"[{idx}] Alarm ID   : {alarm.alarm_id}")
        print(f"    Title      : {alarm.title}")
        print(f"    Severity   : {alarm.severity} (Risk Score: {alarm.risk_score}/10.0)")
        print(f"    Threat IP  : {alarm.src_ip} (Reputation: {alarm.threat_intel['reputation']})")
        print(f"    Directive  : {alarm.matched_directive}")
        print("-" * 70)

if __name__ == "__main__":
    main()
