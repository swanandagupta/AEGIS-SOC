from typing import List, Dict

class TransformerModel:
    """Lightweight self-supervised Transformer sequence model simulator inspired by LogBERT."""

    def __init__(self, vocab_size: int = 100):
        self.vocab_size = vocab_size

    def predict_mask_probability(self, sequence_window: List[str]) -> float:
        # Evaluates sequence transition anomaly / surprise score
        # Normal sequences: E0 -> E2 -> E5 -> E0 or E0 -> E7 -> E2
        # Abnormal: repetitive E1 or E4 or out-of-order E4 -> E3 -> E1
        normal_transitions = {
            ("E0", "E0"), ("E0", "E2"), ("E2", "E5"), ("E5", "E0"),
            ("E0", "E7"), ("E7", "E2"), ("E0", "E6"), ("E6", "E0")
        }

        surprises = 0
        total_transitions = max(1, len(sequence_window) - 1)

        for i in range(len(sequence_window) - 1):
            pair = (sequence_window[i], sequence_window[i+1])
            if pair not in normal_transitions:
                surprises += 1

        surprise_rate = surprises / total_transitions
        return surprise_rate
