import os
import numpy as np
import onnxruntime as ort

# Config variables
VAD_THRESHOLD = 0.08
FRAME_MS = 30
SAMPLE_RATE = 16000  # VAD sample rate
BENCHMARK_MODE = False


class SileroVAD:
    def __init__(self, model_path=None, threshold=VAD_THRESHOLD, sample_rate=SAMPLE_RATE):
        if model_path is None:
            model_path = os.path.join(os.path.dirname(__file__), "silero_vad.onnx")
            if not os.path.exists(model_path):
                model_path = "/app/python/audio/silero_vad.onnx"

        # Single-threaded for embedded CPU
        opts = ort.SessionOptions()
        opts.intra_op_num_threads = 1
        opts.inter_op_num_threads = 1
        opts.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_ALL

        self.session = ort.InferenceSession(
            model_path, opts, providers=["CPUExecutionProvider"]
        )
        self.threshold = threshold
        self.sample_rate = sample_rate
        self.reset_states()

    def reset_states(self):
        self._state = np.zeros((2, 1, 128), dtype=np.float32)

    def process_frame(self, frame: np.ndarray):
        """frame: float32, shape (480,), range ±1.0, 16 kHz"""
        inputs = {
            "input": np.expand_dims(frame, axis=0),
            "sr": np.array(self.sample_rate, dtype=np.int64),
            "state": self._state,
        }
        out, stateN = self.session.run(None, inputs)
        self._state = stateN
        prob = float(out[0, 0])
        return prob, prob >= self.threshold


# ── module-level singletons ───────────────────────────────────────────────────
_silero = None
_buffer = np.array([], dtype=np.float32)


def init_audio_pipeline():
    global _silero, _buffer
    if _silero is None:
        _silero = SileroVAD()
    _buffer = np.array([], dtype=np.float32)


def is_speech(audio_frame: np.ndarray) -> bool:
    """
    Accept one chunk of mono audio at 48 000 Hz (int16 or float32 ±1.0).
    Normalise → downsample to 16 kHz → run Silero VAD.

    RNNoise is intentionally skipped until the core Silero pipeline is
    confirmed working; it can be re-enabled once we see non-zero probabilities.
    """
    global _silero, _buffer
    if _silero is None:
        init_audio_pipeline()

    # 1. Normalise to ±1.0 float32
    if audio_frame.dtype == np.int16:
        audio_f = audio_frame.astype(np.float32) / 32768.0
    else:
        audio_f = audio_frame.astype(np.float32)

    rms_raw = float(np.sqrt(np.mean(audio_f ** 2)))

    # 1b. Apply fixed pre-amplification for Silero VAD.
    VAD_GAIN = 40.0
    audio_f = np.clip(audio_f * VAD_GAIN, -1.0, 1.0)

    # 2. Downsample 48 kHz → 16 kHz  (÷3)
    # Block averaging provides a perfect stateless low-pass filter to prevent 
    # aliasing, while completely avoiding the severe edge clicks caused by resample_poly.
    ds = np.mean(audio_f.reshape(-1, 3), axis=1)
    rms_ds = float(np.sqrt(np.mean(ds ** 2)))

    # 3. Rolling buffer → 30 ms (480-sample) Silero chunks
    _buffer = np.concatenate([_buffer, ds])

    probs = []
    is_speech_detected = False
    chunk_size = 480

    import time
    while len(_buffer) >= chunk_size:
        chunk = _buffer[:chunk_size]
        _buffer = _buffer[chunk_size:]
        
        t0 = time.perf_counter()
        prob, flag = _silero.process_frame(chunk)
        t1 = time.perf_counter()
        
        if BENCHMARK_MODE:
            ts = time.time()
            proc_ms = (t1 - t0) * 1000.0
            print(f"[VAD_BENCHMARK] {ts:.3f},{prob:.4f},{flag},{proc_ms:.2f}", flush=True)
            
        probs.append(prob)
        if flag:
            is_speech_detected = True

    final_prob = max(probs) if probs else 0.0

    # Per-stage RMS helps diagnose where signal is lost
    print(
        f"[VAD] rms_raw={rms_raw:.4f} rms_ds={rms_ds:.4f} "
        f"probability={final_prob:.2f} speech={is_speech_detected}",
        flush=True,
    )

    return is_speech_detected


def reset_vad():
    global _silero, _buffer
    if _silero is not None:
        _silero.reset_states()
    _buffer = np.array([], dtype=np.float32)
