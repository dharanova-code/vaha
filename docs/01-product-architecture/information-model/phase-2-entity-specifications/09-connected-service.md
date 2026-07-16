
# Information Model

## Phase 2 – Entity Specification 09

# Connected Service

**Status:** Draft for Review

---

# Purpose

The **Connected Service** represents an explicitly approved relationship between a User and an external service that extends the Vaha experience.

Its purpose is not to own user knowledge, perform synchronization, provide backup, or generate insights. Its purpose is to establish and manage a trusted relationship through which external capabilities may participate according to the User's preferences.

Within the domain:

> **A Connected Service represents trust between the User and an external system. It never becomes the home of the User's knowledge.**

The Connected Service exists to extend the ecosystem while preserving Vaha's local-first architecture.

---

# Ownership

Every Connected Service relationship belongs to exactly one User.

The Connected Service manages its own lifecycle independently while always referencing its owning User.

The Connected Service never owns:

* Captures
* Insights
* Collections
* Tags
* Devices
* Backups
* Settings

Ownership always remains with the User.

---

# Responsibilities

The Connected Service is responsible for:

* Representing an explicitly approved external relationship.
* Maintaining the trust state of that relationship.
* Expressing the availability of optional external capabilities.
* Respecting current user preferences and privacy decisions.
* Providing a stable foundation upon which other domains may optionally operate.

The Connected Service is **not** responsible for:

* Synchronizing user knowledge.
* Creating Backups.
* Generating Insights.
* Managing Devices.
* Managing Privacy.
* Managing Settings.
* Storing user knowledge.
* Becoming a dependency for core product operation.

These responsibilities belong to their respective domains.

---

# High-Level Attributes

Only conceptual attributes are defined at this stage.

### Identity

Represents a trusted relationship with one external service.

---

### Service Identity

Represents which external capability has been approved by the User.

The Connected Service identifies the relationship rather than the technical implementation.

---

### Trust Status

Represents whether the relationship is currently trusted and available.

---

### User Consent

Represents the User's explicit approval for participation.

Consent remains fundamental throughout the lifecycle.

---

### Participation Scope

Represents which optional product capabilities the relationship is permitted to support.

The Connected Service itself does not perform those capabilities.

---

### Status

Represents the lifecycle of the trusted relationship.

Operational connection states belong to future state models.

---

# Relationships

## Connected Service → User

Every Connected Service references exactly one owning User.

---

## Connected Service → Settings

The Connected Service always respects the current Settings.

Settings determine whether participation remains permitted.

---

## Connected Service → Backup

A Connected Service may support Backup participation where explicitly approved.

Backup remains responsible for preservation.

---

## Connected Service → Capture

A Connected Service may participate in synchronization or future user-approved extensions involving Captures.

It never owns or modifies the Capture domain.

---

## Connected Service → Insight

A Connected Service may participate in optional future enrichment capabilities.

Insights remain responsible for derived understanding.

---

## Connected Service → Device

A Connected Service may interact with trusted Devices only through user-approved workflows.

Device ownership remains unchanged.

---

# Lifecycle

The Connected Service lifecycle reflects trust rather than connectivity.

### Approved

The User explicitly establishes a trusted relationship.

Participation becomes available.

---

### Active

The trusted relationship is available for optional participation.

This is the normal operating state.

---

### Suspended

Participation is temporarily unavailable while preserving the trusted relationship.

User ownership remains unaffected.

---

### Disconnected

The User intentionally ends the trusted relationship.

Local ownership continues without interruption.

---

# High-Level State Model

```text
Approved
    ↓
Active
    ↓
Suspended (optional)
    ↓
Active
    ↓
Disconnected
```

Temporary operational conditions do not redefine the lifecycle of trust.

---

# CRUD Responsibilities

### Create

Establish a trusted external relationship through explicit user approval.

---

### Read

Provide information about the current trusted relationship.

---

### Update

Modify the scope of participation according to current user preferences.

Updates never modify user-owned domain entities.

---

### Delete

End the trusted relationship.

Deleting a Connected Service never removes locally owned knowledge.

---

# Offline Behaviour

Connected Services are optional by design.

The absence of connectivity never prevents the User from using Vaha.

Core principles:

* Local ownership remains fully functional.
* Existing Connected Service relationships remain defined even when unavailable.
* Offline operation never depends upon Connected Services.

---

# Sync Behaviour

The Connected Service does not own synchronization.

Instead, it provides the trusted relationship through which synchronization may occur if:

* the User has granted permission, and
* current Settings allow participation.

Core principles:

* Synchronization remains a separate domain responsibility.
* Connected Services never redefine the source of truth.
* Temporary service unavailability never changes local ownership.

---

# Privacy Rules

The Connected Service inherits the User's privacy principles.

Core rules include:

* Participation always requires explicit user consent.
* Consent may be withdrawn at any time.
* Connected Services must always respect current Settings.
* Local ownership always remains primary.
* Disconnecting a Connected Service never invalidates existing local knowledge.

---

# Validation Rules

A valid Connected Service must satisfy the following:

* References exactly one owning User.
* Represents exactly one trusted external relationship.
* Exists only through explicit user approval.
* Never owns user knowledge.
* Remains conceptually independent from synchronization, backup, and insight generation.

---

# Business Rules

### Rule 1

Every Connected Service relationship requires explicit user approval.

---

### Rule 2

Connected Services never own user knowledge.

---

### Rule 3

Local ownership always remains the primary architectural principle.

---

### Rule 4

Disconnecting a Connected Service must never remove or invalidate locally owned entities.

---

### Rule 5

Connected Services respect current Settings and Privacy preferences at all times.

---

### Rule 6

Synchronization, Backup, Insight generation, and other optional capabilities remain independent domains.

The Connected Service only represents the trusted relationship through which those domains may participate.

---

### Rule 7

The absence of Connected Services must never reduce the core capabilities of Vaha.

---

### Rule 8

Every Connected Service relationship should remain understandable to the User without exposing implementation details.

---

# Future Extensibility

The Connected Service should support future evolution without changing its core purpose.

Potential extensions include:

* Additional synchronization providers.
* Additional backup providers.
* Future enrichment providers.
* Optional automation providers.
* Future collaboration services.
* Trusted enterprise integrations.

Every extension must preserve the principle that Connected Services extend the experience without redefining ownership or becoming mandatory.

---

# Architectural Notes

## Independent Aggregate Root

The Connected Service is an independent aggregate root.

It references its owning User while managing the lifecycle of a trusted external relationship.

---

## Relationship, Not Capability

The Connected Service represents **trust**.

It does not represent synchronization, backup, enrichment, or any other product capability.

Those responsibilities remain within their own domains.

---

## Local-First Preservation

The architectural center of Vaha remains local ownership.

Connected Services exist at the edge of the domain, extending rather than replacing the user's primary experience.

---

## Explicit Trust

Trust must always be intentional.

Every Connected Service begins with user approval and may end with user withdrawal.

The system never assumes ongoing participation.

---

## Graceful Independence

The removal or absence of every Connected Service should leave the remainder of the domain intact.

The User, Captures, Devices, Collections, Tags, Insights, Settings, and Backups continue to exist and function without dependency on external systems.

---

# Source of Truth

The Connected Service establishes the architectural principle for external relationships throughout Vaha:

> **A Connected Service is a user-owned, explicitly approved trust relationship with an external system. It extends the Vaha experience without owning knowledge, redefining local-first architecture, or assuming responsibility for synchronization, backup, enrichment, or any other domain capability. Its sole responsibility is to represent and preserve the trusted relationship through which those optional capabilities may operate.**

With this specification, **Phase 2 – Entity Specifications** is complete, subject to approval of this final entity. It provides a cohesive domain model in which each aggregate has a single, well-defined responsibility, explicit ownership boundaries, and clear relationships while preserving Vaha's foundational principles of local-first operation, privacy-first design, and user ownership.
