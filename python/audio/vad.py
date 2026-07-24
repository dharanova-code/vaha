import numpy as np

# Config variables
RMS_THRESHOLD = 0.005
FRAME_MS = 30
SAMPLE_RATE = 48000


def init_audio_pipeline():
    pass


def is_speech(audio_frame: np.ndarray) -> bool:
    """
    Accept one chunk of mono audio at 48 000 Hz (int16 or float32 ±1.0).
    Calculate RMS energy and compare to threshold.
    """
    # 1. Normalise to ±1.0 float32 if int16
    if audio_frame.dtype == np.int16:
        audio_f = audio_frame.astype(np.float32) / 32768.0
    else:
        audio_f = audio_frame.astype(np.float32)

    # 2. Calculate RMS
    rms = float(np.sqrt(np.mean(audio_f ** 2)))

    is_speech_detected = rms >= RMS_THRESHOLD

    print(
        f"[VAD] rms={rms:.4f} threshold={RMS_THRESHOLD:.4f} speech={is_speech_detected}",
        flush=True,
    )

    return is_speech_detected


def reset_vad():
    pass
