import pyttsx3
import json
import wave

REFS = [
    "remember to buy milk and eggs tomorrow morning",
    "call the dentist and reschedule my appointment for next week",
    "the meeting with the design team got pushed to three thirty",
    "idea for the app, add a dark mode toggle in settings",
    "i left my charger at the office again",
    "note to self, water the plants before leaving on friday",
    "the client wants the proposal revised by end of day",
    "pick up dry cleaning and drop off the package at the post office",
    "great idea just now, a weekly digest email for the team",
    "don't forget the quarterly report is due this friday afternoon",
    "reminder to renew the car insurance before it expires",
    "thinking about switching the database to postgres next quarter",
]

engine = pyttsx3.init()
engine.setProperty('rate', 165)
voices = engine.getProperty('voices')
# alternate between two voices for some variety
chosen = [voices[0], voices[2]] if len(voices) > 2 else [voices[0]]

manifest = []
for i, text in enumerate(REFS):
    voice = chosen[i % len(chosen)]
    engine.setProperty('voice', voice.id)
    path = f"tts_ref_{i:02d}.wav"
    engine.save_to_file(text, path)
    manifest.append({"index": i, "text": text, "file": path, "voice": voice.name})

engine.runAndWait()

with open("tts_manifest.json", "w", encoding="utf-8") as f:
    json.dump(manifest, f, indent=2)

for m in manifest:
    with wave.open(m["file"], "rb") as w:
        print(m["index"], m["file"], w.getframerate(), "Hz", w.getnframes() / w.getframerate(), "s", m["voice"])
