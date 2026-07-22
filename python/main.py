import sys, os
sys.path.insert(0, "/app/wheels")
os.chdir('/app')

import re, subprocess, time, math, socket, glob
from datetime import datetime, timezone, timedelta

import numpy as np
import sounddevice as sd
import pyaudio
import noisereduce as nr
from scipy.signal import resample_poly
from dotenv import load_dotenv
from notion_client import Client
from edge_impulse_linux.runner import ImpulseRunner
from arduino.app_utils import App, Bridge

load_dotenv()

# ─── CONFIG ───────────────────────────────────────────────────────────────────
SAMPLE_RATE        = 48000
MODEL_RATE         = 16000
CHUNK_MS           = 100
CHUNK_SIZE         = int(SAMPLE_RATE * CHUNK_MS / 1000)
FIRST_SILENCE_S    = 3.0
SECOND_SILENCE_S   = 7.0
MAX_RECORD_S       = 600
NO_SPEECH_GIVEUP_S = 7.0
NOTION_TOKEN       = os.environ.get("NOTION_TOKEN","")
NOTION_DB_ID       = os.environ.get("NOTION_DATABASE_ID","919fbc944bc94c58875be84819851c62")
NOTES_FILE         = "/app/notes.txt"
PIPER_EXE          = "/app/piper/piper"
PIPER_MODEL        = "/app/models/piper/en_US-lessac-medium.onnx"
WHISPER_MODEL_DIR  = "/app/models/faster-whisper"
EIM_PATH           = "/app/models/marvin.eim"
MIC_RATE           = 48000
PYAUDIO_DEV      = 1  # CS202 mic
WAKE_THRESHOLD     = 0.55
WAKE_CONSEC        = 2
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

def speak(text):
    if not text or not os.path.exists(PIPER_EXE):
        return
    try:
        import tempfile
        device = find_speaker_device()
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
            tmp_path = tmp.name
        subprocess.run([PIPER_EXE,"--model",PIPER_MODEL,"--output_file",tmp_path],
                       input=text.encode(), capture_output=True)
        # Boost volume 3x using Python (no sox needed)
        import wave, array, struct
        boosted = tmp_path.replace(".wav","_boosted.wav")
        try:
            with wave.open(tmp_path,'rb') as wf:
                params = wf.getparams()
                frames = wf.readframes(wf.getnframes())
            samples = array.array('h', frames)
            boosted_samples = array.array('h', [max(-32768,min(32767,int(s*3.0))) for s in samples])
            with wave.open(boosted, 'wb') as wf:
                wf.setparams(params)
                wf.writeframes(boosted_samples.tobytes())
            play_file = boosted
        except Exception:
            play_file = tmp_path
        subprocess.run(["aplay","-D",device,"-q",play_file],
                       capture_output=True)
        print(f"[speak] output via {device}", flush=True)
    except Exception as e:
        print(f"[speak] {e}", flush=True)
    finally:
        if os.path.exists(tmp_path): os.unlink(tmp_path)

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
    last_voice, prompted = None, False
    calib = sd.rec(int(0.4*SAMPLE_RATE),samplerate=SAMPLE_RATE,channels=1,
                   dtype="int16",device=device)
    sd.wait()
    ambient = _rms(np.squeeze(calib))
    # Remove the low cap of 400 to allow threshold to scale with higher ambient noise
    threshold = min(max(150., ambient*1.2), 3000.)
    print(f"[info] [record] Ambient RMS={ambient:.0f} -> threshold={threshold:.0f}", flush=True)
    print(f"[info] [record] Listening... Max duration: {MAX_RECORD_S}s", flush=True)
    
    with sd.InputStream(samplerate=SAMPLE_RATE,channels=1,dtype="int16",
                        blocksize=CHUNK_SIZE,device=device) as stream:
        stream.start()
        while True:
            now = time.time()
            if now-start > MAX_RECORD_S:
                print("[info] [record] Maximum recording duration reached.", flush=True)
                break
            if last_voice is None and now-start > NO_SPEECH_GIVEUP_S:
                print("[info] [record] No speech detected within timeout. Giving up.", flush=True)
                break
            data,_ = stream.read(CHUNK_SIZE)
            chunk = np.squeeze(data).astype(np.int16)
            collected.append(chunk)
            
            rms_val = _rms(chunk)
            if rms_val > threshold:
                if last_voice is None:
                    print(f"[info] [record] Voice detected (RMS={rms_val:.0f} > threshold={threshold:.0f})", flush=True)
                last_voice = now; prompted = False; continue
            if last_voice is None: continue
            silence = now - last_voice
            if not prompted and silence >= FIRST_SILENCE_S:
                print(f"[info] [record] Detected silence for {FIRST_SILENCE_S}s. Asking to continue...", flush=True)
                speak("Still listening.")
                prompted = True; continue
            if prompted and silence >= FIRST_SILENCE_S+SECOND_SILENCE_S:
                print(f"[info] [record] Extended silence of {FIRST_SILENCE_S+SECOND_SILENCE_S}s detected. Stopping.", flush=True)
                break
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
            print("[info] [main] Wake word detected. Transitioning to recording stage...", flush=True)
            broadcast_event("capture_started")
            play_chime()
            time.sleep(2.0)
            broadcast_event("recording")
            audio = record_thought(device)
            print("[info] [main] Recording finished. Transitioning to processing stage...", flush=True)
            broadcast_event("capture_finished")
            
            if audio.size == 0:
                print("[info] [main] No audio captured. Returning to listening.", flush=True)
                speak("I didn't hear anything."); continue
                
            print(f"{_ts()}[info] [main] Transcribing audio with Whisper...", flush=True)
            broadcast_event("whisper_processing")
            
            audio_16k = resample_poly(audio,1,3).astype(np.int16)
            text = transcribe(audio_16k)
            print(f"{_ts()}[info] [main] Heard: '{text}'", flush=True)
            if not text:
                print("[info] [main] Transcription resulted in empty text. Returning to listening.", flush=True)
                speak("I didn't catch that."); continue
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

            print("[info] [main] Syncing capture to Notion...", flush=True)
            try:
                push_thought(text, sensors=sensors)
                print("[info] [main] Sync to Notion succeeded. Playing response...", flush=True)
                speak("Saved.")
            except Exception as e:
                print(f"[info] [main] Notion error: {e}", flush=True)
                speak("Saved locally. Notion sync failed.")

        time.sleep(0.1)

import threading
from server.app import run_server
from server.services.sensor_service import sensor_service
from server.websocket.ws_handler import broadcast_event

# Start the sensor polling service
sensor_service.start()

# Start the Vaha audio loop
t_vaha = threading.Thread(target=vaha_loop, daemon=True)
t_vaha.start()

# Start the Edge Server (HTTP + WS)
t_server = threading.Thread(target=run_server, daemon=True)
t_server.start()

App.run()
