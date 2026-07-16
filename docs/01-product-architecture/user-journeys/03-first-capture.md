
# User Journey Map v1.0

## Journey 3. First Capture

**Status:** Draft for Review

---

# Purpose

Guide the user's first end-to-end capture experience, from speaking an idea to seeing it safely available in the companion app.

The journey should answer one critical question:

> **"Can I trust Vaha to remember my ideas?"**

Success is measured by confidence, not by demonstrating technology.

---

# Primary User Goal

Capture an idea effortlessly and know it has been safely preserved without needing to manage the process.

---

# Trigger

The user says the wake phrase:

> **"Marvin"**

followed by their spoken idea.

The capture ends naturally when the user finishes speaking or explicitly indicates they are done, according to the approved product behavior.

---

# Preconditions

* The Vaha device has been paired successfully.
* The device is powered on and ready.
* Local storage is available.
* The companion app may be open, running in the background, or completely closed.
* Internet connectivity may or may not be available.

---

# Actors

### Primary

* User

### Secondary

* Vaha Device
* Vaha Companion App

---

# Happy Path

## 1. Capture Begins

The user speaks the wake phrase.

The device quietly transitions into listening mode.

No phone interaction is required.

No notification interrupts the user.

---

## 2. User Speaks Naturally

The user shares their thought.

The device records naturally without requiring commands or structured input.

The user focuses entirely on the idea.

---

## 3. Capture Ends

The user finishes speaking.

The device completes the capture.

The capture is immediately secured in local storage before any further processing.

This is the product's first and most important guarantee.

---

## 4. Local Processing

The device prepares the capture for use.

Any processing happens automatically.

The user is never asked to wait.

---

## 5. Companion App Updates

When the app next becomes active, or if it is already running, the new capture appears automatically.

The Home screen updates with the latest capture.

If synchronization is possible, it occurs quietly in the background.

The user is never asked to initiate synchronization manually.

---

## 6. Capture Available

The capture is ready to open.

The user can:

* Read it.
* Listen to it.
* Edit it.
* Organize it.

The journey ends.

---

# Alternate Paths

## App Closed

The companion app is not running.

Result:

The capture remains safely stored locally.

The next time the app opens, it discovers the new capture automatically.

No action is required from the user.

---

## Offline

No internet connection exists.

Result:

The capture behaves exactly the same.

Everything remains available locally.

If cloud synchronization is enabled, it occurs automatically whenever connectivity returns.

No warnings are shown because nothing is wrong.

---

## Multiple Captures

The user records several ideas before opening the app.

Result:

All captures appear in chronological order.

No user intervention is required.

---

## User Opens the App During Processing

If the capture is still becoming available:

The Home screen calmly indicates:

> "Preparing your latest capture..."

The user can continue using the rest of the app.

No blocking screens are shown.

---

# Failure Scenarios

## Local Storage Nearly Full

The device successfully saves the current capture.

The user is informed afterward that storage is becoming limited.

The current idea is never discarded to make room.

---

## Capture Could Not Be Processed Completely

The original recording remains safely preserved.

The companion app displays the capture with a status indicating that some enhancements are still pending.

Core access is never blocked.

---

## Companion App Not Available

The phone is turned off or unavailable.

The capture remains stored on the device.

It appears automatically when the companion app next becomes available.

---

## Synchronization Delayed

Automatic synchronization cannot occur immediately.

No interruption is shown.

The capture remains fully usable locally.

---

## Unexpected Interruption

An unexpected interruption occurs after recording but before processing completes.

If the original recording was safely stored, recovery resumes automatically during the next processing opportunity.

The user is never asked to repeat the capture unless absolutely unavoidable.

---

# Recovery Flow

Recovery follows one guiding principle:

> **Protect the user's idea before improving it.**

Recovery priorities:

1. Preserve the original capture.
2. Resume interrupted processing automatically.
3. Synchronize later when appropriate.
4. Inform the user only when meaningful action is required.

No manual recovery workflow is expected for normal users.

---

# Success Criteria

The journey succeeds when the user:

* Feels that capturing an idea required almost no effort.
* Trusts that the idea has been safely preserved.
* Finds the capture naturally inside the app.
* Never wonders whether the capture was lost.
* Never needs to understand how it reached the app.

---

# UX Opportunities

## Capture Confidence

Immediately after the first successful capture becomes available, reinforce trust with a brief, unobtrusive confirmation such as:

> "Your first idea is ready."

This celebrates success without becoming celebratory or distracting.

---

## Invisible Reliability

The system should quietly handle storage, preparation, and synchronization.

Users should think:

> "Vaha remembered."

not

> "The sync worked."

---

## Progressive Availability

If optional enhancements (such as summaries or related captures) require additional time, the capture should appear first.

Enhancements can follow later.

Content availability always takes priority over feature completeness.

---

## Non-Interruptive Updates

Avoid modal dialogs announcing successful synchronization or processing.

The updated capture itself is the confirmation.

---

## Calm Empty-State Transition

The first successful capture naturally transforms the Home and Captures screens from their onboarding empty states into meaningful content.

No additional tutorial is needed.

---

# Future Considerations

These enhancements should be evaluated only after the core capture experience is proven reliable:

* Gentle confirmation through subtle device feedback after a successful capture.
* Automatic grouping of closely timed captures into sessions.
* Contextual suggestions based on the first few captures.
* Optional reminders to review recent ideas after periods of inactivity.
* Cross-device continuity when multiple trusted Vaha devices are introduced.

---

# UX Review

## Strengths

* Prioritizes protecting the user's idea above all else.
* Keeps the user's attention on thinking rather than managing technology.
* Maintains identical behavior whether online or offline.
* Builds trust through predictable, unobtrusive feedback.
* Removes unnecessary decisions from the capture process.
* Preserves a calm experience by avoiding notifications, progress dialogs, and technical messaging.

## Deliberate Omissions

The following are intentionally excluded from the first capture journey:

* Manual save actions.
* Manual synchronization.
* Recording controls in the companion app.
* Technical processing indicators.
* Network status messages.
* AI configuration.
* Metadata editing during capture.
* Share prompts.
* Notification permission requests.
* Tutorials after capture.

These capabilities either belong to later workflows or are intentionally automated. The first capture experience should leave the user with one lasting impression:

> **"I had an idea. Vaha remembered it."**
