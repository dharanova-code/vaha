
# User Journey Map v1.0

## Journey 4. Daily Capture Review

**Status:** Draft for Review

---

# Purpose

Help returning users quickly reconnect with their recent thoughts, continue where they left off, and organize captures with minimal effort.

This journey should reinforce one feeling:

> **"Everything I captured is here when I need it."**

The experience prioritizes content over management and encourages review without demanding attention.

---

# Primary User Goal

Review recent captures, continue reading or listening, and perform lightweight organization without disrupting the user's flow.

---

# Trigger

The user:

* Opens the Vaha app.
* Returns to the app after capturing ideas.
* Opens the app to reference previous thoughts.

---

# Preconditions

* At least one capture exists.
* The Home screen displays recent activity.
* The app may be online or offline.
* Synchronization, if available, has already happened or will occur automatically.

---

# Actors

### Primary

* User

### Secondary

* Vaha Companion App

---

# Happy Path

## 1. Home Opens

The Home screen immediately presents meaningful content.

Priority order:

* Continue Reading (if applicable)
* Recent Captures
* Daily Summary (when available)
* Device Status Snapshot

No setup or management tasks interrupt the experience.

---

## 2. User Reviews Recent Captures

The user scans recent captures naturally.

Each capture provides enough context to recognize it without opening every item.

The user selects one capture.

---

## 3. Capture Details

The selected capture opens.

The user may:

* Read the transcript.
* Listen to the recording.
* Make small transcript edits.
* Mark as favorite.
* Archive if no longer needed.

AI-generated summaries or related captures, when available, appear as supporting context rather than competing with the primary content.

---

## 4. Continue Browsing

After reviewing a capture, the user can:

* Return to Home.
* Browse the full Captures library.
* Use global search if looking for something specific.

Navigation remains predictable and lightweight.

---

## 5. Session Ends

The user closes the app.

No manual save actions are required.

Any changes are preserved automatically.

---

# Alternate Paths

## No New Captures

The Home screen displays the most recent captures and any unfinished reading.

The experience remains useful even when no new content has been added.

---

## User Wants an Older Capture

The user enters the global search experience from Home or Captures.

Search results appear immediately and lead directly to Capture Details.

The review journey transitions naturally into the retrieval journey (Journey 5).

---

## User Organizes Multiple Captures

The user opens the Captures library.

They may:

* Archive
* Favorite
* Sort
* Filter

Organization remains lightweight and optional.

---

## User Continues Reading

If a capture was previously left unfinished, Home surfaces it through Continue Reading.

The user resumes without searching.

---

# Failure Scenarios

## Recent Captures Unavailable

Recent captures cannot be displayed temporarily.

The app communicates:

> "We're preparing your library."

The user can still access the Captures library and other available content.

---

## Capture Cannot Be Opened

A specific capture is temporarily unavailable.

The app informs the user and offers Retry.

Other captures remain fully accessible.

---

## Search Returns No Results

The app explains that no matching captures were found.

The user can continue browsing normally without reaching a dead end.

---

## Optional Enhancements Still Preparing

A capture is available, but summaries or related information are not yet ready.

The transcript and recording remain immediately accessible.

Enhancements appear later without interrupting the experience.

---

# Recovery Flow

Recovery follows one principle:

> **Content should remain accessible even when enhancements are unavailable.**

Recovery priorities:

1. Display available captures.
2. Preserve user edits automatically.
3. Retry unavailable enhancements quietly.
4. Never block reading or listening because of secondary features.

---

# Success Criteria

The journey succeeds when the user:

* Finds recent captures immediately.
* Continues previous reading effortlessly.
* Performs organization only if desired.
* Leaves confident that their ideas remain easy to access.
* Experiences no friction regardless of connectivity.

---

# UX Opportunities

## Instant Familiarity

Recent captures should always be the first meaningful content presented after opening the app.

Users should rarely need to navigate elsewhere for everyday use.

---

## Continue Reading

Remember unfinished reading naturally.

Avoid forcing users to remember where they stopped.

---

## Quiet Intelligence

AI-generated summaries, related captures, and contextual insights should support comprehension without becoming the focus of the review experience.

---

## Lightweight Organization

Actions such as favorite, archive, sort, and filter should remain available but never dominate the interface.

Most users should review captures without needing to organize them.

---

## Seamless Search

Search should feel like an extension of browsing rather than a separate workflow.

It should be available whenever needed but invisible when it is not.

---

# Future Considerations

These enhancements should be considered only after the core review experience is validated:

* Smart resurfacing of older captures based on relevance rather than age.
* Recently edited filter.
* Pinning important captures.
* Optional reading history across devices.
* Gentle review suggestions after extended periods of inactivity.

Each enhancement should reduce effort rather than increase interaction.

---

# UX Review

## Strengths

* Places content ahead of controls.
* Supports both quick reviews and deeper reading without changing workflows.
* Maintains identical behavior online and offline.
* Uses AI only to enrich existing content rather than creating a separate destination.
* Keeps organization optional, preventing the experience from feeling like a productivity tool.
* Reinforces trust by ensuring captures remain consistently available.

## Deliberate Omissions

The following are intentionally excluded from the daily review journey:

* Manual synchronization.
* Dashboard analytics.
* Notification inboxes.
* Task management concepts.
* AI chat interactions.
* Bulk management as the default behavior.
* Device configuration prompts.
* Privacy or settings interruptions.
* Tutorial overlays.

These capabilities either belong to other journeys or would distract from the primary objective: helping users effortlessly reconnect with their thoughts. The ideal outcome is that opening Vaha feels less like checking an app and more like opening a trusted notebook that is always organized and ready.
