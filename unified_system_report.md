# Comprehensive Technical Report: Unified Security Log Anomaly Detection Platform & Modern SOC Dashboard

---

## 1. Executive Summary

This platform integrates four reference cybersecurity and machine learning paradigms into a single, unified, end-to-end Security Information and Event Management (SIEM) and AI-driven Log Anomaly Detection system:

1. **`dsiem-master`**: OSSIM-style event correlation rules, stateful directive tracking, threat intelligence (WISE / AlienVault OTX) lookups, and alarm lifecycle triage workflows.
2. **`logbert-main`**: Self-supervised Transformer sequence modeling, template mining via Drain, vocabulary building, and masked log key prediction surprise scoring.
3. **`hybrid-log-anomaly-detection-main`**: Cross-system domain adaptation via Gradient Reversal Layer (GRL) representation alignment, Linux event abstraction (`E0`-`E7`), and domain-specific cybersecurity heuristic rules.
4. **`pyod-master`**: Multivariate statistical and unsupervised tabular outlier detection algorithms (ECOD, COPOD, Isolation Forest) and score aggregation ensembles (AOM / MOA / Max).

The complete system comprises a multi-engine Python pipeline backend, a FastAPI REST & WebSocket streaming server ([api_server.py](file:///c:/Users/swana/Desktop/Swananada/BTech/Project/honeywell/api_server.py)), and a dark-themed React + TypeScript + Tailwind CSS SOC Dashboard ([frontend/](file:///c:/Users/swana/Desktop/Swananada/BTech/Project/honeywell/frontend)).

---

## 2. Architecture & Subsystem Mapping

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                LOG INGESTION & PARSING                                 │
│  Raw Logs ──► LogNormalizer ──► LogParser (Drain) ──► EventAbstractor (E0-E7)          │
└──────────────────────────────────────────┬─────────────────────────────────────────────┘
                                           │
                                           ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              FEATURE ENGINEERING & STORE                               │
│            FeatureStore ──► SequenceWindowGenerator & TabularFeatureExtractor          │
└──────────────────────────────────────────┬─────────────────────────────────────────────┘
                                           │
             ┌─────────────────────────────┼─────────────────────────────┐
             ▼                             ▼                             ▼
┌──────────────────────────┐  ┌──────────────────────────┐  ┌──────────────────────────┐
│  DEEP SEQUENCE ENGINE    │  │  STATISTICAL OUTLIER     │  │   DOMAIN ADAPTIVE &      │
│  LogBERT Transformer     │  │  PyOD Multivariate       │  │   RULE ENGINE            │
│  (Seq Surprise Score)    │  │  (Z-score / Ensembles)   │  │   (GRL & Heuristics)     │
└────────────┬─────────────┘  └────────────┬─────────────┘  └────────────┬─────────────┘
             │                             │                             │
             └─────────────────────────────┼─────────────────────────────┘
                                           ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                       HYBRID SCORE FUSION & DYNAMIC THRESHOLD                          │
│         Weighted Fusion (35% Deep + 35% Stat + 30% Rule) ──► DynamicThresholdTuner       │
└──────────────────────────────────────────┬─────────────────────────────────────────────┘
                                           │ (Anomaly Triggered)
                                           ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                      SIEM CORRELATION & THREAT ENRICHMENT                              │
│       OSSIM Correlation Directives ──► ThreatIntelLookup ──► Risk-Adjusted Alarm       │
└──────────────────────────────────────────┬─────────────────────────────────────────────┘
                                           │
                                           ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                          FASTAPI BACKEND & WEBSOCKET ENGINE                            │
│           REST API (/api/*) + Real-Time WebSocket Broadcast (/ws/live-stream)         │
└──────────────────────────────────────────┬─────────────────────────────────────────────┘
                                           │
                                           ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                           REACT + TYPESCRIPT SOC DASHBOARD                             │
│  Overview ── Alert Center ── Live Feed ── UEBA Profiles ── Analytics ── Model Health   │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. End-to-End Multi-Engine Working & Data Flow

### Step 1: Log Ingestion & Normalization
* **Module**: [log_normalizer.py](file:///c:/Users/swana/Desktop/Swananada/BTech/Project/honeywell/src/ingestion_parsing/log_normalizer.py)
* **Function**: Ingests raw syslog / authentication log lines and extracts core fields into a standard `NormalizedEvent` schema:
  - `timestamp`: ISO-8601 UTC timestamp.
  - `service`: Process identifier (`sshd`, `sudo`, `pam`, `kernel`).
  - `src_ip` & `dst_ip`: Regex-extracted IP addresses.
  - `user`: Authenticating user account (`root`, `admin`, `devuser`).
  - `message`: Full raw log text.

### Step 2: Log Template Mining & Event Abstraction
* **Modules**: [log_parser.py](file:///c:/Users/swana/Desktop/Swananada/BTech/Project/honeywell/src/ingestion_parsing/log_parser.py) & [event_abstractor.py](file:///c:/Users/swana/Desktop/Swananada/BTech/Project/honeywell/src/ingestion_parsing/event_abstractor.py)
* **Function**:
  - `LogParser` uses Drain-inspired regex template mining to mask variables (`<IP>`, `<NUM>`) and assign dynamic token IDs.
  - `EventAbstractor` categorizes logs into discrete Event IDs (`E0` = Normal, `E1` = Auth Failure, `E2` = Login Success, `E3` = Sudo Execution, `E4` = Invalid User, `E5` = Session Close, `E6` = Connection Disconnect, `E7` = PAM Event).

### Step 3: Feature Engineering & Real-Time Buffer
* **Modules**: [sequence_windowing.py](file:///c:/Users/swana/Desktop/Swananada/BTech/Project/honeywell/src/feature_engineering/sequence_windowing.py), [tabular_features.py](file:///c:/Users/swana/Desktop/Swananada/BTech/Project/honeywell/src/feature_engineering/tabular_features.py), [feature_store.py](file:///c:/Users/swana/Desktop/Swananada/BTech/Project/honeywell/src/feature_engineering/feature_store.py)
* **Function**:
  - Pushes abstracted events into an in-memory sliding buffer.
  - Generates sequence windows of size $W=5$ for sequential deep learning.
  - Computes numerical feature vectors (total event counts, failure counts, failure ratios, invalid user counts) for tabular statistical modeling.

### Step 4: Parallel Multi-Engine Anomaly Detection
1. **Deep Sequence Engine (LogBERT)**:
   - *Module*: [sequence_detector.py](file:///c:/Users/swana/Desktop/Swananada/BTech/Project/honeywell/src/detection_engines/deep_sequence/sequence_detector.py)
   - *Working*: Evaluates sequence surprise transition scores based on self-supervised token transition matrices. Out-of-order transitions produce elevated sequence scores `[0.0, 1.0]`.
2. **Statistical Outlier Engine (PyOD)**:
   - *Module*: [tabular_detector.py](file:///c:/Users/swana/Desktop/Swananada/BTech/Project/honeywell/src/detection_engines/statistical/tabular_detector.py) & [ensemble_aggregator.py](file:///c:/Users/swana/Desktop/Swananada/BTech/Project/honeywell/src/detection_engines/statistical/ensemble_aggregator.py)
   - *Working*: Calculates z-scores against baseline normal distributions for event frequency and failure ratios. Aggregates multi-algorithm scores using PyOD's Average of Maximums (AOM).
3. **Domain Adaptive & Rule Engine (Hybrid Framework)**:
   - *Module*: [domain_rule_checker.py](file:///c:/Users/swana/Desktop/Swananada/BTech/Project/honeywell/src/detection_engines/domain_adaptive/domain_rule_checker.py) & [grl_domain_adapter.py](file:///c:/Users/swana/Desktop/Swananada/BTech/Project/honeywell/src/detection_engines/domain_adaptive/grl_domain_adapter.py)
   - *Working*: Applies cybersecurity domain heuristics (e.g., $\ge 3$ auth failures in window = Brute Force; $\ge 2$ sudo calls = Privilege Escalation). GRL domain adapter scales features for cross-system domain invariance.

### Step 5: Hybrid Score Fusion & Adaptive Thresholding
* **Modules**: [hybrid_fusion.py](file:///c:/Users/swana/Desktop/Swananada/BTech/Project/honeywell/src/fusion_engine/hybrid_fusion.py) & [dynamic_threshold.py](file:///c:/Users/swana/Desktop/Swananada/BTech/Project/honeywell/src/fusion_engine/dynamic_threshold.py)
* **Function**:
  - Unifies raw scores using a weighted formula:
    $$\text{FusedScore} = (0.35 \times S_{\text{deep}}) + (0.35 \times S_{\text{stat}}) + (0.30 \times S_{\text{rule}}) + \text{Boost}$$
  - Evaluates the fused score against a dynamic threshold (default $0.45$). If exceeded, an anomaly flag is raised.

### Step 6: SIEM Directive Correlation & Threat Enrichment
* **Modules**: [correlation_engine.py](file:///c:/Users/swana/Desktop/Swananada/BTech/Project/honeywell/src/siem_correlation/correlation_engine.py), [threat_intel_lookup.py](file:///c:/Users/swana/Desktop/Swananada/BTech/Project/honeywell/src/siem_correlation/threat_intel_lookup.py), [alarm_generator.py](file:///c:/Users/swana/Desktop/Swananada/BTech/Project/honeywell/src/siem_correlation/alarm_generator.py)
* **Function**:
  - `CorrelationEngine` matches anomalous events against stateful multi-stage OSSIM correlation directives (`DIR_AUTHENTICATION_ATTACK_SERIES`) tracking IP sources.
  - `ThreatIntelLookup` checks IP reputation against threat caches (WISE / AlienVault OTX).
  - `AlarmGenerator` calculates final risk scores ($0.0$ to $10.0$) and indexes a structured `SIEMAlarm`.

---

## 4. FastAPI Backend API & WebSocket Connections

The FastAPI backend server ([api_server.py](file:///c:/Users/swana/Desktop/Swananada/BTech/Project/honeywell/api_server.py)) exposes REST endpoints and a real-time WebSocket connection:

| Method | Endpoint | Description | Payload / Response |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/kpis` | Real-time system telemetry and summary indicators | Returns log counts, active threats, critical alarms, MTTD latency |
| `GET` | `/api/alarms` | Returns SIEM alarms with optional filter parameters | Parameters: `status` (`OPEN`/`RESOLVED`), `severity` (`CRITICAL`/`HIGH`) |
| `PUT` | `/api/alarms/{id}/status` | Updates analyst triage status of an alarm | Body: `{"status": "RESOLVED"}` |
| `GET` | `/api/logs` | Fetches recent normalized ingestion log history | Returns JSON array of `LogEntry` objects |
| `POST` | `/api/logs/ingest` | Simulates raw log line processing through the pipeline | Body: `{"raw_log": "Jul 26..."}` |
| `GET` | `/api/user-profiles` | Returns UEBA risk scores and user anomaly baselines | Returns profiles for `root`, `admin`, `devuser` |
| `GET` | `/api/analytics` | Returns attack vector frequency and threat origin IPs | Returns chart data arrays for Recharts |
| `GET` | `/api/model-health` | Returns AI model telemetry, loss values, and EPS throughput | Returns model parameters for LogBERT, PyOD, GRL, Dsiem |
| `POST` | `/api/model-health/threshold` | Dynamically updates anomaly threshold in real-time | Body: `{"threshold": 0.55}` |
| `WS` | `/ws/live-stream` | Real-time WebSocket connection broadcasting events every 2 seconds | Pushes `NEW_LOG` payloads and newly generated alarms |

---

## 5. React Frontend SOC Dashboard Architecture

The frontend application ([frontend/](file:///c:/Users/swana/Desktop/Swananada/BTech/Project/honeywell/frontend)) is constructed using React 19, TypeScript, Vite, and Tailwind CSS.

### Component Structure & Functionality

1. **`Sidebar.tsx`**:
   - Collapsible navigation panel (`w-64` expanded to `w-20` collapsed).
   - Module navigation buttons with glowing active states (`shadow-glow-cyan`).
   - Live system pipeline badge showing EPS throughput status.

2. **`Header.tsx`**:
   - Title header and live WebSocket status pill (`LIVE WS CONNECTED` vs `RECONNECTING`).
   - Active threat count badge.
   - **Simulate Log Payload Modal**: Allows analysts to inject custom raw log payloads directly into the live pipeline.

3. **`KPICards.tsx`**:
   - Animated top metric cards: Total Logs Processed, Active Threat Alarms, Critical Severity Alarms, High-Risk Users Flagged, Model Anomaly Rate %, and MTTD Latency (ms).

4. **`OverviewPage.tsx`**:
   - **24-Hour Horizon AreaChart (Recharts)**: Visualizes normal event volume vs model anomalies over time.
   - **Alarm Severity Donut PieChart (Recharts)**: Visual breakout of `CRITICAL`, `HIGH`, `MEDIUM`, and `LOW` alarms.
   - **High Priority Alarms List**: Displays top active alarms with risk score badges.
   - **Real-Time Ingestion Feed Ticker**: Displays live streaming log lines.

5. **`AlertCenterPage.tsx`**:
   - Security Alert Triage Workspace.
   - Search bar, severity filter dropdown, and status filter dropdown.
   - **Interactive Triage Drawer Modal**: Displays full threat intel enrichment, matched directive details, target IP, and analyst action buttons (`Acknowledge`, `Resolve Incident`, `Dismiss False Positive`) which trigger REST updates.

6. **`LiveLogFeedPage.tsx`**:
   - Real-time log table with Event ID badges (`E0`-`E7`).
   - Controls for **Pause Stream / Resume Stream**, text search filter, service category filter, and clear buffer.
   - Expandable log row inspector showing raw message and normalized template attributes.

7. **`UserBehaviorPage.tsx`**:
   - User Entity Behavior Analytics (UEBA) dashboard for accounts (`root`, `admin`, `devuser`, `svc_ci_cd`).
   - Calculated risk score progress bars ($0.0$ to $10.0$).
   - Anomaly counts, failed auth attempts, sudo escalation calls, baseline vs anomalous IP comparison, and risk indicator tags.

8. **`AnalyticsPage.tsx`**:
   - **Top Attack Vectors BarChart (Recharts)**: Visualizes frequency of brute force, invalid user enumeration, and privilege escalation attacks.
   - **Top Threat Origin IPs Table**: Geolocation intelligence, threat levels, and attack counts.

9. **`ModelHealthPage.tsx`**:
   - **Dynamic Anomaly Threshold Slider**: Interactive range input ($0.10$ to $0.95$) that updates the backend threshold in real-time via `POST /api/model-health/threshold`.
   - **Pipeline Telemetry Gauges**: Real-time throughput (EPS), inference latency (ms), and RAM/GPU footprint.
   - **Engine Health Cards**: Detailed status for LogBERT Transformer, PyOD Statistical Ensemble, GRL Domain Adaptor, and Dsiem Directive Engine.

---

## 6. Verification & Demonstration Results

### Unit Test Execution
Running `python test_pipeline.py` executes unit tests covering normal log ingestion, attack sequence detection, correlation directive matching, threat intel lookups, and alarm dispatching:
```
Ran 2 tests in 0.001s
OK
[ALERT DISPATCHED] ID: ALARM-1001 | Severity: HIGH | Risk Score: 10.0/10
```

### Production Build
Running `npm run build` inside `frontend/` compiles TypeScript definitions and bundles assets with zero errors:
```
dist/index.html                   0.45 kB │ gzip:   0.29 kB
dist/assets/index-B2kJ6RE6.css   36.23 kB │ gzip:   6.66 kB
dist/assets/index-Cnn8ubhh.js   635.68 kB │ gzip: 183.21 kB
✓ built in 828ms
```

---

## 7. Instructions to Run the Application

1. **Start the FastAPI Backend Service**:
   ```bash
   uvicorn api_server:app --reload --host 127.0.0.1 --port 8000
   ```
   The backend API will run at `http://127.0.0.1:8000`.

2. **Start the React Frontend SOC Dashboard**:
   ```bash
   cd frontend
   npm run dev
   ```
   Open `http://localhost:5173` in your browser to interact with the dashboard.
