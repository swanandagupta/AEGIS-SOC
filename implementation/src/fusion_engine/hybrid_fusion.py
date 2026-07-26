from dataclasses import dataclass

@dataclass
class HybridScoreResult:
    fused_score: float
    deep_seq_score: float
    stat_score: float
    rule_score: float

class HybridFusionEngine:
    """Combines Deep Learning, Statistical Outlier, and Domain Rule scores into a single weighted hybrid score."""

    def __init__(self, w_deep: float = 0.35, w_stat: float = 0.35, w_rule: float = 0.30):
        self.w_deep = w_deep
        self.w_stat = w_stat
        self.w_rule = w_rule

    def fuse(self, deep_score: float, stat_score: float, rule_score: float) -> HybridScoreResult:
        # If domain rule is strongly triggered (>= 0.8), boost fusion score
        boost = 0.15 if rule_score >= 0.8 else 0.0
        fused = (self.w_deep * deep_score) + (self.w_stat * stat_score) + (self.w_rule * rule_score) + boost
        fused = min(1.0, max(0.0, fused))
        return HybridScoreResult(
            fused_score=fused,
            deep_seq_score=deep_score,
            stat_score=stat_score,
            rule_score=rule_score
        )
