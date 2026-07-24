# Low-Fidelity Wireframe Specifications - Phase B

This document defines the wireframe layouts, interactive structures, states, and section justifications for the Vaha Companion Application.

---

## 1. Companion Application Screens

### 1.1 Home Dashboard Wireframe Spec

#### Layout Overview & ASCII Diagram (Default State)

```text
+-------------------------------------------------------------------+
| [Vaha Logo]                               [Device: On/92%/Synced] | <--- Header
+-------------------------------------------------------------------+
|  [ Search captures, tags, or telemetry...               ] (Audio) | <--- Search
+-------------------------------------------------------------------+
| Quick Filters:  [Recent]  [Starred]  [Today]  [+] Add Filter     | <--- Filter Chips
+-------------------------------------------------------------------+
|                                                                   |
|  RECENT CAPTURES (3)                                              | <--- List Section
|  +-------------------------------------------------------------+  |
|  | "Shower thought on neural networks"             [Favorite]  |  | <--- Card Item
|  | 10:24 AM - Today | Duration: 2m 14s                         |  |
|  | Tags: [AI] [Math]                                           |  |
|  | Sensors: [Flow Active: High] [Temp: 38C]                    |  |
|  +-------------------------------------------------------------+  |
|                                                                   |
|  +-------------------------------------------------------------+  |
|  | "Vaha BLE protocol synchronization bug"         [Archive]   |  |
|  | 08:15 AM - Today | Duration: 0m 45s                         |  |
|  | Tags: [Work] [Hardware]                                     |  |
|  | Sensors: [Flow Active: Off]                                 |  |
|  +-------------------------------------------------------------+  |
|                                                                   |
|  +-------------------------------------------------------------+  |
|  | "Recipe idea: Ginger-lemongrass cod fish"                   |  |
|  | Yesterday, 7:30 PM | Duration: 1m 30s                       |  |
|  | Tags: [Cooking] [Personal]                                  |  |
|  | Sensors: [Humidity: 85%]                                    |  |
|  +-------------------------------------------------------------+  |
|                                                                   |
+-------------------------------------------------------------------+
|  [Home]             [Library]             [Insights]   [Settings] | <--- Bottom Navigation
+-------------------------------------------------------------------+
```

---

#### 1. Header
*   **Layout & Alignment**: Left-aligned "Vaha Logo" text branding; right-aligned "Device Status Widget" containing text indicators for Connection (e.g., On/Off), Battery %, and Sync state.
*   **Justification**: Gives immediate confirmation of the hardware's active status and data ingestion health without navigating deep into settings.

#### 2. Body
*   **Layout & Alignment**: Top-to-bottom vertical stack: Search Bar $\rightarrow$ Filter Chips $\rightarrow$ Captures Timeline List.
*   **Justification**: Establishes a natural reading order, moving from search utility down to passive timeline browsing.

#### 3. Sections
*   **Timeline List Header**: "RECENT CAPTURES (count)".
*   **Justification**: Contextualizes the timeline scope, helping users understand they are looking at chronological entries.

#### 4. Cards
*   **Capture Note Card**: Grouped block containing:
    *   Row 1: Title (left), Action Icons (right - e.g., Star/Favorite, Archive status).
    *   Row 2: Timestamp (left), Duration (right).
    *   Row 3: Tag chips (horizontal list).
    *   Row 4: Environmental sensor status chips (flow rate, temperature, humidity context during capture).
*   **Justification**: Organizes multiple distinct metadata types (AI synthesis, temporal info, taxonomy, and physical environment context) into a single scannable unit.

#### 5. Lists
*   **Captures List**: Vertical scrollable container of Note Cards with 16dp spacing.
*   **Justification**: Prevents visual crowding and separates individual audio note entities.

#### 6. Actions
*   **Tap Note Card**: Triggers navigation to the Note Detail screen.
*   **Tap Device Widget**: Triggers navigation to the Device Management Portal.
*   **Tap Filter Chip**: Toggles timeline filter constraint.

#### 7. Bottom Navigation
*   **Layout**: Fixed, full-width bottom bar with 4 equidistant targets: `[Home]`, `[Library]`, `[Insights]`, `[Settings]`. `[Home]` is visually highlighted as active.
*   **Justification**: Provides persistent, primary navigation across the app's top-level namespaces.

#### 8. Floating Elements
*   *None on this screen.*

#### 9. Modals
*   **Filter Builder Modal (Triggered by "[+] Add Filter")**:
    ```text
    +-------------------------------------------------------------+
    | Filter By                                               [X] |
    +-------------------------------------------------------------+
    |  Tags:                                                      |
    |  [ ] AI  [ ] Work  [ ] Cooking  [ ] Personal                |
    |                                                             |
    |  Sensors Active During Capture:                             |
    |  [ ] Water Flow On    [ ] Humidity > 80%                    |
    |                                                             |
    |  Date Range:                                                |
    |  (o) All  ( ) Past 24h  ( ) Past 7 Days                     |
    |                                                             |
    |  [ Clear All ]                                 [ Apply ]    |
    +-------------------------------------------------------------+
    ```
*   **Justification**: Keeps advanced filtering logic out of the main timeline view until specifically requested, avoiding visual noise.

#### 10. Search
*   **Omni-Search Bar**: Persistent input field featuring a search icon at the start and a microphone icon at the end (for direct voice commands/search queries).

#### 11. Empty State
```text
+-------------------------------------------------------------------+
| [Vaha Logo]                               [Device: On/92%/Synced] |
+-------------------------------------------------------------------+
|  [ Search captures, tags, or telemetry...               ] (Audio) |
+-------------------------------------------------------------------+
|                                                                   |
|                                                                   |
|                       No Captures Found                           |
|         Try adjusting your search filters or record an            |
|         audio capture on your physical Vaha device.               |
|                                                                   |
|                     [ Clear All Filters ]                         |
|                                                                   |
|                                                                   |
+-------------------------------------------------------------------+
|  [Home]             [Library]             [Insights]   [Settings] |
+-------------------------------------------------------------------+
```
*   **Justification**: Explains *why* the screen is blank and provides a direct remedy button ("Clear All Filters") to reset the state.

#### 12. Loading State
```text
+-------------------------------------------------------------------+
| [Vaha Logo]                               [Device: On/92%/Synced] |
+-------------------------------------------------------------------+
|  [ Search captures, tags, or telemetry...               ] (Audio) |
+-------------------------------------------------------------------+
|                                                                   |
|                                                                   |
|                       Loading captures...                         |
|                      [ Progress Indicator ]                       |
|                                                                   |
|                                                                   |
+-------------------------------------------------------------------+
|  [Home]             [Library]             [Insights]   [Settings] |
+-------------------------------------------------------------------+
```
*   **Justification**: Provides clear feedback that the companion app is waiting for local database retrieval or sync processing.

#### 13. Error State
```text
+-------------------------------------------------------------------+
| [Vaha Logo]                               [Device: On/92%/Synced] |
+-------------------------------------------------------------------+
|  [ Search captures, tags, or telemetry...               ] (Audio) |
+-------------------------------------------------------------------+
|                                                                   |
|         [!] Database Connection Error                             |
|         Failed to load recent captures.                           |
|         Error Code: DB_ERR_READ_LOCAL                             |
|                                                                   |
|                       [ Retry Query ]                             |
|                                                                   |
|                                                                   |
+-------------------------------------------------------------------+
|  [Home]             [Library]             [Insights]   [Settings] |
+-------------------------------------------------------------------+
```
*   **Justification**: Informs the user of the system failure point and offers a concrete way to attempt recovery ("Retry Query").
