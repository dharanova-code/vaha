import os
import sys
import time
import numpy as np

class EdgeImpulseInference:
    def __init__(self, model_path: str):
        self.model_path = model_path
        self.runner = None
        self.labels = []
        self._load_model()
        
    def _load_model(self):
        print(f"[info] [EdgeImpulseInference] Loading model from {self.model_path}...", flush=True)
        t_start = time.time()
        
        # Ensure Edge Impulse Linux SDK is installed/importable
        try:
            from edge_impulse_linux.runner import ImpulseRunner
        except ImportError:
            print("[warn] [EdgeImpulseInference] edge_impulse_linux SDK not found. Attempting to install...", flush=True)
            import subprocess
            try:
                subprocess.run([sys.executable, "-m", "pip", "install", "edge-impulse-linux"], check=True)
                print("[info] [EdgeImpulseInference] edge-impulse-linux installed successfully.", flush=True)
            except Exception as e:
                print(f"[error] [EdgeImpulseInference] Failed to install edge-impulse-linux: {e}", flush=True)
            from edge_impulse_linux.runner import ImpulseRunner
            
        self.runner = ImpulseRunner(self.model_path)
        try:
            model_info = self.runner.init()
            self.labels = model_info['model_parameters']['labels']
            print(f"[info] [EdgeImpulseInference] Model loaded successfully in {time.time() - t_start:.2f}s. Labels: {self.labels}", flush=True)
        except Exception as e:
            print(f"[error] [EdgeImpulseInference] Failed to initialize model runner: {e}", flush=True)
            raise e

    def classify(self, audio_features: list) -> tuple:
        """
        Runs inference on audio features list.
        Returns (predicted_label, confidence_score, latency_ms)
        """
        if self.runner is None:
            raise RuntimeError("Model is not loaded")
            
        t_start = time.time()
        res = self.runner.classify(audio_features)
        latency_ms = (time.time() - t_start) * 1000
        
        classification = res['result']['classification']
        
        # Find the highest scoring label
        best_label = None
        best_score = -1.0
        for label, score in classification.items():
            if score > best_score:
                best_score = score
                best_label = label
                
        return best_label, best_score, latency_ms

    def close(self):
        if self.runner:
            self.runner.stop()
            self.runner = None
