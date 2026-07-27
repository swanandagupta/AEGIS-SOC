from typing import List, Dict

class EnsembleAggregator:
    """Combines multiple outlier detection model scores using PyOD ensemble methods (Average, Max, AOM, MOA)."""

    def aggregate(self, scores: List[float], method: str = "max") -> float:
        if not scores:
            return 0.0

        if method == "max":
            return max(scores)
        elif method == "average":
            return sum(scores) / len(scores)
        elif method == "aom":  # Average of Maximums
            half = max(1, len(scores) // 2)
            sorted_scores = sorted(scores, reverse=True)
            return sum(sorted_scores[:half]) / half
        else:
            return max(scores)
