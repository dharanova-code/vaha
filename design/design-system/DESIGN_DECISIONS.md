# Vaha Design Decisions Record (Design ADR)

This document is the historical record of all approved design choices, visual rules, and layout decisions for Vaha. All future features and layouts must strictly adhere to these entries.

---

## DADR-001: Warm Paper Background
*   **Status:** Approved / Frozen
*   **Reason:** Move away from standard "digital blue" and clinical pure white displays. A warm paper base (`#FAF8F5`) feels like opening a physical, premium book or journal, which increases relaxation and encourages long-form thought.
*   **Alternatives Considered:** Slate primary (#0F172A) (evaluated in early variants, rejected in favor of light-theme paper only to maintain warmth).
*   **Impact:** All application screens utilize `#FAF8F5` as the primary layer_0 background.
*   **Approved By:** Design Director
*   **Future Notes:** Never use pure white (`#FFFFFF`) or cooler light-gray bases.

---

## DADR-002: Forest Green Primary and Muted Copper Accent Colorway
*   **Status:** Approved / Frozen
*   **Reason:** Establish an organic, calm, and quiet-luxury palette. Deep Forest Green (`#1B3629`) represents the "ink" of the system, providing high contrast without the clinical coldness of black. Muted Copper (`#C07D53`) provides a warm, hardware-like contrast for focus points.
*   **Alternatives Considered:** Neon blue accents, technical slate grays.
*   **Impact:** Primary headers and titles are rendered in `#1B3629`. High-priority interactive highlights or active status states utilize `#C07D53`.
*   **Approved By:** Design Director
*   **Future Notes:** Avoid neon colors, saturated primary colors, and bright corporate blues.

---

## DADR-003: Editorial Layout & Reading-First Hierarchy
*   **Status:** Approved / Frozen
*   **Reason:** Vaha is a thought companion, not a quick note tracker. The visual rhythm must mimic a high-end publication to promote slow, deliberate reading and reflection.
*   **Alternatives Considered:** Data-dense grids, card-based dashboard lists.
*   **Impact:** Left-aligned, wide-margin text blocks. Content preview length is set to 2-3 lines of text with generous line-heights (`1.6`).
*   **Approved By:** UX Reviewer
*   **Future Notes:** Limit layout widths to 60-75 characters per line to optimize readability.

---

## DADR-004: Reflection-First UX & No Productivity Dashboard
*   **Status:** Approved / Frozen
*   **Reason:** Vaha must feel like a sanctuary, not a task manager. Standard productivity metrics, counts, streak highlights, and progress graphs are banned.
*   **Alternatives Considered:** Goal meters, weekly capture streak widgets.
*   **Impact:** Dashboard widgets are absent. Home page space is allocated to a warm greeting, a "Continue where you left off" anchor, and recent thoughts, deferring full metrics or lists to sub-tabs.
*   **Approved By:** Product Architect
*   **Future Notes:** Keep components centered on synthesis and learning from thoughts.

---

## DADR-005: Offline-First Trust Model
*   **Status:** Approved / Frozen
*   **Reason:** Establish absolute data isolation. Users must trust that their private journal thoughts are secure and local.
*   **Alternatives Considered:** Cloud-first sync, online-only speech-to-text APIs.
*   **Impact:** Transcription processing is computed locally on-device. Security keys are generated on-device using AES-256 with zero cloud staging.
*   **Approved By:** Product Architect
*   **Future Notes:** Onboarding explicitly walks the user through local key backup before app entrance.

---

## DADR-006: Minimal Device Visibility
*   **Status:** Approved / Frozen
*   **Reason:** A physical thought companion device should exist silently in the environment. Hardware status, battery monitoring, and sync states must not clutter the dashboard UI.
*   **Alternatives Considered:** Large floating device connectivity status cards.
*   **Impact:** Device status is reduced to a tiny, desaturated text log and a small copper LED dot in the screen footer or settings tab.
*   **Approved By:** Hardware Reviewer
*   **Future Notes:** Only display prominent warning flags if a hardware fault or storage exhaustion occurs.

---

## DADR-007: Serif & Sans-Serif Typographic Rules
*   **Status:** Approved / Frozen
*   **Reason:** High visual contrast and emotional control. 
*   **Alternatives Considered:** All-serif typography (makes body copy illegible at small sizes), all-sans-serif (feels too corporate/technical).
*   **Impact:** 
    *   **Serif (EB Garamond):** Used exclusively for high-emotion elements (personal greetings, capture titles, suggested reflection quotes).
    *   **Sans-serif (Inter):** Used for transcripts, system text, metadata, search fields, and navigation.
*   **Approved By:** Brand Guardian
*   **Future Notes:** Never mix sans-serif and serif fonts within the same text sentence or block.

---

## DADR-008: The Margin Thread Brand Signature
*   **Status:** Approved / Frozen
*   **Reason:** Create a recognizable branding signature across all screens without using intrusive logos.
*   **Alternatives Considered:** Custom watermark patterns, top-bar logo banners.
*   **Impact:** A thin, `0.5px` vertical Natural Stone line (`#7A7265` at 15% opacity) runs along the left margin of the Home, Capture Detail, and Onboarding screens. It behaves dynamically as a timeline scrub handle or reflection anchor.
*   **Approved By:** Brand Guardian
*   **Future Notes:** Locked at exactly 24px from the left edge on mobile, and 40px on tablet/desktop.

---

## DADR-009: Whitespace and Spacing Philosophy
*   **Status:** Approved / Frozen
*   **Reason:** Enforce a low-arousal layout. Spacing should define the structure, eliminating the need for borders, grid cards, and dividers.
*   **Alternatives Considered:** 1px borders around every list item, card-based section containers.
*   **Impact:** Vertical gaps of 48px to 64px separate major sections. Margin boundaries are deep and clean.
*   **Approved By:** UX Reviewer
*   **Future Notes:** Maintain a minimum margin width of 24px on mobile devices.

---

## DADR-010: Calm Motion
*   **Status:** Approved / Frozen
*   **Reason:** Prevent user distraction or cognitive arousal.
*   **Alternatives Considered:** Spring and bounce physics, scaling micro-interactions.
*   **Impact:** Transitions utilize linear/decelerating curves with a locked **120ms** duration. Sync indicators use a slow sinusoidal breathing cycle (2500ms cycle).
*   **Approved By:** Design Director
*   **Future Notes:** Bouncy, playful animations are strictly prohibited.

---

## DADR-011: No Floating Action Buttons (FAB) & No Chat UI
*   **Status:** Approved / Frozen
*   **Reason:** FABs create visual tension and dominate the screen space. Chat interfaces/conversational models are rejected because Vaha is a thought companion, not a chat assistant.
*   **Alternatives Considered:** Floating round "Record" buttons, AI chat-history views.
*   **Impact:** The capture trigger on the Home screen is integrated flatly as a simple monoline circle. AI insights are rendered as static margin notes or blockquotes, never as chat bubbles.
*   **Approved By:** Product Architect
*   **Future Notes:** Avoid typing animations or dialog responses that simulate a conversational partner.
