# Vaha Visual Identity

This document defines the Visual Identity for the Vaha product ecosystem, derived directly from the core values, personality, and principles established in [BRAND.md](file:///c:/Projects/vaha/design/brand/BRAND.md).

---

## 1 Visual Philosophy: Ambient Subtraction

The visual expression of Vaha is **Ambient Subtraction**. The interface exists solely to frame and serve the user's thoughts, not to assert its own presence. By stripping away decorative elements, borders, and unnecessary depth, the UI recedes into the background, leaving a quiet, highly legible canvas for raw and structured intelligence.

---

## 2 Visual Principles

*   **Content as Interface**: The user's captured voice transcripts, structure, and environmental telemetry *are* the UI. Colors, typography, and spacing adapt to the data, never the other way around.
*   **Context-Bound Contrast**: Use visual contrast to highlight capture context (e.g., matching subtle metadata indicators to temporal or environmental telemetry conditions).
*   **Functional Hierarchy**: Information hierarchy is strictly dictated by the age, status, and semantic weight of the captured thoughts.
*   **Noiseless Space**: Every pixel, divider line, and background shade must prove its utility or be subtracted.

---

## 3 Visual Personality

*   **Invisible**: Border boundaries are low-contrast or completely flat, allowing content blocks to feel integrated into the background.
*   **Stoic**: Layout grids are strict, flat, and unadorned. They do not employ decorative curves, gradients, or shadows.
*   **Steadfast**: Visual structure remains rock-solid, predictable, and clean under all system states (online, offline, syncing).
*   **Refined**: Pin-sharp alignment, balanced proportions, and high-precision typographic execution reflect a premium utility.

---

## 4 Emotional Design

*   **Calmness & Spaciousness**: Generous workspace margins and dark, low-stimulation color palettes lower cognitive load, offering a sense of mental breathing room before the user even reads a word.
*   **Safety & Integrity**: Prominent, steady privacy indicators (e.g., explicit local processing statuses, secure sync logs) assure the user that their data is isolated and protected.
*   **Frictionless Trust**: Immediate and clear visual confirmations when data is successfully synced or when raw files are securely purged from the physical device.

---

## 5 Shape Language

*   **Structured Orthogonality**: Use strict rectangular containers with minimal, sharp, or very slightly rounded corners (e.g., 2px to 4px border radius) to represent stability and engineering precision.
*   **No Playful Curves**: Highly rounded pill shapes, circular bubbles, or organic fluid shapes are strictly forbidden. They evoke casual social platforms and contradict Vaha's stoic utility.
*   **Acoustic Precision**: Waveforms must be rendered as thin, mathematically precise vector lines. Never use stylized, thick, or bouncy bar graphs.

---

## 6 Surface Philosophy

*   **Flat Layering**: Limit layout depth to a maximum of two surfaces: the application background and the content container.
*   **Monolithic Colors**: Use solid, flat colors for surfaces. 
*   **No Material Simulation**: Avoid drop shadows, frosted glass effects (glassmorphism), or skeuomorphic textures. Surfaces must represent data containers, not physical layers.

---

## 7 Light Strategy

*   **Clean Utility**: The light theme is a secondary mode, optimized for high-brightness ambient environments (e.g., outdoor workspaces, bright laboratories).
*   **Paper-like Contrast**: Employ soft, warm, desaturated off-whites (resembling warm paper or bone) to minimize glare, paired with sharp, dark slate text.
*   **Desaturated Accents**: Brand highlight colors are applied with high constraint, reserved for critical alerts or active states.

---

## 8 Dark Strategy

*   **Primary Mode**: The default state of Vaha, matching the low-light environments where fleeting thoughts often arise (e.g., bedside tables, late-night labs, dark rooms).
*   **Deep Slates**: Use deep slate and charcoal base colors instead of pure pitch black to prevent harsh contrast glare and reduce visual fatigue.
*   **Subtle Glows**: Active states (such as connection and sync) utilize low-luminance, focused glows that directly mirror the physical device's LED signals.

---

## 9 Illustration Philosophy

*   **No Corporate Art**: Stylized vector illustrations, cute characters, or generic empty-state drawings are completely banned.
*   **Blueprint Schematics**: If a visual aid is required, use precise, monochrome, blueprint-style line drawings or wireframe schematics.

---

## 10 Photography Philosophy

*   **Contextual Rawness**: Photography is reserved for hardware diagnostics, physical telemetry documentation, or raw profile context.
*   **Documentary Style**: Use unedited, high-contrast, documentary-style photos of real workspaces. No stock photos with smiling models, artificial lighting, or clean corporate boardrooms.

---

## 11 Icon Philosophy

*   **Thin Geometric Outlines**: Use crisp, monoline, geometric icons with thin strokes (e.g., 1px to 1.5px stroke weight) and open paths.
*   **Strict Utility**: Icons must have a single, universally understood utility (e.g., a simple lock for privacy, an antenna for sync, a waveform for recording). Never use abstract or decorative icons.

---

## 12 Motion Philosophy

*   **Functional Transition**: Motion is exclusively used to communicate system state changes (e.g., sync progress, upload confirmation, error alert).
*   **Mathematical Easing**: Transitions must be rapid, clean, and linear-out-slow-in, completing in under 200ms. Bouncy, elastic, or playful animation behaviors are prohibited.
*   **Sinusoidal Pulsing**: Match the physical device's pulsing frequency (2.0-second period) for active sync or recording states to create a cohesive ecosystem loop.

---

## 13 Accessibility Philosophy

*   **Contrast Rigor**: All text, statuses, and icons must meet or exceed WCAG AA contrast ratios (preferably AAA) against their respective backgrounds.
*   **Text-First Scalability**: Layouts must scale gracefully up to 200% font size without layout breaking, text clipping, or overlapping.
*   **Clear Reading Order**: Screen layouts must follow a simple, linear visual flow that matches screen readers.

---

## 14 Whitespace Philosophy

*   **Breathing Space**: Use deliberate, generous margins around text blocks to prevent cognitive clutter. Ideas must have visual separation to be digested individually.
*   **Grid Constraint**: All spacing, padding, and alignments must strictly adhere to an 8px grid system (8px, 16px, 24px, 32px, 48px) to maintain structured rhythm.

---

## 15 Consistency Rules

*   **Hardware-to-Software Mirroring**: Light and color behaviors on the physical hardware must map 1:1 to the companion app interface:
    *   *Pulsing Blue*: Active Voice Recording / Syncing
    *   *Pulsing Orange*: BLE Pairing / Connection Negotiation
    *   *Flashing Red*: Error state / Action required
*   **Typographic Alignment**: Monospace typography is strictly reserved for raw sensor telemetry, timestamps, and data logs. Sans-serif typography is used for human-readable notes, transcripts, and insights.

---

## 16 Anti-Patterns

*   **Micro-interactions for Gamification**: Do not animate icons on hover just to trigger dopamine responses.
*   **Playful Celebrations**: Never show confetti, congratulations popups, or streaks when a user captures notes.
*   **Card Nesting**: Never nest cards within cards. Surfaces must remain flat and single-layered.
*   **Stylized Placeholders**: Never use abstract colorful shapes, decorative gradients, or stock graphics to fill empty states. Use plain, structured text.
