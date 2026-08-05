import sys, os
from pathlib import Path
from dotenv import load_dotenv

# Locating python/.env properly using pathlib project-relative paths
_script_dir = Path(__file__).resolve().parent
_env_candidates = [
    _script_dir / ".env",
    _script_dir.parent / ".env",
    Path("/app/python/.env"),
    Path("/app/.env"),
]
_env_loaded = False
for _path in _env_candidates:
    if _path.exists():
        load_dotenv(str(_path))
        _env_loaded = True
        break
if not _env_loaded:
    load_dotenv()

sys.path.insert(0, "/app/wheels")
os.chdir('/app')

import re, subprocess, time, math, socket, glob
from datetime import datetime, timezone, timedelta

import numpy as np
import sounddevice as sd
import pyaudio
import noisereduce as nr
from scipy.signal import resample_poly
from notion_client import Client
from edge_impulse_linux.runner import ImpulseRunner
from arduino.app_utils import App, Bridge
import audio

# ─── CONFIG ───────────────────────────────────────────────────────────────────
SAMPLE_RATE        = 48000
MODEL_RATE         = 16000
CHUNK_MS           = 100
CHUNK_SIZE         = int(SAMPLE_RATE * CHUNK_MS / 1000)
RMS_THRESHOLD      = 300
FIRST_SILENCE_S    = 3.0
SECOND_SILENCE_S   = 7.0
MAX_RECORD_S       = 600
NO_SPEECH_GIVEUP_S = 7.0
NOTION_TOKEN       = os.environ.get("NOTION_TOKEN","")
NOTION_DB_ID       = os.environ.get("NOTION_DATABASE_ID","")
NOTION_SYNC_ENABLED = False
NOTES_FILE         = "/app/notes.txt"
PIPER_EXE          = "/app/piper/piper"
PIPER_MODEL        = "/app/models/piper/en_US-lessac-medium.onnx"
WHISPER_MODEL_DIR  = "/app/models/faster-whisper"
EIM_PATH           = os.environ.get("EIM_PATH", "models/new-marvin.eim")
STOP_KEYWORD       = os.environ.get("STOP_KEYWORD", "im_done")
STOP_THRESHOLD     = float(os.environ.get("STOP_THRESHOLD", "0.75"))
STOP_CONSEC        = int(os.environ.get("STOP_CONSEC", "2"))
MIC_RATE           = 48000
PYAUDIO_DEV      = 1  # CS202 mic
WAKE_THRESHOLD     = 0.85
WAKE_CONSEC        = 3
WAKE_COOLDOWN      = 3.0
STOP_PHRASES       = ["i'm done","im done","that's all","thats all","that is all"]

READ_PHRASES       = ["read my notes","read my note","read my thoughts","read back"]

# ─── TIMESTAMPS ───────────────────────────────────────────────────────────────
def _ts():
    IST = timezone(timedelta(hours=5, minutes=30))
    now = datetime.now(IST)
    return now.strftime("%H:%M:%S.") + f"{now.microsecond//1000:03d} IST "

# ─── MIC ──────────────────────────────────────────────────────────────────────
def find_best_mic():
    return PYAUDIO_DEV  # CS202 mic (hw:1,0)

# ─── SPEAK ────────────────────────────────────────────────────────────────────
def find_speaker_device():
    """Find the ALSA device string for the USB audio output by name."""
    import subprocess
    result = subprocess.run(["aplay","-l"], capture_output=True, text=True)
    for line in result.stdout.splitlines():
        if "CS202" in line or "USB Audio" in line:
            # Extract card number
            import re
            m = re.search(r"card (\d+)", line)
            if m:
                return f"plughw:Device,0"  # Generalplus by name
    return "plughw:Device,0"  # fallback by name

GLOBAL_TTS_TIME = 0.0

def speak(text):
    global GLOBAL_TTS_TIME
    start_tts = time.time()
    try:
        _speak_impl(text)
    finally:
        GLOBAL_TTS_TIME += time.time() - start_tts

def _speak_impl(text):
    if not text:
        return
    print(f"[info] [speak] TTS generation started: '{text}'", flush=True)
    if not os.path.exists(PIPER_EXE):
        print(f"[error] [speak] Piper executable not found at {PIPER_EXE}", flush=True)
        return
    
    tmp_path = None
    boosted = None
    try:
        import tempfile
        import wave
        import array
        
        device = find_speaker_device()
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
            tmp_path = tmp.name
        
        # Run Piper TTS
        print(f"[info] [speak] Generating audio with Piper at {tmp_path}", flush=True)
        piper_cmd = [PIPER_EXE, "--model", PIPER_MODEL, "--output_file", tmp_path]
        p_res = subprocess.run(piper_cmd, input=text.encode(), capture_output=True)
        if p_res.returncode != 0:
            print(f"[error] [speak] Piper failed with code {p_res.returncode}. stderr: {p_res.stderr.decode()}", flush=True)
            return
            
        if not os.path.exists(tmp_path) or os.path.getsize(tmp_path) == 0:
            print(f"[error] [speak] Generated WAV file is missing or empty.", flush=True)
            return

        # Boost volume 3x and compute duration
        boosted = tmp_path.replace(".wav", "_boosted.wav")
        duration = 0.0
        try:
            with wave.open(tmp_path, 'rb') as wf:
                params = wf.getparams()
                frames = wf.readframes(wf.getnframes())
                n_frames = wf.getnframes()
                frate = wf.getframerate()
                duration = n_frames / float(frate) if frate > 0 else 0.0
            print(f"[info] [speak] Generated audio path: {tmp_path} (Duration: {duration:.2f}s)", flush=True)
            
            samples = array.array('h', frames)
            boosted_samples = array.array('h', [max(-32768, min(32767, int(s * 3.0))) for s in samples])
            with wave.open(boosted, 'wb') as wf:
                wf.setparams(params)
                wf.writeframes(boosted_samples.tobytes())
            play_file = boosted
            print(f"[info] [speak] Boosted volume 3x saved to {boosted}", flush=True)
        except Exception as e:
            print(f"[warn] [speak] Volume boosting failed: {e}. Falling back to raw TTS file.", flush=True)
            play_file = tmp_path

        # Playback using aplay
        aplay_cmd = ["aplay", "-D", device, "-q", play_file]
        print(f"[info] [speak] Playback command: {' '.join(aplay_cmd)}", flush=True)
        ap_res = subprocess.run(aplay_cmd, capture_output=True)
        
        print(f"[info] [speak] Playback exit code: {ap_res.returncode}", flush=True)
        if ap_res.returncode != 0:
            print(f"[error] [speak] Playback failed. stderr: {ap_res.stderr.decode()}", flush=True)
            print(f"[info] [speak] Attempting fallback play via piped stdin (like play_chime)...", flush=True)
            # Fallback to direct stdin piped play if raw file playback fails
            try:
                with wave.open(play_file, 'rb') as wf:
                    rate = wf.getframerate()
                    channels = wf.getnchannels()
                    frames = wf.readframes(wf.getnframes())
                proc = subprocess.Popen(["aplay", "-D", device,
                                          "-r", str(rate), "-f", "S16_LE", "-c", str(channels), "-q"],
                                         stdin=subprocess.PIPE)
                proc.stdin.write(frames)
                proc.stdin.close()
                fallback_code = proc.wait()
                print(f"[info] [speak] Fallback playback exit code: {fallback_code}", flush=True)
            except Exception as fe:
                print(f"[error] [speak] Fallback playback failed: {fe}", flush=True)
        else:
            print(f"[info] [speak] Playback finished successfully.", flush=True)
            
    except Exception as e:
        print(f"[error] [speak] General error in speak: {e}", flush=True)
    finally:
        if tmp_path and os.path.exists(tmp_path):
            try: os.unlink(tmp_path)
            except: pass
        if boosted and os.path.exists(boosted):
            try: os.unlink(boosted)
            except: pass

# ─── NOISE ────────────────────────────────────────────────────────────────────
def clean_audio(audio, sr=MODEL_RATE):
    if audio.size < 512: return audio
    was_int16 = audio.dtype == np.int16
    f = audio.astype(np.float32) / (32768. if was_int16 else 1.)
    n_fft = 512 if audio.size < 4096 else 1024
    y_noise = f[:sr//2] if len(f) >= sr else None
    r = nr.reduce_noise(y=f, sr=sr, y_noise=y_noise, stationary=True,
                        n_fft=n_fft, prop_decrease=0.75)
    if was_int16:
        return np.clip(r*32768,-32768,32767).astype(np.int16)
    return r

# ─── WHISPER ──────────────────────────────────────────────────────────────────
_whisper = None
def get_whisper():
    global _whisper
    if _whisper is None:
        from faster_whisper import WhisperModel
        print(f"{_ts()}[transcribe] Loading faster-whisper small...", flush=True)
        _whisper = WhisperModel("small", device="cpu", compute_type="int8",
                                download_root=WHISPER_MODEL_DIR)
        print(f"{_ts()}[transcribe] Whisper ready", flush=True)
    return _whisper

FILLERS = ["um","uh","uhh","umm","hmm"]
def transcribe(audio):
    if audio.size == 0: return ""
    audio = clean_audio(audio)
    if audio.dtype == np.int16:
        audio = audio.astype(np.float32) / 32768.
    try:
        model = get_whisper()
        segments, _ = model.transcribe(audio, language="en", vad_filter=False)
        raw = " ".join(s.text.strip() for s in segments).strip()
        print(f'[transcribe] result: {raw}', flush=True)
    except Exception as e:
        print(f"[transcribe] error: {e}", flush=True)
        return ""
    for f in FILLERS:
        raw = re.sub(rf"\b{f}\b[,]?\s*"," ",raw,flags=re.IGNORECASE)
    raw = re.sub(r"\s{2,}"," ",raw).strip(" ,")
    if not raw: return ""
    raw = raw[0].upper()+raw[1:]
    if raw[-1] not in ".!?": raw += "."
    return raw

# ─── SENSORS ──────────────────────────────────────────────────────────────────
def get_sensors():
    try:
        raw = Bridge.call('sensors_get')
        tokens = raw.split(':')
        data = {}
        for i in range(0, len(tokens)-1, 2):
            data[tokens[i]] = tokens[i+1]
        return {
            'temp':        float(data['T']) if data.get('T','nan')!='nan' else None,
            'humidity':    float(data['H']) if data.get('H','nan')!='nan' else None,
            'flow_lpm':    float(data.get('F',0)),
            'total_liters':float(data.get('L',0)),
            'tvoc_ppb':    int(data.get('V',0))
        }
    except Exception as e:
        print(f"[sensors] {e}", flush=True)
        return None

# ─── NOTION ───────────────────────────────────────────────────────────────────
def _notion_client():
    return Client(auth=NOTION_TOKEN)

def _sensor_line(s):
    if not s: return ""
    parts = []
    if s.get('temp') is not None: parts.append(f"🌡 {s['temp']:.1f}°C")
    if s.get('humidity') is not None: parts.append(f"💧 {s['humidity']:.0f}%")
    if s.get('flow_lpm') is not None: parts.append(f"🚿 {s['flow_lpm']:.2f} L/min")
    if s.get('tvoc_ppb') is not None: parts.append(f"🌬 {s['tvoc_ppb']} ppb")
    return "  |  "+"  ".join(parts) if parts else ""

def push_thought(text, sensors=None):
    if not NOTION_SYNC_ENABLED:
        print("[info] [notion] Notion sync is disabled. Skipping push.", flush=True)
        return None
    n = _notion_client()
    now = datetime.now(timezone.utc)
    tag = "idea"
    for t,kws in [("reminder",["remember","remind"]),("task",["buy","get","order"])]:
        if any(k in text.lower() for k in kws): tag=t; break
    title = text.split(".")[0][:80]
    body = text
    sl = _sensor_line(sensors)
    if sl: body += f"\n\n{sl}"
    props = {"Name":{"title":[{"text":{"content":title}}]},
             "Captured":{"date":{"start":now.isoformat()}},
             "Tags":{"multi_select":[{"name":tag}]},
             "Source":{"select":{"name":"vaha"}}}
    children = [{"object":"block","type":"paragraph",
                 "paragraph":{"rich_text":[{"type":"text","text":{"content":body}}]}}]
    try:
        page = n.pages.create(parent={"database_id":NOTION_DB_ID},
                              properties=props, children=children)
    except Exception as e:
        props.pop("Tags",None); props.pop("Source",None)
        page = n.pages.create(parent={"database_id":NOTION_DB_ID},
                              properties=props, children=children)
    print(f"[notion] Synced: {page['id']}", flush=True)
    return page['id']

def pull_thoughts(limit=5):
    if not NOTION_SYNC_ENABLED:
        print("[info] [notion] Notion sync is disabled. Skipping pull.", flush=True)
        return []
    n = _notion_client()
    resp = n.search(filter={"property":"object","value":"page"},
                    sort={"direction":"descending","timestamp":"last_edited_time"},
                    page_size=limit*4)
    db = NOTION_DB_ID.replace("-","")
    out = []
    for p in resp.get("results",[]):
        if p.get("parent",{}).get("database_id","").replace("-","")!=db: continue
        t = p.get("properties",{}).get("Name",{}).get("title",[])
        if t: out.append(t[0]["plain_text"])
        if len(out)>=limit: break
    return out

def locate_piper_model():
    from pathlib import Path
    current_file = Path(__file__).resolve()
    python_dir = current_file.parent
    project_root = python_dir.parent if python_dir.name == "python" else python_dir
    
    print(f"[info] [check] os.getcwd(): {os.getcwd()}", flush=True)
    print(f"[info] [check] __file__: {current_file}", flush=True)
    print(f"[info] [check] Resolved project_root: {project_root}", flush=True)
    
    search_dirs = [
        project_root / "models" / "piper",
        project_root / "models",
        Path("/app/models/piper"),
        Path("/app/models"),
        python_dir / "models" / "piper",
        python_dir / "models",
    ]
    
    candidate_paths = []
    for s_dir in search_dirs:
        candidate_paths.append(str(s_dir / "*.onnx"))
        candidate_paths.append(str(s_dir / "*.onnx.json"))
        
    print(f"[info] [check] Candidate glob patterns checked:", flush=True)
    for p in candidate_paths:
        print(f"  - {p}", flush=True)
        
    for s_dir in search_dirs:
        if not s_dir.exists():
            continue
        onnx_files = list(s_dir.glob("*.onnx"))
        for onnx_file in onnx_files:
            # Strictly verify both .onnx and .onnx.json exist
            json_file = onnx_file.with_suffix(onnx_file.suffix + ".json")
            json_file_alt = onnx_file.with_suffix(".json")
            if json_file.exists():
                print(f"[info] [check] Found Piper model: {onnx_file} and json: {json_file}", flush=True)
                return str(onnx_file)
            elif json_file_alt.exists():
                print(f"[info] [check] Found Piper model: {onnx_file} and json: {json_file_alt}", flush=True)
                return str(onnx_file)
    return None

def find_whisper_model_files(base_dir):
    if not os.path.exists(base_dir):
        return None
    # Search recursively for model.bin in base_dir
    pattern = os.path.join(base_dir, "**/model.bin")
    model_bins = glob.glob(pattern, recursive=True)
    for model_bin in model_bins:
        model_dir = os.path.dirname(model_bin)
        config_path = os.path.join(model_dir, "config.json")
        tokenizer_path = os.path.join(model_dir, "tokenizer.json")
        if os.path.exists(config_path) and os.path.exists(tokenizer_path):
            return model_dir
    return None

def self_check():
    print("[info] [check] Running startup self-check...", flush=True)
    
    # 1. Validate Wake model
    global EIM_PATH
    if not os.path.exists(EIM_PATH):
        found = False
        for alt in [
            EIM_PATH,
            "/app/models/new-marvin.eim",
            "models/new-marvin.eim",
            "/app/models/marvin.eim",
            "models/marvin.eim"
        ]:
            if os.path.exists(alt):
                EIM_PATH = alt
                found = True
                break
        if not found:
            print(f"[error] [check] Wake model missing at {EIM_PATH}", flush=True)
            sys.exit(1)
    
    # Make model file executable (required by Edge Impulse Linux runner)
    try:
        os.chmod(EIM_PATH, 0o755)
        print(f"[info] [check] Model file permissions set to executable: {EIM_PATH}", flush=True)
    except Exception as e:
        print(f"[warn] [check] Could not make model file executable: {e}", flush=True)

    print(f"[info] [check] Wake model verified: {EIM_PATH}", flush=True)


    
    # 2. Validate Piper voice model
    global PIPER_MODEL
    voice_path = locate_piper_model()
    if not voice_path:
        print("[error] [check] Piper voice model (.onnx) could not be located.", flush=True)
        sys.exit(1)
    PIPER_MODEL = voice_path
    print(f"✓ Piper voice:\n{PIPER_MODEL}", flush=True)
    
    if not os.path.exists(PIPER_EXE):
        print(f"[error] [check] Piper executable missing at {PIPER_EXE}", flush=True)
        sys.exit(1)
        
    # 3. Validate Whisper model
    global WHISPER_MODEL_DIR
    whisper_dir = find_whisper_model_files(WHISPER_MODEL_DIR)
    if not whisper_dir:
        # Check inside /app/models or models/ as fallback
        for alt_root in ["/app/models/faster-whisper", "models/faster-whisper", "/app/models", "models"]:
            whisper_dir = find_whisper_model_files(alt_root)
            if whisper_dir:
                # Set WHISPER_MODEL_DIR to the base root directory where the Systran folders reside
                # e.g., if whisper_dir is /app/models/faster-whisper/models--Systran.../snapshots/xyz
                # then we can keep it as is or resolve the base down to /app/models/faster-whisper
                break
                
    if whisper_dir:
        print(f"[info] [check] Whisper model verified: {whisper_dir}", flush=True)
    else:
        print("[warn] [check] Whisper model (model.bin, config.json, tokenizer.json) not found locally. Initiating model download...", flush=True)
        try:
            get_whisper()
            # Double check after download
            whisper_dir = find_whisper_model_files(WHISPER_MODEL_DIR)
            if whisper_dir:
                print(f"[info] [check] Whisper model downloaded and verified: {whisper_dir}", flush=True)
            else:
                print(f"[error] [check] Whisper model download succeeded but validation files were not found.", flush=True)
                sys.exit(1)
        except Exception as e:
            print(f"[error] [check] Failed to download Whisper model: {e}", flush=True)
            sys.exit(1)
    
    # 4. Validate Audio Input
    try:
        p = pyaudio.PyAudio()
        info = p.get_device_info_by_index(PYAUDIO_DEV)
        print(f"[info] [check] Audio input device verified: {info['name']}", flush=True)
        p.terminate()
    except Exception as e:
        print(f"[error] [check] Audio input device verification failed (Index {PYAUDIO_DEV}): {e}", flush=True)
        sys.exit(1)
        
    # 5. Validate Audio Output
    try:
        device = find_speaker_device()
        print(f"[info] [check] Audio output device verified: {device}", flush=True)
    except Exception as e:
        print(f"[error] [check] Audio output device verification failed: {e}", flush=True)
        sys.exit(1)
        
    # 6. Validate Notion configuration (optional)
    global NOTION_SYNC_ENABLED
    if not NOTION_TOKEN or not NOTION_DB_ID:
        print("[warn] [check] Notion configuration missing. Sync is disabled.", flush=True)
        NOTION_SYNC_ENABLED = False
    else:
        try:
            client = Client(auth=NOTION_TOKEN)
            client.databases.retrieve(database_id=NOTION_DB_ID)
            print("[info] [check] Notion configuration verified successfully.", flush=True)
            NOTION_SYNC_ENABLED = True
        except Exception as e:
            print(f"[warn] [check] Notion credentials invalid/database unreachable: {e}. Sync is disabled.", flush=True)
            NOTION_SYNC_ENABLED = False
        
    print("[info] [check] Startup self-check PASSED.", flush=True)

# ─── RECORDING ────────────────────────────────────────────────────────────────
def _rms(chunk):
    if chunk.size == 0:
        return 0.0
    # Remove DC offset to get true AC signal RMS
    ac = chunk.astype(np.float64) - np.mean(chunk)
    return float(np.sqrt(np.mean(ac**2)))

def record_thought(device):
    print("[info] [record] Initializing recording...", flush=True)
    collected, start = [], time.time()
    
    # Initialize Edge Impulse stop detector
    print(f"[info] [record] Initializing Edge Impulse stop phrase detector: {EIM_PATH}", flush=True)
    stop_detector = None
    stop_buf = None
    resample_len = 0
    try:
        stop_detector = audio.EdgeImpulseInference(EIM_PATH)
        model_info = stop_detector.runner.init()
        n_feat = model_info['model_parameters']['input_features_count']
        slice_sz = model_info['model_parameters']['slice_size']
        stop_buf = np.zeros(n_feat, dtype=np.float32)
        print(f"[info] [record] Stop phrase detector loaded. Stop Keyword: '{STOP_KEYWORD}', Threshold: {STOP_THRESHOLD}", flush=True)
    except Exception as e:
        print(f"[error] [record] Failed to initialize Edge Impulse stop detector: {e}. Continuous stop phrase detection will be disabled.", flush=True)
    
    print(f"[info] [record] Listening... Max duration: {MAX_RECORD_S}s", flush=True)
    
    stop_consec_count = 0
    
    with audio.MicrophoneStream(device, sample_rate=SAMPLE_RATE, chunk_size=CHUNK_SIZE) as stream:
        while True:
            now = time.time()
            
            # Global safeguards
            if now - start > MAX_RECORD_S:
                print("[info] [record] Maximum recording duration reached.", flush=True)
                break
                
            chunk = stream.read()
            collected.append(chunk)
            
            # Run Edge Impulse classification if available
            if stop_detector is not None and stop_buf is not None:
                try:
                    chunk_f32 = chunk.astype(np.float32)
                    resample_len = int(len(chunk_f32) * MODEL_RATE / SAMPLE_RATE)
                    resampled_chunk = np.interp(
                        np.linspace(0, len(chunk_f32) - 1, resample_len),
                        np.arange(len(chunk_f32)),
                        chunk_f32
                    ).astype(np.float32)
                    
                    stop_buf = np.roll(stop_buf, -resample_len)
                    stop_buf[-resample_len:] = resampled_chunk
                    
                    best_label, score, latency = stop_detector.classify(stop_buf.tolist())
                    print(f"[info] [inference] Latency: {latency:.2f}ms | Detected: '{best_label}' | Confidence: {score:.4f}", flush=True)
                    
                    # Grace period: Ignore first 2.5 seconds to avoid transient chime/echo false-positives
                    if now - start > 2.5:
                        if best_label == STOP_KEYWORD and score >= STOP_THRESHOLD:
                            stop_consec_count += 1
                            print(f"[info] [inference] Stop keyword '{best_label}' detected consecutively: {stop_consec_count}/{STOP_CONSEC} (score={score:.4f})", flush=True)
                            if stop_consec_count >= STOP_CONSEC:
                                print(f"[info] [record] Stop keyword '{best_label}' triggered stop recording after {stop_consec_count} consecutive detections.", flush=True)
                                break
                        else:
                            stop_consec_count = 0
                    else:
                        stop_consec_count = 0
                except Exception as ex:
                    print(f"[warn] [inference] Inference step failed: {ex}", flush=True)
            
    if stop_detector is not None:
        try:
            stop_detector.close()
            print("[info] [record] Stop phrase detector stopped.", flush=True)
        except Exception as e:
            print(f"[warn] [record] Error stopping Edge Impulse stop detector: {e}", flush=True)
            
    return np.concatenate(collected) if collected else np.array([],dtype=np.int16)


# ─── CHIME ────────────────────────────────────────────────────────────────────
def play_chime():
    rate = 22050
    def tone(freq, dur):
        t = np.linspace(0,dur,int(rate*dur),endpoint=False)
        return 0.4*np.minimum(1,10*(dur-t)/dur)*np.sin(2*np.pi*freq*t)
    audio = np.concatenate([tone(880,0.12),tone(1320,0.15)]).astype(np.float32)
    i16 = (audio*32767).astype(np.int16)
    proc = subprocess.Popen(["aplay","-D","plughw:Device,0",
                              "-r",str(rate),"-f","S16_LE","-c","1","-q"],
                             stdin=subprocess.PIPE)
    proc.stdin.write(i16.tobytes()); proc.stdin.close(); proc.wait()

# ─── WAKE WORD ────────────────────────────────────────────────────────────────
def listen_for_wake_word():
    runner = ImpulseRunner(EIM_PATH)
    info = runner.init()
    n_feat = info['model_parameters']['input_features_count']
    slice_sz = info['model_parameters']['slice_size']
    chunk_mic = int(slice_sz * MIC_RATE / MODEL_RATE)
    p = pyaudio.PyAudio()
    stream = p.open(format=pyaudio.paInt16,channels=1,rate=MIC_RATE,input=True,
                    input_device_index=PYAUDIO_DEV,frames_per_buffer=chunk_mic)
    buf = np.zeros(n_feat,dtype=np.float32)
    consec, last_trigger = 0, 0.
    print(f"{_ts()}[wake] Listening... (threshold={WAKE_THRESHOLD})", flush=True)
    try:
        while True:
            raw = stream.read(chunk_mic,exception_on_overflow=False)
            chunk = np.frombuffer(raw,dtype=np.int16).astype(np.float32)
            resampled = np.interp(np.linspace(0,len(chunk)-1,slice_sz),
                                  np.arange(len(chunk)),chunk).astype(np.float32)
            buf = np.roll(buf,-slice_sz); buf[-slice_sz:] = resampled
            score = runner.classify(buf.tolist())['result']['classification'].get('marvin',0.)

            consec = consec+1 if score>=WAKE_THRESHOLD else 0
            now = time.time()
            if consec>=WAKE_CONSEC and now-last_trigger>WAKE_COOLDOWN:
                print(f"{_ts()}[wake] Triggered!", flush=True)
                stream.stop_stream(); stream.close(); p.terminate(); runner.stop()
                return True
    except KeyboardInterrupt:
        stream.stop_stream(); stream.close(); p.terminate(); runner.stop()
        return False

# ─── MAIN PIPELINE ────────────────────────────────────────────────────────────
def vaha_loop():
    print("[info] [main] === Vaha starting ===", flush=True)
    device = find_best_mic()
    print(f"[info] [main] Mic device: {device}", flush=True)
    get_whisper()
    print("[info] [main] Ready.", flush=True)
    speak("Vaha is ready. Say Marvin to begin.")
    while True:
        if listen_for_wake_word():
            global GLOBAL_TTS_TIME
            GLOBAL_TTS_TIME = 0.0
            t_pipeline_start = time.time()
            
            print("[info] [main] Wake word detected. Transitioning to recording stage...", flush=True)
            broadcast_event("capture_started")
            play_chime()
            time.sleep(2.0)
            broadcast_event("recording")
            
            t_rec_start = time.time()
            audio = record_thought(device)
            t_rec_end = time.time()
            rec_duration = t_rec_end - t_rec_start
            
            print("[info] [main] Recording finished. Transitioning to processing stage...", flush=True)
            broadcast_event("capture_finished")
            
            if audio.size == 0:
                print("[info] [main] No audio captured. Returning to listening.", flush=True)
                speak("I didn't hear anything.")
                continue
                
            print(f"{_ts()}[info] [main] Transcribing audio with Whisper...", flush=True)
            broadcast_event("whisper_processing")
            
            audio_16k = resample_poly(audio,1,3).astype(np.int16)
            
            t_whisper_start = time.time()
            text = transcribe(audio_16k)
            t_whisper_end = time.time()
            whisper_duration = t_whisper_end - t_whisper_start
            
            print(f"{_ts()}[info] [main] Heard: '{text}'", flush=True)
            if not text:
                print("[info] [main] Transcription resulted in empty text. Returning to listening.", flush=True)
                speak("I didn't catch that.")
                continue
            if any(p in text.lower() for p in READ_PHRASES):
                print("[info] [main] Detected read phrase. Reading back notes...", flush=True)
                speak("Reading your recent notes.")
                for i,t in enumerate(pull_thoughts(),1):
                    speak(f"Note {i}. {t}"); time.sleep(0.4)
                continue
            for p in STOP_PHRASES:
                text = re.sub(rf"[,.\s]*{re.escape(p)}[.!?]?\s*$","",text,
                               flags=re.IGNORECASE).strip()
            if not text:
                print("[info] [main] Post-processed text is empty. Returning to listening.", flush=True)
                speak("I didn't catch that."); continue
            sensors = get_sensors()
            if sensors: print(f"[info] [main] Sensors: {sensors}", flush=True)
            
            t_save_start = time.time()
            print("[info] [main] Saving capture locally...", flush=True)
            with open(NOTES_FILE,"a") as f:
                f.write(f"[{datetime.now().strftime('%Y-%m-%d %H:%M')}] {text}\n")
            
            # Save the capture to the Edge Server's CaptureService
            try:
                from server.services.capture_service import capture_service
                capture_service.save_capture(
                    audio_data=audio.tobytes(),
                    transcript=text,
                    sensors=sensors,
                    sample_rate=SAMPLE_RATE,
                    channels=1
                )
                print("[info] [main] Capture saved locally successfully.", flush=True)
            except Exception as e:
                print(f"[info] [main] Capture save error: {e}", flush=True)
            t_save_end = time.time()
            save_duration = t_save_end - t_save_start
            
            notion_duration = 0.0
            if NOTION_SYNC_ENABLED:
                t_notion_start = time.time()
                print("[info] [main] Syncing capture to Notion...", flush=True)
                try:
                    push_thought(text, sensors=sensors)
                    print("[info] [main] Sync to Notion succeeded. Playing response...", flush=True)
                    speak("Saved.")
                except Exception as e:
                    print(f"[info] [main] Notion error: {e}", flush=True)
                    speak("Saved locally. Notion sync failed.")
                t_notion_end = time.time()
                notion_duration = t_notion_end - t_notion_start
            else:
                print("[info] [main] Notion sync is disabled. Skipping sync.", flush=True)
                speak("Saved locally.")
                
            t_pipeline_end = time.time()
            total_duration = t_pipeline_end - t_pipeline_start
            
            print(f"[perf] Recording: {rec_duration:.2f}s", flush=True)
            print(f"[perf] Whisper: {whisper_duration:.2f}s", flush=True)
            print(f"[perf] Save Capture: {save_duration:.2f}s", flush=True)
            print(f"[perf] Notion Sync: {notion_duration:.2f}s", flush=True)
            print(f"[perf] TTS: {GLOBAL_TTS_TIME:.2f}s", flush=True)
            print(f"[perf] Total Pipeline: {total_duration:.2f}s", flush=True)
            
        time.sleep(0.1)

import threading
from server.app import run_server
from server.services.sensor_service import sensor_service
from server.websocket.ws_handler import broadcast_event

# Run startup self-check before starting any services
self_check()

# Start the sensor polling service
sensor_service.start()

# Start the Vaha audio loop
t_vaha = threading.Thread(target=vaha_loop, daemon=True)
t_vaha.start()

def run_server_safe():
    try:
        print("[debug] Starting HTTP server...", flush=True)
        run_server()
        print("[debug] HTTP server exited normally.", flush=True)
    except Exception:
        import traceback
        print("[debug] HTTP server crashed:", flush=True)
        traceback.print_exc()

# Start the Edge Server (HTTP + WS)
t_server = threading.Thread(target=run_server_safe, daemon=True)
t_server.start()

App.run()
