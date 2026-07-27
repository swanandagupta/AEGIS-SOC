import math
from typing import Dict, List

class TabularDetector:
    """Multivariate statistical outlier detector inspired by PyOD (ECOD/COPOD/IForest)."""

    def __init__(self):
        # Baseline normal mean/std for features
        self.feature_means = {"fail_count": 0.2, "failure_ratio": 0.05, "invalid_user_count": 0.05}
        self.feature_stds = {"fail_count": 0.5, "failure_ratio": 0.1, "invalid_user_count": 0.2}

    def predict_score(self, features: Dict[str, float]) -> float:
        z_scores = []
        for key in ["fail_count", "failure_ratio", "invalid_user_count"]:
            val = features.get(key, 0.0)
            mean = self.feature_means.get(key, 0.1)
            std = self.feature_stds.get(key, 0.5)
            z = (val - mean) / (std if std > 0 else 1.0)
            z_scores.append(max(0.0, z))

        # Combine z-scores using max/average (COPOD/ECOD style)
        avg_z = sum(z_scores) / len(z_scores) if z_scores else 0.0
        # Sigmoid normalization to [0, 1]
        score = 1.0 / (1.0 + math.exp(-avg_z + 2.0))
        return min(1.0, max(0.0, score))
