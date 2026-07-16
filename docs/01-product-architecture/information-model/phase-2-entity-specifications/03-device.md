
# Information Model

## Phase 2 – Entity Specification 03

# Device

**Status:** Draft for Review

---

# Purpose

The **Device** represents a trusted Vaha companion that enables the capture of thoughts in the physical world.

Its purpose is not to own knowledge or manage information. Its purpose is to create opportunities for Captures while remaining as unobtrusive as possible.

Within the domain:

> **The Device enables Capture. It never becomes the center of the user's experience.**

---

# Ownership

A Device belongs to exactly one User at a time.

The Device is independently managed throughout its lifecycle while always referencing its owning User.

The Device never owns Captures.

Once a Capture is created, ownership belongs immediately and exclusively to the User.

---

# Responsibilities

The Device is responsible for:

* Enabling the creation of Captures.
* Representing a trusted physical companion.
* Maintaining its own operational health.
* Maintaining user-configurable preferences related to capture.
* Providing meaningful status about its readiness.
* Participating in synchronization according to user preferences.

The Device is **not** responsible for:

* Owning user knowledge.
* Organizing Captures.
* Generating Insights.
* Managing privacy policies.
* Managing backups.
* Managing search.
* Defining synchronization policies.

These responsibilities belong to their respective domains.

---

# Attributes (High-Level)

Only conceptual attributes are defined at this stage.

### Identity

Represents the trusted physical companion associated with the User.

---

### Friendly Identity

Human-readable information that helps the user recognize and personalize the Device.

Examples include:

* Device name

---

### Operational Health

Represents the Device's overall readiness.

Health communicates confidence rather than diagnostics.

---

### Capture Preferences

Represents user-selected behaviors affecting future captures.

These remain user-controlled rather than system-controlled.

---

### Capacity

Represents the Device's ability to continue creating Captures.

Capacity exists to support user understanding rather than expose technical implementation.

---

### Software State

Represents whether improvements are available for the Device.

The focus remains on user benefit rather than software versions.

---

# Relationships

## Device → User

Every Device references exactly one owning User.

---

## Device → Capture

A Device may create many Captures.

Each Capture records its originating Device.

Ownership of the Capture always belongs to the User.

---

## Device → Settings

The Device respects user-defined preferences without owning them.

---

## Device → Connected Service

A Device may participate in user-approved connected experiences.

The relationship remains optional.

---

## Device → Backup

The Device does not participate directly in Backup ownership.

Backups preserve user information rather than hardware state.

---

# Lifecycle

The Device lifecycle reflects trust rather than hardware administration.

### Unpaired

The Device exists but is not yet trusted by a User.

---

### Trusted

The Device has been successfully paired and is ready for everyday use.

This is the normal operating state.

---

### Attention Required

The Device requires meaningful user involvement to restore or improve its ability to support captures.

This state should occur rarely.

---

### Retired

The Device is intentionally removed from active use.

Previously created Captures remain unaffected.

---

# State Model (High-Level)

```text
Unpaired
    ↓
Trusted
    ↓
Attention Required (optional)
    ↓
Trusted
    ↓
Retired
```

Operational conditions such as connectivity, synchronization, or temporary availability belong to separate state models rather than redefining the Device lifecycle.

---

# CRUD Responsibilities

### Create

Establish a trusted relationship between the User and a Device.

---

### Read

Provide meaningful information about the Device's readiness and relationship with the User.

---

### Update

Modify user-controlled preferences and trusted identity.

Routine operational changes occur without changing the Device's identity.

---

### Delete

End the trusted relationship between the User and the Device.

Removing a Device never removes user-owned Captures.

---

# Offline Behaviour

The Device is designed for offline-first operation.

The Device can continue creating Captures without internet connectivity.

Temporary loss of connectivity never changes the Device's purpose or trust relationship.

Previously created Captures remain available according to the user's ownership model.

---

# Sync Behaviour

Synchronization extends the Device experience without defining it.

Core principles:

* Device operation does not depend on synchronization.
* Synchronization follows user preferences.
* Temporary synchronization delays never affect the Device's ability to create Captures.
* Synchronization never changes ownership.

---

# Privacy Rules

The Device inherits the User's privacy principles.

Core rules include:

* The Device never assumes permission to share information.
* External synchronization requires explicit user consent.
* The Device should expose only meaningful information to the User.
* Hardware identity must never supersede user ownership.

---

# Validation Rules

A valid Device must satisfy the following:

* References exactly one owning User.
* Can exist independently of Captures.
* Never owns user knowledge.
* Maintains a stable trusted identity throughout its lifecycle.
* Remains meaningful regardless of connectivity.

---

# Business Rules

### Rule 1

A Device exists to enable Captures.

---

### Rule 2

A Device never owns Captures.

---

### Rule 3

Removing a Device never removes user knowledge.

---

### Rule 4

Health communicates readiness rather than technical diagnostics.

---

### Rule 5

The Device should require user attention only when meaningful action is necessary.

---

### Rule 6

Software improvements should be communicated by user benefit rather than technical versioning.

---

### Rule 7

The trusted relationship between User and Device must always be explicit.

---

# Future Extensibility

The Device should support future evolution without changing its core purpose.

Potential extensions include:

* Multiple trusted Vaha devices for a single User.
* Personalized device roles or locations.
* Device migration workflows.
* Device wellness history expressed in human language.
* Additional capture capabilities through future hardware generations.

All future extensions must preserve the principle that the Device remains a companion that enables thought capture rather than becoming the center of the product.

---

# Architectural Notes

## Independent Aggregate Root

The Device is an independent aggregate root.

It references its owning User while managing its own lifecycle and consistency boundaries.

---

## Trust Before Configuration

The Device domain exists to establish confidence, not expose hardware complexity.

Users should first understand whether their Vaha is ready before encountering any preferences.

---

## Hardware Independence

The value of Vaha resides in the user's Captures, not in the physical Device.

Devices may change over time without affecting the continuity of user knowledge.

---

## Invisible Reliability

A healthy Device should require very little interaction.

The ideal experience is one in which users rarely think about the Device because it consistently supports capture without demanding attention.

---

## Source of Truth

The Device establishes the architectural principle for all future hardware-related behavior:

> **The Device is a trusted companion that enables the creation of Captures while remaining secondary to the user's ideas.**

Every future capability related to hardware should strengthen this principle rather than shifting attention toward device management or technical administration.
