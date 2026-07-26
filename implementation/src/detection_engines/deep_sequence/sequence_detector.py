from typing import List
from src.detection_engines.deep_sequence.transformer_model import TransformerModel

class SequenceDetector:
    """LogBERT sequential surprise anomaly score calculator."""

    def __init__(self):
        self.model = TransformerModel()

    def predict_anomaly(self, sequence_window: List[str]) -> float:
        if not sequence_window:
            return 0.0
        return self.model.predict_mask_probability(sequence_window)
