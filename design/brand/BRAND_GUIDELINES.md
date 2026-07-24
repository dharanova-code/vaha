# Vaha Brand Guidelines: Final Identity Lock

Version 3.0.0
Status: Frozen / Locked
Target: Vaha Brand System (Final Stage)

---

## 1. Symbol Refinement: The Calligraphic Loop

The *Continuous Thread* calligraphic symbol is locked to a geometric dual-ring anchor system to ensure absolute rendering consistency while retaining its organic, hand-drawn warmth.

* **Geometry:** Built on two intersecting circles of equal radii ($R$). The centers are offset horizontally by $0.85R$. The intersecting boundaries are smoothed using Bezier arcs to create a flowing twist.
* **Contrast Weight:** The stroke weight is calligraphic, transitioning smoothly from a minimum of **1.2px** at the loops' outer terminals to a maximum of **2.0px** at the center overlap intersection.
* **Path Direction:** Starts from the bottom-left terminal, sweeps upward to form the left loop, crosses through the center, sweeps downward to form the right loop, and terminates at the bottom-right.

---

## 2. Symbol Sizing Matrix

To guarantee legibility across all digital and print mediums, the symbol scale shifts dynamically:

| Scale            | Context                   | Rendering Rules                                                           | Stroke Weight |
| :--------------- | :------------------------ | :------------------------------------------------------------------------ | :------------ |
| **16px**   | Favicon / Watch Status    | Optical simplification: Loops merge into a solid forest green silhouette. | Solid fill    |
| **24px**   | Mobile Navigation Header  | Standard monoline layout. Overlap line-break is omitted.                  | 1.0px flat    |
| **32px**   | Watch Companion Screen    | Overlap line-break is visible. Flat ink stroke.                           | 1.25px flat   |
| **48px**   | Android App Library / iOS | Standard calligraphic weight transition active.                           | 1.5px - 2.0px |
| **64px**   | Desktop Header / Web App  | Full detail active. Clear overlapping path breaks.                        | 1.5px - 2.0px |
| **128px+** | Splash Screens / Print    | High-resolution calligraphic curve active.                                | 2.0px - 3.0px |

---

## 3. VAHA Wordmark Refinement

The wordmark "VAHA" is locked under the following spatial constraints:

* **Typography:** Custom serif typeface with vertical stems matching the thickness of the symbol’s widest points (2.0px equivalent).
* **Optical Balance:** The horizontal crossbar of the character **'A'** is set at exactly **35%** of the character height from the baseline to ground the text weight.
* **Proportions & Spacing:** Letter-spacing (tracking) is locked at exactly **15%** of the font size. Kerning is optically matched for absolute balance between V-A, A-H, and H-A.

---

## 4. Lockups Matrix

### 4.1 Symbol Only

Used for the App Icon, smartwatch companion launcher, and system navigation buttons.

### 4.2 Wordmark Only

Used for stationery, letterpress headings, and minimalist documentation headers.

### 4.3 Horizontal Lockup

Used for web page headers and wide desktop interfaces.

* **Alignment:** Symbol on the left, wordmark on the right. Both centered vertically.
* **Spacing:** Spacing between the rightmost edge of the symbol and the leftmost edge of 'V' is exactly equal to **1.5 times** the height of the wordmark.

### 4.4 Vertical Lockup

The primary brand lockup, used for splash screens, packaging, and welcome screens.

* **Alignment:** Symbol centered above the wordmark.
* **Spacing:** Spacing between the bottom terminal of the symbol and the top of the wordmark is exactly equal to **1.0 times** the height of the wordmark.

### 4.5 App Icon Lockup

The symbol sits exactly centered on a `#FAF8F5` rounded tile. The padding between the outer bounds of the symbol and the tile edge is exactly **30%** of the tile width.

### 4.6 Splash Screen & Loading Screen

* **Splash Screen:** Large Vertical Lockup centered on the screen, occupying exactly **33%** of the total screen height.
* **Loading Screen:** Symbol only, centered on the page, executing the *Breathing Opacity* animation.

---

## 5. Animation Principles: Clean monoline path

Animations must feel quiet, intentional, and organic. High-velocity transitions, bounces, and springs are strictly banned.

### 5.1 The Line Drawing (Introduction)

* **Behavior:** The calligraphic loop is drawn progressively from the bottom-left terminal to the bottom-right terminal.
* **Duration:** **1800ms** total duration.
* **Easing:** `cubic-bezier(0.25, 1, 0.5, 1)` (a slow, graceful deceleration into final resting position).
* **Usage:** Splash screens and first application launch.

### 5.2 Breathing Opacity (Syncing / Loading)

* **Behavior:** The symbol fades smoothly from **20% opacity** to **100% opacity** and back.
* **Duration:** **2500ms** per full cycle.
* **Easing:** Sinusoidal curve.
* **Usage:** Empty states during sync or transcription loading.

---

## 6. Brand Signature: Margin Thread Placement

The *Margin Thread* is Vaha’s signature visual anchor and must be used with absolute restraint:

* **Where it Appears:**
  * **Home Dashboard:** Left margin, running vertically from below the header greeting to the bottom navigation boundaries.
  * **Capture Detail:** Left margin, acting as the visual spine for the scrollable transcription text.
  * **Onboarding Key Gen:** Left margin, drawing focus during the key creation phase.
* **Where it NEVER Appears:** Settings menus, device management consoles, or pop-up dialogue cards.
* **Geometric Lock:** Placed exactly **24px** from the left viewport edge on mobile, and **40px** on tablet/desktop.

---

## 7. Identity Stress-Test & Verification

* **archival Paper (Print):** Verified. Deep forest green ink on textured paper has high tactile appeal.
* **Mobile Screen:** Verified. Refinement A demonstrates excellent legibility and warmth.
* **Smartwatch (Watch Icon):** Verified. The 16px solid loop silhouette remains instantly recognizable on small displays.
* **Embossed/Debossed:** Verified. The monoline paths and wide wordmark tracking translate cleanly into physical metal stamp textures.
* **Monochrome (Laser-Etched):** Verified. The flat vector shapes engrave accurately on stone-gray hardware metals.
* **Dark Mode (CHARCOAL SLATE):** Verified. The bone-white symbol on `#0F172A` Slate maintains identical proportions with adjusted contrast.
