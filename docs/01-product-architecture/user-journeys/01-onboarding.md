
# User Journey Map v1.0

## Journey 1. First-Time User Onboarding

**Status:** Draft for Review

---

# Purpose

Introduce new users to Vaha, establish trust, communicate the product's value, and guide them to a successful first experience with minimal cognitive load.

This journey should answer three questions before asking the user to do anything:

1. What is Vaha?
2. Why should I trust it?
3. What should I do first?

---

# Primary User Goal

Understand how Vaha works and reach a usable app state with confidence, whether or not the hardware is immediately available.

---

# Trigger

* User launches the Vaha companion app for the first time.

---

# Preconditions

* App is installed.
* No previous onboarding has been completed.
* No paired Vaha device exists.
* Local storage is available.

---

# Actors

### Primary

* User

### Secondary

* Vaha Mobile App

### Optional

* Vaha Device (only if available during onboarding)

---

# Happy Path

### 1. Welcome

The app introduces Vaha in one concise message:

* Capture ideas effortlessly.
* Your data stays yours.
* Works offline by default.

**Decision**

* Continue

---

### 2. Privacy & Offline Promise

Before requesting anything, explain:

* Captures are stored locally first.
* Internet is optional.
* AI insights are optional.
* User controls their data.

**Decision**

* Continue

---

### 3. Optional Device Check

Ask a simple question:

> "Do you have your Vaha device with you?"

Options:

* Yes
* Not Now

No scanning starts automatically.

---

### Path A. User has the device

Proceed to the pairing journey (Journey 2).

After successful pairing:

Return to Home.

---

### Path B. User does not have the device

Skip pairing without penalty.

Proceed directly to Home.

The app remains usable and clearly indicates that a device can be paired later.

---

### 4. Home

The user reaches Home.

If no captures exist:

Display the empty state explaining that captures will appear after using the Vaha device.

If paired:

Display device status and readiness.

---

# Alternate Paths

## Skip Pairing

The user chooses "Not Now."

Result:

* Onboarding completes.
* Home opens.
* Device card gently encourages pairing later.
* No repeated prompts or interruptions.

---

## Device Not Available

The app cannot find a device during onboarding.

Result:

* Offer Retry.
* Offer Skip.
* Continue without blocking the user.

---

## User Closes the App Mid-Onboarding

On the next launch:

Resume from the last completed onboarding step instead of restarting.

---

# Failure Scenarios

## Device Discovery Fails

Possible causes:

* Device powered off.
* Bluetooth disabled.
* Out of range.

User message:

> "We couldn't find your Vaha device. You can try again now or pair it later."

---

## Permission Denied

A required system permission is declined.

Do not present technical language.

Explain:

* Why it is needed.
* That the app remains usable where possible.
* How to enable it later if desired.

---

## Unexpected App Error

The onboarding state cannot be restored.

Fallback:

Restart onboarding while preserving any completed configuration.

---

# Recovery Flow

The recovery strategy prioritizes progress preservation.

* Resume from the last completed step.
* Never require repeating already accepted information.
* Allow pairing later from the Device screen.
* Provide contextual permission requests only when needed.

---

# Success Criteria

The journey is successful when the user:

* Understands Vaha's purpose.
* Understands the privacy model.
* Reaches Home.
* Feels confident using the app.
* Can defer hardware setup without feeling blocked.

---

# UX Opportunities

### Build Trust Before Requests

Introduce privacy and offline behavior before requesting permissions or device access.

---

### Progressive Disclosure

Avoid explaining advanced concepts such as synchronization, firmware, storage policies, or AI configuration during onboarding.

These belong in later contextual experiences.

---

### Non-Blocking Setup

Pairing should be encouraged, not required.

Users should never feel trapped in onboarding because the hardware is unavailable.

---

### Calm Communication

Avoid progress percentages or lengthy tutorials.

Each step should focus on a single decision or concept.

---

### Contextual Permissions

Request system permissions only when they are needed by a user action, rather than bundling them into onboarding.

This reduces friction and aligns with platform best practices.

---

# Future Considerations

These enhancements should be considered only after the core experience is validated:

* Accessibility-aware onboarding that adapts to system settings.
* Personalized onboarding based on returning user state or restored backups.
* Interactive product tour after the first successful capture, rather than before.
* Optional "What's New" experience for major product updates, separate from first-time onboarding.

---

# UX Review

### Strengths

* Establishes trust before requesting access.
* Makes hardware optional during onboarding.
* Preserves progress across interruptions.
* Minimizes cognitive load through progressive disclosure.
* Aligns with Vaha's offline-first and privacy-first principles.

### Deliberate Omissions

To keep the first experience focused, the following are intentionally excluded:

* Account creation.
* Cloud sign-in.
* AI feature explanations.
* Notification permission prompts.
* Firmware checks.
* Device diagnostics.
* Sync configuration.
* Advanced settings.
* Feature tours or walkthrough videos.

These are deferred until the user reaches the appropriate context, keeping the onboarding calm, concise, and centered on building confidence rather than teaching every capability upfront.
