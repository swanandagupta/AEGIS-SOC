import re
from typing import Dict, Tuple, List

class LogParser:
    """Log template miner inspired by Drain / LogParser."""

    def __init__(self):
        self.template_to_id: Dict[str, int] = {"<PAD>": 0, "<UNK>": 1}
        self.id_to_template: Dict[int, str] = {0: "<PAD>", 1: "<UNK>"}
        self.next_id = 2

    def _mask_variables(self, text: str) -> str:
        # Replace IP addresses
        text = re.sub(r'\b(?:\d{1,3}\.){3}\d{1,3}\b', '<IP>', text)
        # Replace numbers / ports
        text = re.sub(r'\b\d+\b', '<NUM>', text)
        return text

    def parse_template(self, message: str) -> Tuple[int, str]:
        template = self._mask_variables(message)
        if template not in self.template_to_id:
            tid = self.next_id
            self.template_to_id[template] = tid
            self.id_to_template[tid] = template
            self.next_id += 1
        else:
            tid = self.template_to_id[template]
        return tid, template

    def get_vocab_size(self) -> int:
        return len(self.template_to_id)
