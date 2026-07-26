import math
from typing import Dict, List

class GRLDomainAdapter:
    """Domain adaptation feature projector using Gradient Reversal concepts for cross-system log invariant representations."""

    def __init__(self, alpha: float = 1.0):
        self.alpha = alpha

    def adapt_features(self, features: Dict[str, float], domain: str = "linux") -> Dict[str, float]:
        # Scale features based on domain factor to simulate domain-invariant alignment
        domain_weights = {
            "linux": 1.0,
            "windows": 1.15,
            "hdfs": 0.85,
            "bgl": 0.90
        }
        scale = domain_weights.get(domain.lower(), 1.0)
        return {k: v * scale for k, v in features.items()}
