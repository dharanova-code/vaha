# Design Specifications - Phase B

This document defines the high-fidelity UX blueprint and layout rules for Vaha companion application interfaces. This document acts as the source of truth for design systems and visual tools.

---

## 1. Companion Application Screens

### 1.1 Home Dashboard Design Spec

#### Experience Description
The Home Dashboard is the core home screen of Vaha. It is designed to feel spacious, content-first, and highly reliable. Upon opening the app, the user is greeted with a minimal layout that emphasizes their latest thoughts. Visual indicators for device connectivity and encryption status give the user immediate peace of mind, while search and tags allow them to locate entries instantly. The overall experience is clean, fast, and structured.

#### 1. Screen Purpose
To display a chronological timeline of voice captures, allow quick keyword/semantic searching, and present real-time physical device connectivity status.

#### 2. Layout Structure
*   **Grid System**: Single-column vertical layout.
*   **Zones**:
    *   **Header Zone (Sticky)**: Anchors to the top of the viewport. Houses app identity, privacy toggle, and device status widget.
    *   **Search and Filter Zone (Sticky/Scroll-retained)**: Directly below the header. Houses search input and horizontal filter chips.
    *   **Timeline Scroll Zone**: Scrollable area filling the remaining viewport.
    *   **Navigation Zone (Fixed)**: Bottom bar spanning the full width of the screen.

#### 3. Component Inventory
*   **App Logo Indicator**: Text-only branding element.
*   **Privacy Mode Toggle**: Touch target to mask/unmask note titles.
*   **Device Status Widget**: Combined indicator for battery, connection, and sync state.
*   **Device Status Popover**: Micro-dialog explaining detailed device state.
*   **Omni-Search Bar**: Text input field with nested leading search icon and trailing voice microphone icon.
*   **Filter Chips**: Horizontal scrollable track of single-selection buttons.
*   **Capture Note Card**: Container encapsulating title, timestamp, duration, tag chips, and ambient telemetry icons.
*   **Bottom Navigation Bar**: Fixed bottom panel containing four tab targets.

#### 4. Card Hierarchy
Within each Note Card:
1.  **AI-Generated Note Title**: Primary reading target. Positioned top-left.
2.  **Encryption and Sync Icons**: Positioned alongside the title on the right margin.
3.  **Timestamp and Duration Metadata**: Secondary text. Placed immediately below the title.
4.  **Metadata Row (Tags & Telemetry)**: Grouped at the bottom of the card. Tags occupy the left-to-center space; ambient sensor icons occupy the right margin.

#### 5. Spacing Intent
*   **Screen Margins**: 16dp outer left and right margins for all main layouts.
*   **Header Spacing**: 12dp vertical padding between status bar and search area.
*   **Search-to-Filter Spacing**: 12dp vertical separation.
*   **Card Spacing**: 16dp vertical spacing between individual timeline note cards.
*   **Card Inner Padding**: 16dp padding on all four inner borders of the note card.
*   **Item Metadata Spacing**: 8dp horizontal gap between individual tag chips and ambient icons.

#### 6. Alignment Rules
*   **Text Alignment**: All primary content text is left-aligned.
*   **Action Elements**: Primary actions (e.g., Favorite, Archive) and device states are right-aligned.
*   **Vertical Center Alignment**: Inline icons (e.g., search icon, micro-microphone, tags) are centered vertically relative to their adjacent text fields.

#### 7. Content Priority
1.  Device status integrity.
2.  Search bar discoverability.
3.   chronological note scannability (Note Title and timestamp).
4.  Secondary details (tags, ambient conditions).

#### 8. Scroll Behaviour
*   **Header & Search Behavior**: Header scrolls off-screen on scroll down, but the Omni-Search Bar pin/sticks to the top of the viewport when it reaches the top edge. On scroll up, the header transitions back down.
*   **Timeline Feed**: Continuous scroll with elastic/inertial physics.
*   **Horizontal Chips**: Non-wrapping, horizontally scrollable container with overflow indicators.

#### 9. Navigation Behaviour
*   **Tapping Note Card**: Smooth slide-in transition from right to left to open the Note Detail Screen.
*   **Tapping Tabs**: Direct instant switch between top-level navigation states (`[Home]`, `[Library]`, `[Insights]`, `[Settings]`).

#### 10. Touch Targets
*   **Note Cards**: Entire card area acts as a touch target (min height 120dp).
*   **Inline Buttons (Star/Archive)**: Sized to 48x48dp interactive bounding boxes, regardless of visual icon footprint.
*   **Filter Chips**: Sized to 36dp height with horizontal padding to achieve at least 48dp touch clearance from adjacent items.
*   **Bottom Navigation Tabs**: Equidistant tabs spanning full width, target size 60dp wide x 56dp high.

#### 11. Empty States
*   **Layout**: Centered illustration placeholder, bold primary message "No Captures Found", secondary explanatory subtitle, and a primary action button "Clear Filters".
*   **Spacing**: 24dp vertical gap between elements.

#### 12. Loading Behaviour
*   **Initial Load**: Skeleton screen replacements for the cards (blank boxes matching card outlines with pulsing opacity).
*   **Incremental Syncing Load**: Small, pulsing progress ring overlaid on the sync status icon of specific note cards that are currently downloading audio.

#### 13. Error Behaviour
*   **System Database Error**: Replaces timeline with centered error card containing an exclamation symbol, primary error text "Database connection lost", error detail subtitle, and a recovery button "Retry Connection".
