
### Applied Refinement to Journey 4 (Frozen)

The Home content priority is updated to:

1. **Continue Reading** *(if available)*
2. **Recent Captures**
3. **Suggested Insight** *(optional, only when genuinely useful)*
4. **Daily Summary** *(only when meaningful)*
5. **Device Snapshot** *(only when user attention is required)*

This better reflects Vaha's philosophy that **content always comes before status**, and that the Home screen should feel like a calm companion rather than a dashboard.

**Journey 4 is now frozen.**

---

# User Journey Map v1.0

## Journey 5. Finding an Old Capture

**Status:** Draft for Review

---

# Purpose

Help users rediscover a past idea effortlessly, even when they remember only fragments rather than exact details.

The journey should reinforce one belief:

> **"I don't have to remember everything. Vaha remembers with me."**

The experience should feel like recalling a memory, not searching through files.

---

# Primary User Goal

Find a previously captured idea quickly using whatever information the user remembers, then continue working with it naturally.

---

# Trigger

The user wants to revisit a past idea and initiates search from:

* Home
* Captures

Search is invoked as a capability, not entered as a separate destination.

---

# Preconditions

* One or more captures exist.
* Captures are locally available.
* Search capability is ready.
* The app may be online or offline.

---

# Actors

### Primary

* User

### Secondary

* Vaha Companion App

---

# Happy Path

## 1. User Begins Recall

The user remembers something about an idea, such as:

* A phrase
* A topic
* A person
* A place
* A feeling
* A rough time
* A situation

The user opens search from Home or Captures.

---

## 2. Natural Search

The user enters whatever they remember.

The app immediately begins narrowing results.

The user never needs to choose a search mode.

---

## 3. Relevant Results

Results are presented in order of likely relevance rather than simply by date.

Each result provides enough context to support recognition, including elements such as:

* Capture title
* Transcript excerpt
* Capture date
* Optional contextual cues (for example, tags or summary snippets)

The goal is recognition, not exhaustive reading.

---

## 4. User Recognizes the Capture

The user selects the correct result.

Capture Details opens immediately.

The search experience ends naturally.

---

## 5. Continue Naturally

The user can now:

* Read the transcript.
* Listen to the recording.
* Edit the capture.
* Organize it.
* Continue exploring related captures if available.

No additional workflow is required.

---

# Alternate Paths

## Browsing Instead of Searching

The user decides not to search.

They browse Recent Captures or the full Captures library instead.

The transition feels seamless.

---

## Very Broad Search

The user searches using a common word.

The app presents the most relevant results first while encouraging refinement only if necessary.

The experience remains uncluttered.

---

## Time-Based Recall

The user remembers approximately when the idea was captured.

The app naturally surfaces captures from that period without requiring complex date filters.

---

## Context-Based Recall

The user remembers a theme or situation rather than exact wording.

The app quietly uses available metadata and optional AI enhancements to improve relevance.

The user never needs to understand how matching works.

---

# Failure Scenarios

## No Matching Capture

No relevant captures are found.

The app responds calmly:

> "We couldn't find a matching capture."

Suggestions include:

* Try a different word or phrase.
* Browse recent captures.
* Explore your capture library.

The user never reaches a dead end.

---

## Too Many Results

A search returns many possible matches.

The app progressively narrows the list as the user continues typing.

If needed, lightweight filters can be applied without interrupting the flow.

---

## Capture Temporarily Unavailable

A selected capture cannot be opened immediately.

The app offers Retry while keeping the search results available.

The user does not lose their place.

---

## Optional Enhancements Unavailable

Contextual enhancements are temporarily unavailable.

Search still functions using available capture information.

Discovery remains fully usable.

---

# Recovery Flow

Recovery follows one principle:

> **Searching should always move the user closer to the memory they are trying to recover.**

Recovery priorities:

1. Preserve the user's search query.
2. Keep current results visible.
3. Allow refinement without restarting.
4. Fall back gracefully to browsing when appropriate.

---

# Success Criteria

The journey succeeds when the user:

* Finds the intended capture with minimal effort.
* Does not need to remember exact wording.
* Feels that Vaha understands the intent behind the search.
* Moves naturally from discovery into reviewing the capture.
* Trusts Vaha as a long-term memory companion rather than a storage system.

---

# UX Opportunities

## Recognition Over Recall

Design search to help users recognize the correct capture instead of requiring perfect memory.

Contextual snippets are more valuable than filenames.

---

## Search Without Modes

Avoid separate search categories such as "Transcript," "Tags," or "Summaries."

Users should search once and let Vaha interpret the intent.

---

## Quiet Intelligence

When available, AI should subtly improve ranking and contextual understanding.

It should never ask the user to choose between "normal" and "AI" search.

---

## Progressive Refinement

Allow users to begin broadly and naturally narrow their search through continued typing or simple contextual filters.

Avoid overwhelming advanced search interfaces.

---

## Seamless Transition

Opening a search result should feel identical to opening a capture from anywhere else in the app.

Search disappears as soon as it has served its purpose.

---

# Future Considerations

The following enhancements should be evaluated after the core discovery experience proves reliable:

* Semantic recall that better understands concepts rather than exact wording.
* Natural language search such as "the idea I recorded after my meeting."
* Recently revisited captures.
* Smart resurfacing of frequently referenced ideas.
* Optional voice-initiated search from within the app.

Each enhancement should reduce cognitive effort rather than increase feature complexity.

---

# UX Review

## Strengths

* Treats search as a lightweight capability rather than a destination.
* Prioritizes relevance over chronology, matching how people remember ideas.
* Supports fragmented memories without requiring precise input.
* Preserves a consistent experience regardless of connectivity.
* Uses AI only to improve discovery behind the scenes.
* Maintains continuity by transitioning directly into Capture Details without introducing new workflows.

## Deliberate Omissions

The following are intentionally excluded from the retrieval journey:

* File names as the primary search target.
* Advanced search builders.
* Boolean operators.
* Separate AI search modes.
* Manual indexing controls.
* Technical search settings.
* Search history management screens.
* Ranking explanations.
* Cloud-dependent search behavior.

These omissions keep the experience aligned with Vaha's identity as a trusted memory companion. The user should leave this journey with a simple feeling:

> **"I remembered part of it. Vaha remembered the rest."**
