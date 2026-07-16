
# Information Model

## Phase 2 – Entity Specification 08

# Backup

**Status:** Draft for Review

---

# Purpose

The **Backup** represents a user-owned preservation snapshot of user knowledge at a particular point in time.

Its purpose is not to extend availability through synchronization or become another working copy of the user's information. Its purpose is to preserve continuity and enable intentional recovery when needed.

Within the domain:

> **A Backup preserves knowledge. It never replaces it.**

A Backup exists to protect user ownership, not to participate in everyday workflows.

---

# Ownership

Every Backup belongs to exactly one User.

A Backup manages its own lifecycle independently while always referencing its owning User.

A Backup never owns the entities it preserves.

Ownership of preserved information always remains with the User.

---

# Responsibilities

The Backup entity is responsible for:

* Representing a preservation snapshot.
* Preserving user-owned domain information.
* Supporting intentional recovery.
* Maintaining preservation integrity.
* Remaining independent from synchronization.

The Backup is **not** responsible for:

* Synchronizing data.
* Becoming the active source of truth.
* Modifying preserved entities.
* Managing Connected Services.
* Creating Captures.
* Managing Devices.
* Managing Insights.

Those responsibilities belong to their respective domains.

---

# High-Level Attributes

Only conceptual attributes are defined at this stage.

### Identity

Represents a stable preservation snapshot.

---

### Preservation Scope

Represents which user-owned information has been preserved.

The Backup preserves domain relationships without redefining them.

---

### Creation Context

Represents the point in time at which preservation occurred.

This establishes historical context without affecting ownership.

---

### Integrity

Represents confidence that the preserved snapshot remains complete and suitable for recovery.

---

### Status

Represents the Backup's lifecycle.

Operational processing belongs to future state models.

---

# Relationships

## Backup → User

Every Backup references exactly one owning User.

---

## Backup → Capture

A Backup preserves Captures without changing their identity or ownership.

---

## Backup → Collection

A Backup preserves Collection relationships.

---

## Backup → Tag

A Backup preserves Tag classifications.

---

## Backup → Insight

A Backup preserves derived understandings together with their evidence relationships.

---

## Backup → Settings

A Backup respects the User's Settings when created.

Settings themselves may also be preserved.

---

## Backup → Connected Service

Connected Services may assist with preservation when explicitly approved.

They never redefine what a Backup is.

---

## Backup → Device

Backups preserve user knowledge rather than hardware state.

The Device itself is not the preservation target.

---

# Lifecycle

The Backup lifecycle reflects preservation rather than continuous operation.

### Created

The User intentionally creates a preservation snapshot.

---

### Available

The Backup is ready for future recovery if needed.

This is the normal operating state.

---

### Restored

The Backup has been intentionally used to recover preserved information.

The Backup itself continues to exist as a historical preservation artifact unless removed by the User.

---

### Deleted

The User intentionally removes the Backup.

Removal never affects the active user-owned entities.

---

# High-Level State Model

```text
Created
    ↓
Available
    ↓
Restored (optional)
    ↓
Available
    ↓
Deleted
```

A restored Backup does not become the active source of truth.

---

# CRUD Responsibilities

### Create

Establish a preservation snapshot of user-owned information.

Creating a Backup never modifies the preserved entities.

---

### Read

Access information about the preserved snapshot.

---

### Update

A Backup is conceptually immutable.

User-controlled changes relate only to descriptive information or retention decisions, never to the preserved snapshot itself.

---

### Delete

Remove the preservation snapshot without affecting the active user-owned information.

---

# Offline Behaviour

Backups support offline-first principles.

Where preservation is available locally, Backup creation and restoration remain independent of internet connectivity.

The existence of a Backup never depends on cloud participation.

---

# Sync Behaviour

Synchronization and Backup are intentionally separate responsibilities.

Core principles:

* Synchronization extends availability.
* Backup preserves continuity.
* Synchronization never replaces Backup.
* Backup never becomes synchronization.
* Both respect the User's Settings and privacy decisions.

---

# Privacy Rules

Backups inherit the User's privacy principles.

Core rules include:

* Every Backup belongs to one User.
* Preservation never transfers ownership.
* Backup creation follows current privacy preferences.
* Restoration respects user ownership.
* Connected Services participate only through explicit user consent.

---

# Validation Rules

A valid Backup must satisfy the following:

* References exactly one owning User.
* Represents one preservation snapshot.
* Preserves relationships without redefining ownership.
* Never becomes the active source of truth.
* Can be understood independently of synchronization.

---

# Business Rules

### Rule 1

A Backup is a preservation snapshot, not a synchronization mechanism.

---

### Rule 2

Creating a Backup must never modify the preserved entities.

---

### Rule 3

Restoring a Backup is always an intentional user action.

---

### Rule 4

A Backup never becomes the canonical representation of user knowledge.

---

### Rule 5

Deleting a Backup never deletes the active user-owned entities.

---

### Rule 6

Backup ownership always remains with the User.

---

### Rule 7

Backup behavior must respect current Settings and privacy preferences.

---

### Rule 8

The preservation of knowledge takes precedence over convenience.

Backup operations should never compromise user ownership or integrity.

---

# Future Extensibility

The Backup entity should support future evolution without changing its core purpose.

Potential extensions include:

* Scheduled user-controlled backups.
* Multiple historical preservation snapshots.
* Selective restoration of preserved information.
* Cross-device restoration after explicit user approval.
* Long-term archival policies controlled by the User.

Every extension must preserve the principle that a Backup protects knowledge without replacing it.

---

# Architectural Notes

## Independent Aggregate Root

The Backup is an independent aggregate root.

It references its owning User while managing its own lifecycle and preservation integrity.

---

## Preservation, Not Synchronization

The Backup domain exists to protect continuity.

It intentionally remains separate from Connected Services and synchronization.

---

## Immutable by Principle

A Backup represents a historical preservation snapshot.

Once created, its preserved content should remain conceptually unchanged.

Any future preservation event results in a new Backup rather than altering an existing one.

---

## Ownership Never Moves

A Backup never changes ownership.

It safeguards user knowledge while preserving the User's role as the sole owner.

---

## Recovery Is Intentional

Recovery should always result from a deliberate user decision.

The system must never automatically restore a Backup or replace active user knowledge without explicit user intent.

---

# Source of Truth

The Backup establishes the architectural principle for preservation throughout Vaha:

> **A Backup is a user-owned preservation snapshot that protects user knowledge without becoming its source of truth. It preserves continuity, respects privacy and settings, and supports intentional recovery while leaving the original entities unchanged.**

All future preservation capabilities should build upon this principle, ensuring that Backup remains distinct from synchronization, transparent in purpose, and unwavering in its commitment to protecting user ownership.
