import os
import ctypes
import numpy as np

class RNNoise:
    def __init__(self):
        # Locate the shared library in the same directory
        lib_path = os.path.join(os.path.dirname(__file__), "librnnoise.so")
        if not os.path.exists(lib_path):
            # Fallback to standard library locations or try /app/python/audio/librnnoise.so
            lib_path = "/app/python/audio/librnnoise.so"
            
        if not os.path.exists(lib_path):
            raise FileNotFoundError(f"librnnoise.so not found at {lib_path}")

        self.lib = ctypes.CDLL(lib_path)

        # Define signatures
        self.lib.rnnoise_create.argtypes = [ctypes.c_void_p]
        self.lib.rnnoise_create.restype = ctypes.c_void_p

        self.lib.rnnoise_process_frame.argtypes = [
            ctypes.c_void_p,
            ctypes.POINTER(ctypes.c_float),
            ctypes.POINTER(ctypes.c_float)
        ]
        self.lib.rnnoise_process_frame.restype = ctypes.c_float

        self.lib.rnnoise_destroy.argtypes = [ctypes.c_void_p]
        self.lib.rnnoise_destroy.restype = None

        # Create state using default model (NULL)
        self.state = self.lib.rnnoise_create(None)
        if not self.state:
            raise RuntimeError("Failed to create RNNoise state")

    def process_frame(self, frame_float32: np.ndarray) -> np.ndarray:
        """
        Processes a 10ms frame of 480 float32 samples at 48000Hz.
        Returns the denoised float32 array.
        """
        assert len(frame_float32) == 480, f"RNNoise expects 480 samples (10ms at 48kHz), got {len(frame_float32)}"
        
        # Ensure it is float32 and contiguous
        frame_float32 = np.ascontiguousarray(frame_float32, dtype=np.float32)
        
        # Create output buffer
        out_frame = np.zeros(480, dtype=np.float32)
        
        in_ptr = frame_float32.ctypes.data_as(ctypes.POINTER(ctypes.c_float))
        out_ptr = out_frame.ctypes.data_as(ctypes.POINTER(ctypes.c_float))
        
        # Process
        self.lib.rnnoise_process_frame(self.state, out_ptr, in_ptr)
        
        return out_frame

    def __del__(self):
        if hasattr(self, 'lib') and hasattr(self, 'state') and self.state:
            self.lib.rnnoise_destroy(self.state)
            self.state = None
