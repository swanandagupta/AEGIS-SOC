class ScoreNormalizer:
    """Normalizes raw scores from different engines to a uniform [0.0, 1.0] range."""

    @staticmethod
    def normalize(score: float, score_type: str = "generic") -> float:
        if score_type == "rule":
            return min(1.0, max(0.0, score))
        elif score_type == "sequence":
            return min(1.0, max(0.0, score * 1.2))
        elif score_type == "statistical":
            return min(1.0, max(0.0, score))
        return min(1.0, max(0.0, score))
