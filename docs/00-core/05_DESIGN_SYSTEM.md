# Vaha Design System & Brand Guidelines

This design system covers the sonic and light interfaces of the physical hardware, as well as the visual styling, components, and interaction patterns of the Companion Application.

---

## 1. Physical Device Sonic & Light Design

The physical device relies on sound and light to create an ambient, non-intrusive user experience.

### 1.1 Audio Feedback (Frequencies & Rhythms)
*   **Activation Chime**: Ascending major third sequence designed to feel clean and welcoming.
    *   *Step 1*: `880 Hz` (A5) for 120 ms.
    *   *Step 2*: `1100 Hz` (C#6) for 150 ms.
*   **Completion Chime**: Descending sequence signaling safe data storage.
    *   *Step 1*: `1100 Hz` (C#6) for 120 ms.
    *   *Step 2*: `880 Hz` (A5) for 150 ms.
*   **Warning Tone**: Single low-pitch alert.
    *   *Step 1*: `220 Hz` (A3) for 400 ms.

### 1.2 LED Animation Specs
The device utilizes a multi-color LED ring to communicate system state:

*   **Pulsing Blue**: Sinusoidal pulse with a period of `2.0 seconds` (1.0s ramp up, 1.0s ramp down) between 10% and 100% brightness. Used during active audio recording.
*   **Pulsing Orange**: Linear flash with a frequency of `1.0 Hz` (500 ms on, 500 ms off). Used during BLE pairing.
*   **Flashing Red**: Rapid strobe with a frequency of `4.0 Hz` (125 ms on, 125 ms off). Used for error states.

---

## 2. Companion App Visual System

The Companion App design system is optimized for readability, accessibility, and modern aesthetics.

### 2.1 Color Palette
Vaha uses a dark-themed base with clean, functional status accents.

```
Base (Dark Mode)
├── Slate Primary:     #0F172A (Deep Slate for backgrounds)
├── Slate Secondary:   #1E293B (Card containers)
└── Slate Accent:      #334155 (Borders and divider lines)

Brand Highlights
├── Teal Accent:       #0EA5E9 (Primary interactive highlights & active telemetry)
└── Emerald Green:     #10B981 (Success states & full sync indicators)
```

### 2.2 Typography
*   **Primary Typeface**: `Inter` (Sans-serif) for clean readability at all scale factors.
*   **Telemetry & Timestamps**: `JetBrains Mono` or equivalent monospace font for tabular telemetry data alignment.

---

## 3. Interaction & Voice Capture System

*   **VAD Timeout (Voice Activity Detection)**: The device automatically cuts off recording when silence exceeds `5.0 seconds`.
*   **Local Command Set**: In addition to silence detection, the recording engine will finalize the audio file immediately if it detects structural phrases:
    *   *"Done"*
    *   *"Save note"*
    *   *"That's all"*
