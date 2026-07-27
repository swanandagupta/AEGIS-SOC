from typing import List, Dict, Any

from src.ingestion_parsing.log_normalizer import LogNormalizer, NormalizedEvent
from src.ingestion_parsing.event_abstractor import EventAbstractor, AbstractedEvent
from src.ingestion_parsing.log_parser import LogParser
from src.feature_engineering.feature_store import FeatureStore
from src.feature_engineering.sequence_windowing import SequenceWindowGenerator
from src.feature_engineering.tabular_features import TabularFeatureExtractor
from src.detection_engines.domain_adaptive.domain_rule_checker import DomainRuleChecker
from src.detection_engines.domain_adaptive.grl_domain_adapter import GRLDomainAdapter
from src.detection_engines.statistical.tabular_detector import TabularDetector
from src.detection_engines.statistical.ensemble_aggregator import EnsembleAggregator
from src.detection_engines.deep_sequence.sequence_detector import SequenceDetector
from src.fusion_engine.hybrid_fusion import HybridFusionEngine
from src.fusion_engine.dynamic_threshold import DynamicThresholdTuner
from src.siem_correlation.threat_intel_lookup import ThreatIntelLookup
from src.siem_correlation.correlation_engine import CorrelationEngine
from src.siem_correlation.alarm_generator import AlarmGenerator, SIEMAlarm
from src.alarm_management.alarm_repository import AlarmRepository
from src.alarm_management.alert_dispatcher import AlertDispatcher

class UnifiedPipelineOrchestrator:
    """Master Pipeline Orchestrator running the complete end-to-end unified security log anomaly & SIEM correlation system."""

    def __init__(self, domain: str = "linux"):
        self.domain = domain
        self.log_normalizer = LogNormalizer()
        self.event_abstractor = EventAbstractor()
        self.log_parser = LogParser()
        self.feature_store = FeatureStore()
        self.window_generator = SequenceWindowGenerator(window_size=5, step_size=1)
        self.tabular_extractor = TabularFeatureExtractor()
        
        # Detection engines
        self.rule_checker = DomainRuleChecker()
        self.grl_adapter = GRLDomainAdapter()
        self.tabular_detector = TabularDetector()
        self.ensemble_aggregator = EnsembleAggregator()
        self.sequence_detector = SequenceDetector()
        
        # Fusion & Thresholding
        self.hybrid_fusion = HybridFusionEngine()
        self.threshold_tuner = DynamicThresholdTuner(base_threshold=0.45)
        
        # SIEM Correlation & Alarms
        self.threat_intel = ThreatIntelLookup()
        self.correlation_engine = CorrelationEngine()
        self.alarm_generator = AlarmGenerator()
        self.alarm_repo = AlarmRepository()
        self.alert_dispatcher = AlertDispatcher()

    def process_log_batch(self, raw_log_lines: List[str]) -> List[SIEMAlarm]:
        generated_alarms: List[SIEMAlarm] = []

        for line in raw_log_lines:
            # 1. Ingestion & Normalization
            norm_event = self.log_normalizer.parse(line, log_source=self.domain)
            self.log_parser.parse_template(norm_event.message)
            abs_event = self.event_abstractor.abstract(norm_event)
            self.feature_store.add_event(abs_event)

            # 2. Feature Windowing & Tabular Feature Extraction
            events_list = self.feature_store.get_all_events()
            sequence_windows = self.window_generator.create_windows(events_list)
            latest_window = sequence_windows[-1] if sequence_windows else []
            
            raw_tabular_features = self.tabular_extractor.extract_features(events_list)
            aligned_features = self.grl_adapter.adapt_features(raw_tabular_features, domain=self.domain)

            # 3. Parallel Multi-Engine Anomaly Detection
            rule_res = self.rule_checker.evaluate(events_list)
            rule_score = rule_res.score

            deep_score = self.sequence_detector.predict_anomaly(latest_window)
            stat_score = self.tabular_detector.predict_score(aligned_features)

            # 4. Hybrid Score Fusion & Adaptive Thresholding
            fusion_res = self.hybrid_fusion.fuse(deep_score, stat_score, rule_score)
            is_anomaly, thresh_info = self.threshold_tuner.evaluate(fusion_res.fused_score)

            # 5. Correlation & Threat Intel Alarm Triggering
            if is_anomaly:
                intel_res = self.threat_intel.lookup_ip(norm_event.src_ip)
                directive_match = self.correlation_engine.correlate(
                    src_ip=norm_event.src_ip,
                    dst_ip=norm_event.dst_ip,
                    rule_name=rule_res.rule_name,
                    fused_score=fusion_res.fused_score
                )

                if directive_match:
                    alarm = self.alarm_generator.generate_alarm(directive_match, intel_res, fusion_res.fused_score)
                    self.alarm_repo.save(alarm)
                    self.alert_dispatcher.dispatch(alarm)
                    generated_alarms.append(alarm)

        return generated_alarms
