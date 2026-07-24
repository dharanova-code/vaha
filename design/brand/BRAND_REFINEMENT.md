# Vaha Brand Recognition & Refinement

Version 2.0.0  
Status: Proposal  
Target: Vaha Brand System (Phase B)

---

## 1. Brand Signature: The Margin Thread
To establish a distinct identity without relying on the logo, Vaha implements **The Margin Thread** as its signature visual motif:
*   **Visual Form:** A single, extremely thin vertical line (`0.5px` stroke weight, Natural Stone `#7A7265` at 15% opacity) that runs along the left margin of every screen.
*   **Behavior:** 
    *   This thread is not a dry grid separator; it is dynamic. 
    *   During recording, the line pulses with a slow sinusoidal opacity wave.
    *   When a Suggested Reflection is present, a single Muted Copper (`#C07D53`) dot sits precisely on this thread, acting as an anchor.
    *   During audio playback, the timeline scrub handle is represented as a small copper ring sliding down this vertical thread.
*   **Uniqueness:** This asymmetric vertical anchor immediately signals the Vaha environment, making it recognizable on any screen at first glance.

---

## 2. Logo Refinement: The Calligraphic Loop
We iterate on **Concept 1: The Continuous Thread** to increase its memorability and scalability:
*   **Geometry Refinement:** Instead of a uniform monoline vector path, the loop is refined to have a subtle thick-to-thin optical weight transition (varying from 1px to 1.8px), mimicking a single, confident pen stroke on paper.
*   **Scale Optimization:**
    *   **Large Size (Headers):** Shows the full calligraphic loop with overlapping path details.
    *   **Micro Size (Favicons/Telemetry):** The loop simplifies into a solid, balanced symbol where the lines merge cleanly without detail loss.

---

## 3. App Icon Refinement: The Anchor Tile
We refine the **Continuous Thread** app icon across multiple environments to ensure scalability:
*   **128px / Home Screen (iOS/Android):** The loop is centered on the unbleached warm paper (`#FAF8F5`) tile. A very subtle, flat inner border (1px wide, `#E2DFD9`) frames the tile to separate it on light wallpapers.
*   **48px / App Library:** The symbol’s stroke weight is optically adjusted to be thicker, ensuring the silhouette remains distinct.
*   **24px / Status Bar Notification:** The symbol is reduced to a simplified, high-contrast flat green loop silhouette.
*   **Android Adaptive Icon:** The background (`#FAF8F5`) and symbol (`#1B3629`) sit on separate layers to allow physics-based parallax during user scroll.
*   **Monochrome / Stamped:** When used as a monochrome widget or system icon, the symbol renders as a solid deep forest green glyph on a transparent background.

---

## 4. Illustration Language: Structural Geometry
Illustrations must never feel decorative, playful, or corporate. 
*   **Style:** Monoline vector geometry (`1px` width) in Natural Stone (`#7A7265`).
*   **Subject:** Structural, clean blueprints, geometric coordinates, or simple organic leaf-like silhouettes.
*   **Rule:** No human characters, cartoon eyes, face vectors, or solid color fills. They must look like a quiet sketch in a surveyor’s notebook.

---

## 5. Imagery Language: Analog Warmth
Photography should be used rarely, appearing only when representing a user's capture attachments (e.g., a photo taken during a capture).
*   **Treatment:** All images must have an automated warm-tint filter applied (low contrast, slightly desaturated, with a warm paper cast) to blend seamlessly into the `#FAF8F5` background.
*   **Composition:** Photography should favor still life, natural lighting, and architectural minimal compositions to align with the Muji/Japanese minimal interiors aesthetic.

---

## 6. Micro Brand Moments
*   **Loading:** The *Margin Thread* on the left slowly draws itself from top to bottom, followed by the title fading in.
*   **Onboarding Key Gen:** The key generation is accompanied by a quiet copper dot appearing on the margin thread, pulsing slowly.
*   **Empty States:** Instead of a corporate illustration, empty states display a single question prompt (e.g., *"What is on your mind?"*) in EB Garamond serif.
*   **Audio Playback:** The scrub cursor is a small copper ring that travels down the vertical margin thread, making the playback control feel integrated with the page layout.
*   **Reflections:** Preceded by a quiet copper dot on the margin line to draw focus.
