
# Information Model

## Phase 2 – Entity Specification 07

# Settings

**Status:** Draft for Review

---

# Purpose

The **Settings** entity represents the durable preferences through which a User personalizes the behavior of the Vaha ecosystem.

Its purpose is not to store temporary application state or expose system configuration. Its purpose is to capture long-term user decisions that influence how Vaha behaves while preserving the identity and ownership of all domain entities.

Within the domain:

> **Settings express user preferences. They never redefine user knowledge.**

Settings influence behavior but never become part of the user's captured thoughts.

---

# Ownership

Every Settings entity belongs to exactly one User.

A User owns exactly one Settings entity.

Settings manage their own lifecycle independently while always referencing their owning User.

Settings never own Captures, Devices, Insights, Collections, Tags, Backups, or Connected Services.

---

# Responsibilities

The Settings entity is responsible for:

* Representing durable user preferences.
* Expressing privacy choices.
* Defining synchronization preferences.
* Defining accessibility preferences.
* Defining application-wide behavioral preferences.
* Influencing other domains through user intent.

The Settings entity is **not** responsible for:

* Storing temporary application state.
* Managing Device health.
* Managing Connected Services.
* Creating or organizing Captures.
* Managing Insights.
* Managing Search behavior.
* Recording operational events.

Those responsibilities belong to their respective domains.

---

# High-Level Attributes

Only conceptual attributes are defined at this stage.

### Identity

Represents the User's single persistent preference profile.

---

### Privacy Preferences

Represents durable choices regarding ownership, synchronization, sharing, and data handling.

---

### Synchronization Preferences

Represents whether and how the User chooses to extend local ownership through optional synchronization.

---

### Accessibility Preferences

Represents long-term accessibility choices that improve usability without changing business behavior.

---

### Application Preferences

Represents durable preferences that influence the overall experience.

These remain independent of transient runtime behavior.

---

### Device Preferences

Represents user preferences that influence trusted Devices.

The Settings entity references these preferences without owning Device behavior itself.

---

# Relationships

## Settings → User

Every Settings entity references exactly one owning User.

Each User owns exactly one Settings entity.

---

## Settings → Device

Settings influence trusted Device behavior through user preferences.

The Device remains responsible for its own lifecycle.

---

## Settings → Connected Service

Settings define whether Connected Services may participate in the user's experience.

Connected Services remain independent entities.

---

## Settings → Capture

Settings may influence future Capture behavior through user preferences.

They never modify existing Captures.

---

## Settings → Insight

Settings may influence whether optional enhancement capabilities are enabled.

They never alter the meaning of existing Insights.

---

## Settings → Backup

Settings may define user preferences related to backup behavior.

Backups remain independent entities.

---

# Lifecycle

The Settings lifecycle reflects continuity rather than frequent change.

### Created

A Settings profile is established for a User.

---

### Active

The Settings profile governs the user's preferences.

This is the normal operating state.

---

### Updated

The User intentionally changes one or more durable preferences.

The Settings identity remains unchanged.

---

### Removed

The Settings profile is removed only as part of removing the owning User.

Settings never exist independently.

---

# High-Level State Model

```text
Created
    ↓
Active
    ↓
Updated (repeating)
    ↓
Active
    ↓
Removed
```

Preference updates do not create new Settings entities.

---

# CRUD Responsibilities

### Create

Establish a persistent preference profile for a User.

---

### Read

Provide the User's current durable preferences.

---

### Update

Modify durable preferences while preserving Settings identity.

Updates influence future behavior but never rewrite historical domain data.

---

### Delete

Remove the Settings entity only as part of the owning User's lifecycle.

---

# Offline Behaviour

Settings are fully available offline.

Users may:

* View preferences.
* Modify preferences.
* Continue using Vaha according to updated preferences.

Preference changes remain valid regardless of connectivity.

---

# Sync Behaviour

Synchronization extends preference continuity rather than defining it.

Core principles:

* Local preferences remain authoritative until synchronization succeeds.
* Synchronization follows explicit user consent.
* Synchronization preserves user intent rather than replacing it.
* Temporary synchronization delays never invalidate Settings.

---

# Privacy Rules

Privacy is a first-class responsibility of the Settings entity.

Core principles include:

* Privacy preferences always originate from the User.
* Local ownership is the default.
* Cloud participation requires explicit user consent.
* Privacy choices remain understandable without technical knowledge.
* Connected Services must respect current privacy preferences.

---

# Validation Rules

A valid Settings entity must satisfy the following:

* References exactly one owning User.
* Exists exactly once per User.
* Represents durable rather than temporary preferences.
* Influences behavior without owning business data.
* Remains internally consistent across preference categories.

---

# Business Rules

### Rule 1

Each User owns exactly one Settings entity.

---

### Rule 2

Settings express durable user preferences.

They never represent transient application state.

---

### Rule 3

Settings influence other domains without owning them.

---

### Rule 4

Changing Settings must never change the identity, ownership, or lifecycle of any domain entity.

---

### Rule 5

Privacy preferences belong within Settings.

---

### Rule 6

Connected Services must always respect current Settings.

Settings never become Connected Services themselves.

---

### Rule 7

Device-specific preferences may be expressed through Settings while Device operation remains the responsibility of the Device domain.

---

### Rule 8

Settings should remain intentionally focused.

New preferences should only be introduced when they represent durable user decisions rather than implementation configuration.

---

# Future Extensibility

The Settings entity should support future evolution without becoming a general-purpose configuration repository.

Potential extensions include:

* Additional accessibility preferences.
* User-controlled automation preferences.
* Future privacy controls for new capabilities.
* Preference profiles for multiple trusted Devices.
* Region-specific preference groups where appropriate.

Every extension must satisfy one question:

> **Does this represent a durable user decision?**

If not, it does not belong in Settings.

---

# Architectural Notes

## Independent Aggregate Root

The Settings entity is an independent aggregate root.

It references its owning User while managing the consistency of durable user preferences.

---

## Preferences, Not Configuration

Settings represent intentional user choices.

They do not expose system internals or implementation details.

---

## Influence Without Ownership

Settings influence how the product behaves.

They never become responsible for the business meaning or lifecycle of other entities.

---

## Stable by Design

Settings should evolve slowly.

A growing number of unrelated configuration options is an architectural smell and should be challenged before inclusion.

---

## Privacy as Identity

Privacy is not a feature layered onto Settings.

It is one of the core responsibilities of the Settings domain because it reflects long-term user intent.

---

## Source of Truth

The Settings entity establishes the architectural principle for durable preferences throughout Vaha:

> **Settings are the single source of truth for durable user preferences. They express long-term user intent, influence the behavior of other domains, and preserve local-first ownership without ever changing the identity, ownership, or lifecycle of the entities they affect.**

All future preference-related capabilities should extend this principle, ensuring that Settings remain focused, stable, and centered on meaningful user decisions rather than becoming a repository for miscellaneous application configuration.
