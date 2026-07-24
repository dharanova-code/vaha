# Vaha Search Experience Strategy & Philosophy

Version 1.0.0  
Status: Proposal  
Target: Vaha (Search Experience Framework)

---

## 1. The Ten Search Questions

### 1.1 What makes Vaha Search different from traditional search?
Traditional search treats queries as precise database database inputs, looking for exact keywords. Vaha Search is a process of **prompting memory**. It assumes the user remembers the *feeling* or *theme* of a thought (e.g., "that meeting where I felt nervous about the roadmap") rather than the exact filename. It prioritizes semantic mapping and thematic relationships over rigid database queries.

### 1.2 How should users feel while searching?
Users should feel calm and secure, as if they are browsing a familiar bookshelf. There should be no frantic page blinking, loading spinners, or heavy animations. The interface stays clean, spacious, and uncrowded.

### 1.3 What is the ideal empty search state?
The empty state is not a blank sheet or a historical search log. It displays a welcoming, thoughtful prompt (e.g., *"What is on your mind to remember?"*) and a list of **Suggested Recent Threads**—connecting the user back to their active thinking spaces.

### 1.4 How should search evolve as users type?
Search results appear progressively and silently as the user types. The screen does not jump; instead, it uses a soft opacity fade to transition from empty state suggestions to active search results. Results are grouped under "Thematic Connections" (semantic) and "Direct Captures" (exact matches).

### 1.5 How should AI assist without becoming intrusive?
AI remains invisible. There is no chat bubble or assistant telling the user what they found. Instead, AI synthesizes semantic connections behind the scenes, grouping related notes together under auto-generated collection headers and presenting a single-line suggested insight *only* when a clear pattern emerges from their query.

### 1.6 What role should semantic search play?
Semantic search is the default. If a user types *"morning focus,"* the results will display captures about *"clarity at sunrise,"* *"earliest thoughts,"* or *"morning coffee routines,"* using natural language models running locally on their device.

### 1.7 When should filters appear?
Filters are invisible by default. They appear progressively and quietly only when the query produces a high volume of results. They are rendered as simple, flat text labels (e.g., *"This week,"* *"With audio,"* or *"Clarity thread"*) below the search bar, with no heavy container cards or check-boxes.

### 1.8 How should voice search integrate?
Voice search is activated via a simple monoline microphone icon inside the search bar. When tapped, it displays the quiet monoline waveform along the *Margin Thread*, transcribing their spoken search query locally.

### 1.9 How should offline search behave?
Offline search is the foundational default. Because Vaha runs a local vector database, all semantic and exact indexing is computed on-device. The user experience is identical whether they are connected to Wi-Fi or completely offline in a remote area.

### 1.10 What should happen when nothing is found?
If there are no results, Vaha avoids the technical *"0 results found"* message. Instead, it quietly suggests alternative paths: *"No direct threads found. Perhaps search for related themes like clarity or focus?"*

---

## 2. Search Information Hierarchy
1.  **Search Field:** Borderless, single line input with placeholder *"Find a thread of thought..."*
2.  **Margin Thread:** Runs along the left side, anchoring the search results.
3.  **Thematic Connections (Semantic Results):** Listed first. Grouped by conceptual similarity.
4.  **Direct Captures (Exact Matches):** Clean list of direct text matches.
5.  **Suggested Insight (Contextual):** Appears as an italicized margin note in EB Garamond at the bottom.

---

## 3. Interaction Model
*   **Zero-latency Typeahead:** As the user types, results filter progressively.
*   **Swipe to Filter:** When filters appear, they can be swiped horizontally as plain text links.
*   **Tap to Expand:** Tapping a result opens the Capture Detail page directly.
