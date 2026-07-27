# Unified Security Log Anomaly Detection Platform & Modern SOC Dashboard

[![Python Version](https://img.shields.io/badge/python-3.8%2B-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-1.0.0-009688.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-3178C6.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC.svg)](https://tailwindcss.com/)

A unified, end-to-end cybersecurity log anomaly detection and Security Information and Event Management (SIEM) correlation platform. The system synthesizes 4 reference repositories into a unified multi-engine detection backend, a FastAPI REST & WebSocket streaming server, and a dark-themed React + TypeScript + Tailwind CSS SOC Dashboard.

---

## 📑 Table of Contents

- [Overview & Architecture](#-overview--architecture)
- [Reference Repositories Mapping](#-reference-repositories-mapping)
- [Key Features](#-key-features)
- [Project Folder Structure](#-project-folder-structure)
- [Technology Stack](#-technology-stack)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
  - [1. Installation](#1-installation)
  - [2. Start Backend API Server](#2-start-backend-api-server)
  - [3. Start React SOC Dashboard](#3-start-react-soc-dashboard)
- [API Endpoint Reference](#-api-endpoint-reference)
- [Testing](#-testing)
- [License](#-license)

---

## 🛡️ Overview & Architecture

Modern enterprise infrastructures generate vast volumes of heterogeneous logs (Linux syslog, auth.log, Windows Event Logs, HDFS, Cloud Audit Logs). Manual inspection is unfeasible, while single-model detection systems often suffer from high false-positive rates or miss novel multi-step attack patterns.

This platform combines **self-supervised sequence deep learning**, **multivariate statistical outlier detection**, **cross-system domain adaptation**, and **stateful OSSIM correlation directives** into a single weighted hybrid scoring pipeline.

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

## 🔗 Reference Repositories Mapping

| Reference Repository | Unified Architecture Modules & Roles | Key Inspiration & Responsibilities |
| :--- | :--- | :--- |
| [dsiem-master](file:///c:/Users/swana/Desktop/Swananada/BTech/Project/honeywell/dsiem-master) | [correlation_engine.py](file:///c:/Users/swana/Desktop/Swananada/BTech/Project/honeywell/src/siem_correlation/correlation_engine.py)<br>[threat_intel_lookup.py](file:///c:/Users/swana/Desktop/Swananada/BTech/Project/honeywell/src/siem_correlation/threat_intel_lookup.py)<br>[alarm_generator.py](file:///c:/Users/swana/Desktop/Swananada/BTech/Project/honeywell/src/siem_correlation/alarm_generator.py) | Stateful OSSIM correlation rules, threat intelligence lookups (WISE / AlienVault OTX), risk-adjusted alarm generation (`0.0`-`10.0`), and analyst triage states. |
| [logbert-main](file:///c:/Users/swana/Desktop/Swananada/BTech/Project/honeywell/logbert-main) | [log_parser.py](file:///c:/Users/swana/Desktop/Swananada/BTech/Project/honeywell/src/ingestion_parsing/log_parser.py)<br>[sequence_windowing.py](file:///c:/Users/swana/Desktop/Swananada/BTech/Project/honeywell/src/feature_engineering/sequence_windowing.py)<br>[sequence_detector.py](file:///c:/Users/swana/Desktop/Swananada/BTech/Project/honeywell/src/detection_engines/deep_sequence/sequence_detector.py) | Log template mining via Drain algorithm, vocabulary building, sliding sequence window generation, and self-supervised Transformer sequence surprise scoring. |
| [hybrid-log-anomaly-detection-main](file:///c:/Users/swana/Desktop/Swananada/BTech/Project/honeywell/hybrid-log-anomaly-detection-main) | [event_abstractor.py](file:///c:/Users/swana/Desktop/Swananada/BTech/Project/honeywell/src/ingestion_parsing/event_abstractor.py)<br>[domain_rule_checker.py](file:///c:/Users/swana/Desktop/Swananada/BTech/Project/honeywell/src/detection_engines/domain_adaptive/domain_rule_checker.py)<br>[grl_domain_adapter.py](file:///c:/Users/swana/Desktop/Swananada/BTech/Project/honeywell/src/detection_engines/domain_adaptive/grl_domain_adapter.py) | Discrete event abstraction (`E0`-`E7`), domain cybersecurity rules (brute-force, invalid user enumeration, sudo escalation), and Gradient Reversal Layer (GRL) representation scaling. |
| [pyod-master](file:///c:/Users/swana/Desktop/Swananada/BTech/Project/honeywell/pyod-master) | [tabular_detector.py](file:///c:/Users/swana/Desktop/Swananada/BTech/Project/honeywell/src/detection_engines/statistical/tabular_detector.py)<br>[ensemble_aggregator.py](file:///c:/Users/swana/Desktop/Swananada/BTech/Project/honeywell/src/detection_engines/statistical/ensemble_aggregator.py) | Multivariate statistical outlier detection (ECOD, COPOD, Isolation Forest) and score aggregation ensembles (Average of Maximums). |

---

## ✨ Key Features

- **Multi-Engine Parallel Detection**: Evaluates raw log events simultaneously across sequence models, statistical z-scores, and cybersecurity rules.
- **Weighted Hybrid Score Fusion**: Combines scores into a unified hybrid metric:
  $$\text{FusedScore} = (0.35 \times S_{\text{deep}}) + (0.35 \times S_{\text{stat}}) + (0.30 \times S_{\text{rule}}) + \text{Boost}$$
- **Interactive Dynamic Threshold Tuner**: Dynamically adjust anomaly sensitivity from $0.10$ to $0.95$ directly from the frontend UI via REST API.
- **Stateful SIEM Correlation Directives**: Matches anomalous events against correlation rules (`DIR_AUTHENTICATION_ATTACK_SERIES`) tracking IP pairs.
- **Threat Intelligence Enrichment**: Enriches alarms with indicator reputation, threat category, and target metadata.
- **Real-Time WebSocket Streaming**: Stream log events and generated alarms live to the frontend every 2 seconds.
- **Modern Cyber-Themed Dashboard**:
  - **Collapsible Sidebar**: Compact/expanded navigation with glowing cyber indicators.
  - **Top KPI Cards**: Total Logs, Active Threats, Critical Alarms, High Risk Users, Model Anomaly Rate %, MTTD Latency (ms).
  - **SOC Overview**: 24-hour log vs anomaly AreaChart (Recharts), alarm severity donut chart, and live ticker.
  - **Alert Center & Triage Modal**: Filter alarms by severity/status and execute analyst triage actions (`Acknowledge`, `Resolve`, `Dismiss`).
  - **Live Log Feed Table**: Real-time auto-scroll log stream with search, service filters, pause/resume, and expandable raw log inspector.
  - **User Entity Behavior Analytics (UEBA)**: Track high-risk user profiles (`root`, `admin`, `devuser`), risk score progress bars, and baseline IPs.
  - **Threat Intelligence Analytics**: Attack vector distributions and top threat origin IPs.
  - **AI Model Health**: Real-time throughput EPS gauges, inference latency, memory footprint, and engine telemetry.

---

## 📁 Project Folder Structure

```
honeywell/
├── src/                                  # Core Detection Engine Architecture
│   ├── ingestion_parsing/
│   │   ├── log_normalizer.py            # Normalizes raw logs into standard schema
│   │   ├── event_abstractor.py          # Categorizes logs into Event IDs (E0-E7)
│   │   └── log_parser.py                # Drain log template miner & vocab builder
│   ├── feature_engineering/
│   │   ├── feature_store.py             # Real-time event queue and buffer
│   │   ├── sequence_windowing.py        # Sequence window generator for LogBERT
│   │   └── tabular_features.py          # Feature vector extractor for PyOD
│   ├── detection_engines/
│   │   ├── deep_sequence/
│   │   │   ├── transformer_model.py     # Self-supervised Transformer architecture
│   │   │   └── sequence_detector.py     # Sequence surprise score calculator
│   │   ├── statistical/
│   │   │   ├── tabular_detector.py      # Multivariate outlier z-score detector
│   │   │   └── ensemble_aggregator.py   # PyOD score ensemble aggregator (AOM)
│   │   └── domain_adaptive/
│   │       ├── domain_rule_checker.py   # Cybersecurity domain heuristic checker
│   │       └── grl_domain_adapter.py    # GRL domain transfer feature adapter
│   ├── fusion_engine/
│   │   ├── score_normalizer.py          # Score normalization scaling
│   │   ├── hybrid_fusion.py             # Weighted hybrid score fusion
│   │   └── dynamic_threshold.py         # Adaptive threshold tuner
│   ├── siem_correlation/
│   │   ├── correlation_engine.py        # Stateful OSSIM correlation directives
│   │   ├── threat_intel_lookup.py       # Wise / AlienVault threat lookup plugin
│   │   └── alarm_generator.py           # Risk-adjusted SIEM alarm builder
│   ├── alarm_management/
│   │   ├── alarm_repository.py          # Alarm storage repository
│   │   └── alert_dispatcher.py          # SOC alert dispatcher
│   └── orchestrator/
│       └── pipeline_controller.py       # Master pipeline orchestrator
│
├── frontend/                             # Modern React + TypeScript SOC Dashboard
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.tsx              # Collapsible sidebar navigation
│   │   │   ├── Header.tsx               # Header bar & log simulation modal
│   │   │   ├── KPICards.tsx             # Metric KPI cards
│   │   │   ├── OverviewPage.tsx         # Recharts charts & main overview
│   │   │   ├── AlertCenterPage.tsx      # Triage workspace & detail drawer modal
│   │   │   ├── LiveLogFeedPage.tsx      # Live streaming log feed table
│   │   │   ├── UserBehaviorPage.tsx     # UEBA user risk profiles
│   │   │   ├── AnalyticsPage.tsx        # Attack vector & threat origin charts
│   │   │   └── ModelHealthPage.tsx      # Engine health & threshold slider
│   │   ├── types.ts                     # TypeScript data interfaces
│   │   ├── App.tsx                      # App router & REST/WebSocket manager
│   │   ├── main.tsx                     # React entrypoint
│   │   └── index.css                    # Tailwind CSS v4 styling & dark theme
│   ├── package.json
│   ├── vite.config.ts
│   └── postcss.config.js
│
├── api_server.py                         # FastAPI REST & WebSocket Backend Server
├── test_pipeline.py                      # Pipeline unit test suite
├── main.py                               # Terminal demo execution script
└── README.md                             # Project documentation
```

---

## 🛠️ Technology Stack

### Backend Pipeline & Server
- **Python 3.8+**: Core language runtime
- **FastAPI**: Asynchronous REST & WebSocket server framework
- **Uvicorn**: ASGI web server
- **Pydantic**: Data validation and schema definitions

### Frontend Dashboard
- **React 19**: Modern UI library
- **TypeScript**: Static typing and interface enforcement
- **Vite 8**: Rapid frontend build tooling
- **Tailwind CSS v4**: Utility-first cybersecurity dark design system
- **Recharts**: Data visualization charts (AreaChart, PieChart, BarChart)
- **Lucide React**: Modern icon set

---

## ⚙️ Prerequisites

- **Python 3.8+**
- **Node.js v18+** & **npm v9+**

---

## 🚀 Getting Started

### 1. Installation

Clone the repository and install dependencies:

```bash
# Clone the repository
git clone https://github.com/swananada/honeywell-siem-anomaly.git
cd honeywell

# Install Python requirements (if virtual environment is preferred)
pip install fastapi uvicorn websockets pydantic

# Install Frontend NPM dependencies
cd frontend
npm install
cd ..
```

---

### 2. Start Backend API Server

Run the FastAPI backend server:

```bash
uvicorn api_server:app --reload --host 127.0.0.1 --port 8000
```
The REST API will be available at `http://127.0.0.1:8000` (Swagger docs at `http://127.0.0.1:8000/docs`).

---

### 3. Start React SOC Dashboard

In a new terminal window, launch the frontend Vite development server:

```bash
cd frontend
npm run dev
```

Open `http://localhost:5173` in your browser to view the live dashboard.

---

## 📡 API Endpoint Reference

### REST Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/kpis` | Summary metrics (total logs, active threats, critical alarms, MTTD) |
| `GET` | `/api/alarms` | Returns SIEM alarms (supports `status` and `severity` filters) |
| `PUT` | `/api/alarms/{alarm_id}/status` | Updates alarm triage status (`OPEN`, `ACKNOWLEDGED`, `RESOLVED`, `DISMISSED`) |
| `GET` | `/api/logs` | Fetches recent normalized ingestion log history |
| `POST` | `/api/logs/ingest` | Simulates raw log line evaluation through the full pipeline |
| `GET` | `/api/user-profiles` | Returns UEBA risk scores and user anomaly baselines |
| `GET` | `/api/analytics` | Returns attack vector frequency and threat origin IPs |
| `GET` | `/api/model-health` | Returns AI model telemetry, loss values, and EPS throughput |
| `POST` | `/api/model-health/threshold` | Dynamically updates anomaly threshold sensitivity |

### WebSocket Endpoint

- `WS /ws/live-stream`: Real-time WebSocket connection broadcasting log events (`NEW_LOG`) and new alarms every 2 seconds.

---

## 🧪 Testing

Run the automated backend test suite:

```bash
python test_pipeline.py
```

Expected Output:
```
Ran 2 tests in 0.001s

OK
[ALERT DISPATCHED] ID: ALARM-1001 | Severity: HIGH | Risk Score: 10.0/10
```

To test the frontend production build:

```bash
cd frontend
npm run build
```

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for details.
