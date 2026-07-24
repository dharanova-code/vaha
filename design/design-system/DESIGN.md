# Vaha AI Design Context - Version 3.0.0

## 1. Brand Summary & Voice
*   **Aesthetic:** Quiet luxury, premium minimalism, Japanese/Muji interior-inspired, tactile.
*   **Tone:** Stoic, calm, understated, intellectual. No celebratory animations, confetti, streaks, or emojis.
*   **Metaphor:** A personal unbleached paper journal, not a digital database or utility dashboard.

## 2. Core Principles
*   **Ambient Subtraction:** Recede visual framework. Prioritize blank space.
*   **Trust First:** Data isolation, local-only processing, and local encryption.
*   **Thought Continuity:** Surface recent thinking; defer archiving tasks to secondary tabs.

## 3. Colors (Light Mode Only)
*   **Background (Layer 0):** `#FAF8F5` (Warm Paper)
*   **Surface (Layer 1):** `#F5F2EC` (Warm Paper Secondary)
*   **Primary Text:** `#1B3629` (Deep Forest Green)
*   **Secondary Text/Lines:** `#7A7265` (Natural Stone)
*   **Accent:** `#C07D53` (Muted Copper)
*   **Border Accent:** `#E2DFD9` (Very soft stone tint)

## 4. Typography
*   **Headline Font:** EB Garamond (Serif)
*   **Body & Label Font:** Inter (Sans-serif)
*   **Serif Rules:** Use *only* for emotional anchors: personal greeting headers, capture titles, and suggested reflection blockquotes.
*   **Sans-serif Rules:** Use for reading transcripts, labels, search text, metadata, navigation tabs, and system output.
*   **Proportions:** 
    *   `display-lg`: 36px (lh: 44px, serif)
    *   `headline-lg`: 24px (lh: 32px, serif)
    *   `body-md`: 16px (lh: 26px, sans)
    *   `label-sm`: 13px (lh: 18px, sans)
    *   `meta-sm`: 12px (lh: 16px, sans)

## 5. Spacing & Rhythm
*   **Base Grid:** 8px
*   **Mobile Screen Margins:** Locked at exactly 24px left and right.
*   **Vertical rhythm:** 48px to 64px gaps between major conceptual modules (greeting, continuity anchor, timeline list).
*   **Whitespace:** Must define visual hierarchy. Do not use borders or cards to separate elements.

## 6. Elevation & Shape Language
*   **Elevation:** Strictly flat (0dp). No drop shadows, gradients, or glassmorphic blurs.
*   **Corners:** 4px radius (radius-medium) for anchors; 2px radius (radius-small) for controls. No rounded pills or circular buttons.
*   **Strokes:** 1px solid `#E2DFD9` maximum for dividers or buttons.

## 7. Motion
*   **Standard Curves:** Easing linear-out-slow-in. Duration locked at **120ms**.
*   **Breathing Animation:** Sinusoidal opacity oscillation (20% to 100%) over **2500ms** per cycle for active syncing/loading states.

## 8. Iconography & Symbolism
*   **Signature Motif (Margin Thread):** A 0.5px vertical line (`#7A7265` at 15% opacity) locked at 24px from the left on mobile. It anchors playback scrub handles and AI insights.
*   **Vaha Logo:** Refined Calligraphic Loop. Refer to [BRAND_GUIDELINES.md](file:///c:/Projects/vaha/BRAND_GUIDELINES.md).
*   **Sensory Waveforms:** Single-pixel monoline paths. No thick bar charts or colorful audio visualizers.

## 9. Components
*   **Buttons:** Rectangular, flat text with a 1px border.
*   **Search Input:** Single borderless text line with placeholder *"Find a thread of thought..."*
*   **Suggested Reflection:** Borderless flat blockquotes with copper accent indicators. No cards.
*   **Navigation:** Borderless bottom nav with plain uppercase text labels separated by copper dots.

## 10. Screen & Layout Rules
*   **Home Dashboard:** 1) Welcoming greeting at top (serif). 2) Large "Continue where you left off" anchor. 3) Minimized timeline (last 2 captures only). 4) Invisible device widget in footer.
*   **Capture Detail:** Reading-first. Centered transcript body text. Playback controls subordinated to the bottom. Metadata receded to the margins.
*   **Onboarding:** Trust-first sequence. Refer to [ONBOARDING_PHILOSOPHY.md](file:///c:/Projects/vaha/ONBOARDING_PHILOSOPHY.md).

## 11. Accessibility & Interaction Rules
*   **Contrast:** Minimum 4.5:1 (WCAG AA) / 7:1 (WCAG AAA for transcripts).
*   **Touch Targets:** Minimum 48px x 48px bounding boxes.
*   **Measure:** Keep transcript text to 60-75 characters per line.
*   **Zero-latency Typeahead:** Non-blocking filter as user types.

## 12. Constraints & Output Requirements
*   **No Chat UI:** AI text is static journal content. Never use chat bubbles, messaging logs, or automated agent responses.
*   **No FAB:** Floating Action Buttons are banned.
*   **No Cloud Syncing of Text:** Decrypt and store SQLite data locally.
*   **Strict Output:** Google Stitch generation outputs must always provide three variations.
