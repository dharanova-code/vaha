# Interaction Specifications - Phase B

This document details the interaction models, triggers, and failure behaviors for the screens defined in Vaha.

---

## 1. Companion Application Screens

### 1.1 Home Dashboard Interaction Spec

#### 1. Tap Note Card (Navigate to Detail)
*   **Trigger**: Tap gesture on any Note Card in the timeline.
*   **System Response**: Opens the Note Detail Screen loaded with the selected capture's data model.
*   **User Feedback**: Visual press transition (depth/opacity change) and immediate transition to the Detail Screen.
*   **Success Path**: Card tapped $\rightarrow$ Detail screen loads successfully with transcription, audio waveform, and telemetry.
*   **Failure Path**: Database read fails $\rightarrow$ Show inline toast notification: "Failed to open capture. Please try again."
*   **Offline Behaviour**: Fully functional. Captures are cached locally in the database.
*   **Recovery Behaviour**: If the record fails to load, the app remains on the Home Dashboard; the user can tap again to retry.

#### 2. Tap Favorite/Archive Quick-Action (Toggle State)
*   **Trigger**: Tap gesture on `[Favorite]` (Star icon) or `[Archive]` button within a Note Card.
*   **System Response**: Toggles the boolean state of the attribute (`is_favorite` or `is_archived`) in the local database and dynamically updates the UI feed.
*   **User Feedback**: Instant icon state change (e.g., filled star vs empty star; card fades out if archiving).
*   **Success Path**: Attribute toggled in local database $\rightarrow$ UI updates state.
*   **Failure Path**: Write operation fails $\rightarrow$ Revert icon visual state; display brief warning message: "Could not save preference."
*   **Offline Behaviour**: Fully functional. Saves to the local relational database immediately. Will sync metadata status to the cloud when online.
*   **Recovery Behaviour**: Automatically rolls back the visual toggle to match the actual database state on error.

#### 3. Tap Device Status Widget (Navigate to Portal)
*   **Trigger**: Tap gesture on the Device Status Widget in the Header.
*   **System Response**: Navigates to the Device Management Portal.
*   **User Feedback**: Visual press transition on the widget and instant screen transition.
*   **Success Path**: Widget tapped $\rightarrow$ Device Portal opens.
*   **Failure Path**: None (local route transition).
*   **Offline Behaviour**: Fully functional; the Device Management Portal displays cached device data and current BLE status.
*   **Recovery Behaviour**: N/A (standard local routing).

#### 4. Focus Omni-Search Bar (Search Mode)
*   **Trigger**: Tap gesture inside the Search input field.
*   **System Response**: Focuses the input, opens the software keyboard, and shifts the timeline view to displaying dynamic search results.
*   **User Feedback**: Active text cursor appears; placeholder text disappears.
*   **Success Path**: Input focused $\rightarrow$ Keyboard opens $\rightarrow$ Typing queries database and updates timeline in real-time.
*   **Failure Path**: Keyboard fails to open or search query crashes database thread $\rightarrow$ Fall back to static timeline; show toast "Search unavailable."
*   **Offline Behaviour**: Performs local full-text and tag searches on the local SQLite/relational cache.
*   **Recovery Behaviour**: If query crashes, clear the search input and revert to the default chronological timeline.

#### 5. Tap Voice Search Trigger (Voice Input)
*   **Trigger**: Tap gesture on the microphone icon inside the Search bar.
*   **System Response**: Displays overlay sheet saying "Listening..." and starts recording audio from host phone's mic.
*   **User Feedback**: Microphone sound cue or haptic click; real-time audio amplitude wave indicator on the overlay.
*   **Success Path**: User speaks search query $\rightarrow$ Local voice-to-text processes query $\rightarrow$ Populates search bar and displays results.
*   **Failure Path**: Microphone permission denied or voice recognition engine fails $\rightarrow$ Dismiss listening overlay; show toast "Voice search failed. Please type instead."
*   **Offline Behaviour**: Runs local, offline speech-to-text translation if the offline transcription module is active on the companion host. If unavailable, falls back to typing.
*   **Recovery Behaviour**: Automatically closes voice overlay and focuses the standard text input on failure.

#### 6. Tap Quick-Filter Chip (Filter Toggle)
*   **Trigger**: Tap gesture on `[Recent]`, `[Starred]`, or `[Today]`.
*   **System Response**: Toggles filter state; instantly filters the chronological timeline list based on the criteria.
*   **User Feedback**: Chip transitions to active visual state; list content filters with a transition.
*   **Success Path**: Filter applied $\rightarrow$ List filtered.
*   **Failure Path**: Database query fails $\rightarrow$ Unselect chip; show warning.
*   **Offline Behaviour**: Fully functional offline using local database queries.
*   **Recovery Behaviour**: Reverts timeline query to previous active filter.

#### 7. Tap `[+] Add Filter` (Open Filter Modal)
*   **Trigger**: Tap gesture on the `[+] Add Filter` chip.
*   **System Response**: Displays the bottom-sheet Filter Builder Modal.
*   **User Feedback**: Modal slides up from bottom of the screen.
*   **Success Path**: Modal displays $\rightarrow$ User selects options $\rightarrow$ Taps `[Apply]` $\rightarrow$ Modal dismisses and timeline filters.
*   **Failure Path**: None.
*   **Offline Behaviour**: Fully functional.
*   **Recovery Behaviour**: N/A.
