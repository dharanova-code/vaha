
# User Journey Map v1.0

## Journey 9. Privacy & Data Management

**Status:** Draft for Review

---

# Purpose

Help users understand, control, and trust how their thoughts are stored, synchronized, exported, and removed without requiring technical knowledge.

Privacy is not presented as a settings page. It is presented as a promise the product continually keeps.

The experience should reinforce one belief:

> **"My thoughts belong to me. Vaha simply protects them."**

---

# Primary User Goal

Feel confident that personal thoughts remain under their control while being able to manage data confidently whenever they choose.

---

# Trigger

The journey begins when the user:

* Opens **Settings → Privacy & Data**.
* Chooses to connect or disconnect cloud synchronization.
* Wants to export or restore their data.
* Wants to remove captures or clear local data.

---

# Preconditions

* The user has completed onboarding.
* Local storage exists.
* Cloud synchronization may or may not be enabled.
* The app may be online or offline.

---

# Actors

### Primary

* User

### Secondary

* Vaha Companion App

---

# Happy Path

## 1. Privacy & Data Overview

The screen begins with reassurance before presenting controls.

It answers three questions immediately:

* **Where are my thoughts today?**
* **Who controls them?**
* **Is everything protected?**

The overview presents information in plain language, for example:

* Your thoughts are stored on this device.
* Cloud sync is Off.
* You control what leaves your device.

If cloud sync has been enabled, the language remains equally clear:

* Your thoughts are stored on this device.
* Copies are also synchronized to your connected account.
* You can turn this off at any time.

---

## 2. Storage & Ownership

The user can view where data currently exists.

Examples:

* Stored on this device.
* Also synchronized to your connected account (if enabled).

The emphasis is ownership rather than storage locations.

---

## 3. Synchronization Preference

If the user chooses cloud synchronization:

The app clearly explains:

* What will be synchronized.
* When synchronization occurs.
* That local storage always remains the primary copy.

The user explicitly confirms before synchronization begins.

If the user disables synchronization:

The app explains that existing local data remains unchanged.

Cloud copies are handled according to the user's chosen policy, which is explained in plain language before confirmation.

---

## 4. Export & Backup

The user may choose to:

* Export personal data.
* Create a backup.
* Restore from an existing backup.

Each action explains:

* What will happen.
* What will not change.
* Whether confirmation is required.

The experience avoids technical terminology.

---

## 5. Data Removal

The user may:

* Delete a single capture.
* Delete all local data.

For destructive actions:

The app clearly explains the outcome before confirmation.

Where recovery is possible, it is explained.

Where recovery is not possible, the language is direct but calm.

---

## 6. Disconnect Services

If cloud synchronization is connected:

The user may disconnect it.

The app explains:

* What changes.
* What remains on the device.
* What happens to synchronized copies.

The decision is always explicit.

---

## 7. Return to Everyday Use

The user leaves with greater confidence rather than greater concern.

The Privacy & Data section is visited when needed, not as part of everyday use.

---

# Alternate Paths

## Local-Only User

The user never enables cloud synchronization.

The experience remains complete.

No persistent prompts encourage cloud adoption.

---

## Cloud Synchronization Enabled

The overview reflects both local ownership and synchronized copies.

Ownership messaging never changes.

---

## Export Before Device Migration

The user exports data before moving to another device.

The process is straightforward and transparent.

---

## Restore From Backup

The user restores a previously created backup.

The app explains exactly what will be restored before beginning.

---

# Failure Scenarios

## Cloud Temporarily Unavailable

The app explains:

> **Your thoughts remain safely stored on this device. We'll continue when possible.**

The user is never asked to troubleshoot connectivity.

---

## Export Interrupted

The app explains that the export was not completed.

No existing data is affected.

The user can try again later.

---

## Restore Cannot Complete

The app explains the situation in plain language.

Existing local data is protected until the user chooses how to continue.

---

## Delete Confirmation Cancelled

The user changes their mind.

Nothing changes.

No further prompts are shown.

---

## Unexpected Error

The app explains only what matters:

* Your existing thoughts remain safe.
* The requested action could not be completed.
* You can try again later.

---

# Recovery Flow

Recovery follows one principle:

> **Protect the user's ownership before completing the requested action.**

Recovery priorities:

1. Preserve existing data.
2. Prevent accidental loss.
3. Explain the current state clearly.
4. Offer a simple next step.
5. Return the user to a trusted state.

---

# Success Criteria

The journey succeeds when the user:

* Understands where their thoughts are stored.
* Feels in control of synchronization.
* Can export or restore data confidently.
* Can remove data intentionally without fear.
* Leaves with stronger trust in Vaha's privacy promise.

---

# UX Opportunities

## Ownership Before Controls

Begin every visit by reinforcing ownership rather than presenting switches and options.

Privacy starts with understanding, not configuration.

---

## Transparent Decisions

Every meaningful action should answer three questions before confirmation:

* What will happen?
* What will stay the same?
* Can I change this later?

---

## Calm Language

Use reassuring, factual language.

Avoid warning-heavy copy except where irreversible actions genuinely require it.

---

## Local-First Identity

The interface should consistently reinforce that the device is the primary home for the user's thoughts.

Cloud synchronization is presented as an optional convenience, never as the default expectation.

---

## Reversible by Design

Whenever practical, allow users to reverse decisions or cancel before changes are applied.

Irreversible actions should be rare, explicit, and clearly explained.

---

# Future Considerations

The following enhancements should be considered after the core privacy experience is validated:

* Privacy activity history presented in plain language.
* Scheduled automatic backups under user control.
* Selective synchronization of chosen collections or captures.
* Trusted device management for multi-device ownership.
* Portable encrypted backup files, presented as secure backups without exposing cryptographic details.
* Privacy health reminders that encourage backup reviews without creating urgency.

Every enhancement should strengthen user agency while preserving simplicity.

---

# UX Review

## Strengths

* Treats privacy as a core product promise rather than a collection of settings.
* Reinforces local ownership before introducing cloud options.
* Makes every data action explicit and transparent.
* Keeps cloud synchronization entirely optional.
* Uses plain language instead of technical explanations.
* Preserves calm interactions even during sensitive operations such as deletion and restoration.
* Aligns with Offline-first, Privacy-first, Transparency, and Progressive Disclosure principles.

---

# Deliberate Omissions

The following are intentionally excluded from the Privacy & Data journey:

* Database terminology.
* API or networking concepts.
* Encryption algorithm names.
* Storage engine details.
* Synchronization logs.
* Permission matrices.
* Security jargon.
* Fear-based warnings.
* Persistent prompts encouraging cloud adoption.
* Technical backup formats.
* Developer diagnostics.
* Privacy "scores" or gamification.

These omissions ensure that privacy remains understandable without becoming intimidating. The experience focuses on ownership, clarity, and confidence rather than technical implementation.

The ideal outcome is that users leave with one lasting feeling:

> **"My thoughts belong to me. Vaha protects them, and I remain in control."**

### Next Milestone

Once Journey 9 is reviewed and approved, the complete set of User Journey Maps will be frozen. The next architectural deliverable should be the **Information Model**, which defines the relationships between the product's core entities (Capture, Insight, Device, Privacy & Data, Settings, and supporting metadata). This model will become the foundation for low-fidelity wireframes, interaction flows, and eventually the design system.
