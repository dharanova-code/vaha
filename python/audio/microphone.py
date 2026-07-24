import sounddevice as sd
import numpy as np


class MicrophoneStream:
    """
    sounddevice-based microphone stream.

    The main recording loop (`record_thought`) passes `device` as the
    PyAudio device index.  sounddevice and PyAudio enumerate ALSA devices
    differently, so if the default device index does not work you can
    override it by setting `device` to the correct sounddevice index.

    Current setup: device=1 in sounddevice points to the CS202 USB audio
    interface.  Even though sounddevice reports max_input_channels=0 for
    hw:1,0, PortAudio may still open it successfully through the plug/dsnoop
    ALSA layer depending on the ALSA configuration inside the container.
    If this stream silently returns zeros, switch to device index 9
    (dsnoop_card_0_dev_0_mic) or 10 (plug_card_0_dev_0_mic).
    """

    def __init__(self, device_index, sample_rate=48000, chunk_size=4800):
        self.device_index = device_index
        self.sample_rate = sample_rate
        self.chunk_size = chunk_size
        self._stream = None

    def __enter__(self):
        self._stream = sd.InputStream(
            samplerate=self.sample_rate,
            channels=1,
            dtype="int16",
            blocksize=self.chunk_size,
            device=self.device_index,
        )
        self._stream.start()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        if self._stream:
            self._stream.stop()
            self._stream.close()
            self._stream = None

    def read(self) -> np.ndarray:
        data, _ = self._stream.read(self.chunk_size)
        return np.squeeze(data).astype(np.int16)
