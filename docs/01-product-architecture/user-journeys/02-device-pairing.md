
# User Journey Map v1.1

## Journey 1. First-Time User Onboarding

**Status:** **Approved & Frozen**

### Applied Refinement

The onboarding decision has been updated from:

> "Do you have your Vaha device with you?"

to:

> **"How would you like to get started?"**

Options:

* **Connect my Vaha Device**
* **Explore the App First**

This is a stronger UX decision because it is action-oriented, respects user intent, and reinforces that pairing is optional without implying the app is incomplete.

**Journey 1 is now frozen and should not be modified further.**

---

# User Journey Map v1.0

## Journey 2. Pairing a Vaha Device

**Status:** Draft for Review

---

# Purpose

Help users connect their Vaha device quickly, confidently, and without exposing networking or hardware complexity.

The experience should feel similar to pairing trusted consumer products such as wireless earbuds or a smartwatch, not configuring an IoT device.

---

# Primary User Goal

Successfully connect a Vaha device so it is ready to capture, synchronize, and communicate with the companion app.

---

# Trigger

The journey begins when the user selects one of the following:

* **Connect my Vaha Device** during onboarding.
* **Add Device** from the Device screen.
* **Reconnect Device** after removing or replacing a device.

---

# Preconditions

* The Vaha app is installed.
* The user has completed or skipped onboarding.
* The Vaha device is powered on.
* Required system capabilities (such as wireless connectivity) are available when needed.
* No active pairing session is already in progress.

---

# Actors

### Primary

* User

### Secondary

* Vaha Mobile App
* Vaha Device

---

# Happy Path

### 1. Start Pairing

The user selects **Connect my Vaha Device**.

The app briefly explains:

> "We'll look for nearby Vaha devices and connect you automatically."

No technical terminology is shown.

---

### 2. Automatic Discovery

The app begins searching for nearby Vaha devices.

The user sees a calm progress state rather than an indefinite spinner.

If exactly one device is found, it is selected automatically.

If multiple devices are found, the user chooses from a simple list using friendly device names.

---

### 3. Connection Confirmation

The app confirms the selected device.

The device confirms the connection internally.

No manual codes, IP addresses, or protocol selection are required in the normal flow.

---

### 4. Device Verification

The app performs a brief readiness check.

It verifies that the device can communicate successfully.

This happens automatically without user involvement.

---

### 5. Success

The app displays:

* Connected successfully
* Device is ready
* Local capture is available immediately

The user returns to the Device screen or Home, depending on where the journey started.

The paired device is now shown as trusted.

---

# Alternate Paths

## Multiple Devices Found

The app displays a short list of nearby Vaha devices.

Each entry includes:

* Friendly device name
* Simple proximity indicator (for example, "Nearby")

No hardware identifiers are exposed.

---

## User Cancels Pairing

The user exits the flow.

No partial pairing information is retained.

The Device screen remains available with a clear option to connect later.

---

## Previously Paired Device

If the device has already been trusted:

The app reconnects automatically without repeating the pairing process.

---

## Device Replaced

If a different Vaha device is detected, the app clearly explains that connecting a new device will replace the previous trusted device.

The user confirms before proceeding.

---

# Failure Scenarios

## No Devices Found

Possible causes:

* Device is powered off.
* Device is too far away.

User message:

> "We couldn't find a nearby Vaha device."

Actions:

* Search Again
* Learn how to prepare the device
* Cancel

---

## Connection Interrupted

The device becomes unavailable during pairing.

User message:

> "The connection was interrupted before setup finished."

Actions:

* Retry
* Cancel

---

## Pairing Timeout

Discovery exceeds a reasonable duration.

User message:

> "This is taking longer than expected."

Actions:

* Continue Searching
* Retry
* Cancel

---

## Another Phone Is Connected

If the device is already actively connected elsewhere:

User message:

> "Your Vaha device is currently connected to another phone."

Actions:

* Try Again Later
* Replace Existing Connection (if permitted by product policy)

---

## Unexpected Error

A non-specific issue prevents completion.

User message:

> "We couldn't finish connecting your Vaha device."

Actions:

* Retry
* Cancel

No technical diagnostics are shown.

---

# Recovery Flow

Every failure returns the user to a recoverable state.

Recovery principles:

* Never require restarting the entire journey.
* Preserve any successful discovery progress where possible.
* Offer Retry before asking users to leave the flow.
* Allow users to return to Home without feeling blocked.

If pairing cannot be completed, the app remains fully usable in exploration mode.

---

# Success Criteria

The journey succeeds when the user:

* Understands that their Vaha device is now connected.
* Trusts that future connections will happen automatically.
* Returns to the app without additional configuration.
* Never needs to understand networking concepts.

---

# UX Opportunities

### Automatic First

Discovery should begin automatically after entering the pairing flow.

Users should not have to press "Scan" unless retrying.

---

### Friendly Language

Avoid terms such as:

* Bluetooth
* Wi-Fi
* Pairing Mode
* Network
* Signal Strength
* Address
* Protocol

Use language centered on the user's goal, such as "Looking for your Vaha."

---

### Confidence Through Feedback

Replace technical progress indicators with meaningful updates:

* Looking for your Vaha
* Connecting
* Almost ready
* Connected

---

### Respect User Control

The user can leave the pairing flow at any time without affecting the rest of the app.

---

### Automatic Reconnection

Once trusted, reconnection should happen silently whenever possible.

Users should think about their ideas, not their hardware.

---

# Future Considerations

The following enhancements should be considered only after the core pairing experience is validated:

* Support for multiple trusted Vaha devices.
* Device nicknames (for example, "Study Desk" or "Office Vaha").
* Seamless migration when replacing a device.
* Pairing progress continuity across app restarts.
* Guided troubleshooting only after repeated failures, while keeping the default experience simple.

---

# UX Review

## Strengths

* Zero technical language.
* Automatic discovery reduces effort.
* Pairing remains optional and non-blocking.
* Recovery paths exist for every expected failure.
* Builds confidence through clear progress and completion states.
* Supports both wireless connection methods without exposing implementation details.
* Reinforces Vaha as a trusted companion rather than an IoT product.

## Deliberate Omissions

The following are intentionally excluded from the pairing journey:

* Manual network selection.
* IP address entry.
* Protocol selection.
* QR code pairing (unless future research justifies it).
* Firmware update prompts.
* Advanced diagnostics.
* Storage configuration.
* Privacy configuration.
* Notification permissions.

These belong in later contextual workflows, ensuring the pairing experience remains calm, approachable, and aligned with Vaha's consumer-grade design principles.
