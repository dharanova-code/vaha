# UX Specifications - Phase B

This document defines the production-grade UX specifications for Vaha Companion Application screens.

---

## 1. Companion Application Screens

### 1.1 Home Dashboard

#### 1. Screen Objective
To provide the user with an immediate, high-density overview of recent capture activities, quick entry into capture searching/filtering, and real-time status of their physical device.

#### 2. User's Primary Intention
To review recent voice captures, see if new audio notes have synced/processed, or quickly find a specific past capture.

#### 3. Primary Action
- **Initiate Search/Filter (Omni-Search Bar)**: Allow the user to tap the search input to begin finding, filtering, or querying their notes (via text or voice).

#### 4. Secondary Actions
- **Select Note Card**: Tap on any note card in the timeline to navigate to the Note Detail Screen.
- **View Device Details**: Tap on the Device Status Widget to navigate to the Device Management Portal.
- **Quick-Filter by Tags**: Tap on tag chips within note cards or a filter panel (if open) to refine the timeline list.
- **Voice Search Trigger**: Tap the microphone icon within the Omni-Search Bar to trigger a voice query interface.

#### 5. Information Hierarchy
1. **Device Connection & Status**: Extremely high visibility status of the physical hardware (connected, syncing progress, battery/storage warnings).
2. **Search Input**: Prominent global query point at the top of the interface.
3. **Recent Timeline / Captures**: Chronological list of processed note cards.
4. **Note Card Details**: Within each card:
   - AI-Generated Title (High prominence)
   - Timestamp (Medium prominence)
   - Environmental/Ambient Icons (Low-medium prominence, contextual)
   - Tag Chips (Low prominence)

#### 6. Layout Hierarchy
- **Header Zone**: Positioned at the very top. Contains the Device Status Widget (typically top-right/top-left) and global navigation entry points.
- **Search Zone**: Anchored below the header or as a sticky element at the top. Houses the Omni-Search Bar.
- **Main Timeline Zone**: The primary scrollable viewport, taking up the majority of the screen space below the search zone. Contains a scrollable feed of note cards.
- **Note Card Layout**: Flex/grid container containing:
   - Header row: AI-generated title and timestamp.
   - Body/footer row: Associated tag chips and ambient sensor icons grouped together.

#### 7. Content Grouping
- **Device Status Group**: Combines battery state, sync status (active syncing vs. synced), and storage warnings into a single visual status block/widget.
- **Timeline Card Group**: Each card represents a single discrete capture event, keeping all its metadata (title, timestamp, tags, telemetry indicators) self-contained.
- **Search & Filter Group**: Groups the text input field, voice-search trigger, and any active quick-filter chips.

#### 8. Interaction Priorities
1. **Tap to Open Note**: High-frequency interaction. The entire card area is a tap target.
2. **Scroll Timeline**: Inertial scrolling with clear separation between cards.
3. **Initiate Search**: Input field focus triggers keyboard and overlay search suggestions.
4. **Device Widget Tap**: Tap target restricted to the widget block.

#### 9. Progressive Disclosure Rules
- **Detailed Environmental Telemetry**: Note cards show ambient indicators (e.g., icons indicating shower flow active, or temperature anomalies) but do not show raw numbers/gauges. Full telemetry graphs/gauges are disclosed only on the Note Detail Screen.
- **Search Filters**: Advanced filters (date range, specific sensors, collections) are hidden behind a filter toggle inside the Omni-Search Bar and are disclosed only upon user tap.
- **Full Transcripts**: Timeline cards show only the AI-generated title and tags; the full transcript and AI summaries are disclosed only when entering the Note Detail Screen.

#### 10. Accessibility Considerations
- **Touch Target Sizes**: All interactive elements (Note cards, Device Status Widget, voice icon, tag chips) must have a minimum touch target size of 48x48 dp.
- **Screen Reader Navigation**: Timeline must follow chronological reading order (Title -> Date/Time -> Ambient Conditions -> Tags).
- **Search Input Announcement**: Ensure screen readers announce the state of search results count dynamically when the user types or speaks.
- **Device Status State**: The Device Status Widget must expose semantic properties indicating battery percentage, storage level, and sync state in text descriptions for screen readers (not just icons).
