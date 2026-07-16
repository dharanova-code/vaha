
# Information Model

## Phase 4 – Ownership Model

**Status:** Approved

---

# Purpose

The Ownership Model defines **who owns what** throughout the Vaha ecosystem.

It establishes permanent ownership boundaries that remain true regardless of:

* storage location,
* connectivity,
* synchronization,
* backups,
* connected services,
* processing,
* implementation.

It answers one question:

> **"Who ultimately owns this business object?"**

---

# Why a Separate Ownership Model Exists

Ownership is frequently confused with:

* aggregate boundaries,
* operational responsibility,
* storage location,
* synchronization,
* processing.

These are independent concepts.

The Ownership Model separates them explicitly.

| Concept         | Answers                    |
| --------------- | -------------------------- |
| Ownership       | Who owns it?               |
| Aggregate       | Who maintains consistency? |
| Responsibility  | Who performs work?         |
| Storage         | Where is it stored?        |
| Synchronization | Where is it available?     |

Keeping these concepts independent prevents architectural ambiguity as Vaha evolves.

---

# Ownership Principles

The following principles are fundamental and immutable.

### Principle 1. User Ownership

All user knowledge ultimately belongs to one User.

---

### Principle 2. Single Ownership

Every core entity has exactly one owner.

Shared ownership does not exist within the current Vaha domain.

---

### Principle 3. Explicit Ownership

Ownership is always explicit.

It is never inferred.

---

### Principle 4. Stable Ownership

Operational activities never change ownership.

Examples include:

* synchronization
* backup
* enrichment
* search
* indexing
* reflection

---

### Principle 5. Local Authority

Local ownership is the authoritative representation of user ownership.

External systems may participate but never replace ownership.

---

### Principle 6. Ownership Before Storage

Ownership exists independently of where information is stored.

Changing storage never changes ownership.

---

### Principle 7. User Intent

Ownership-changing actions always require explicit user intent.

---

# Ownership Hierarchy

```text
User
│
├── Capture
├── Device
├── Collection
├── Tag
├── Insight
├── Settings
├── Backup
└── Connected Service
```

The hierarchy represents **ownership only**.

It does **not** represent lifecycle, aggregate boundaries, or processing dependencies.

---

# Ownership Matrix

| Entity            | Owner | Ownership Type |
| ----------------- | ----- | -------------- |
| User              | Self  | Root Owner     |
| Capture           | User  | Direct         |
| Device            | User  | Direct         |
| Collection        | User  | Direct         |
| Tag               | User  | Direct         |
| Insight           | User  | Direct         |
| Settings          | User  | Direct         |
| Backup            | User  | Direct         |
| Connected Service | User  | Direct         |

Every entity has one and only one owner.

---

# Source of Truth Matrix

| Domain Object     | Business Source of Truth |
| ----------------- | ------------------------ |
| User              | User                     |
| Capture           | Capture                  |
| Device            | Device                   |
| Collection        | Collection               |
| Tag               | Tag                      |
| Insight           | Insight                  |
| Settings          | Settings                 |
| Backup            | Backup                   |
| Connected Service | Connected Service        |

Ownership never changes the canonical source of truth for each domain object.

Likewise, the source of truth never changes ownership.

---

# Local vs External Ownership

## Local Ownership

The User's local environment is the authoritative home of ownership.

Ownership is established locally before any external participation occurs.

---

## External Participation

External systems may extend the experience through:

* synchronization,
* preservation,
* enrichment,
* future integrations.

They never acquire ownership.

---

## Principle

Local ownership remains authoritative even when:

* multiple copies exist,
* synchronization succeeds,
* backup is created,
* connected services participate.

---

# Ownership Transfer Rules

Ownership transfer is intentionally rare.

### Rule 1

Ownership never changes automatically.

---

### Rule 2

Synchronization never transfers ownership.

---

### Rule 3

Backup never transfers ownership.

---

### Rule 4

Connected Services never transfer ownership.

---

### Rule 5

Operational processing never transfers ownership.

---

### Rule 6

Future ownership transfer, if introduced, must require explicit user intent and be modeled as a distinct business operation rather than an implicit side effect.

---

# Lifecycle Ownership Rules

Ownership exists throughout an entity's lifecycle.

State transitions never affect ownership.

Examples:

* Active
* Archived
* Available
* Restored
* Suspended

Ownership remains unchanged.

Only removal of the owning User ends ownership, according to defined lifecycle policies.

---

# Conflict Resolution Principles

Ownership is never negotiated.

If conflicting representations exist:

1. Preserve user ownership.
2. Preserve user intent.
3. Preserve business integrity.
4. Reject ambiguous ownership.
5. Resolve operational conflicts without changing ownership.

Business ownership always takes precedence over synchronization state.

---

# Deletion Ownership Rules

Deletion changes lifecycle, not historical ownership.

Core principles:

* Only the owning User may initiate deletion.
* Deletion must be explicit.
* Deleting an entity does not imply ownership transfer.
* Deleting a Connected Service does not affect owned data.
* Deleting a Device does not affect owned knowledge.
* Deleting a Backup does not affect active owned entities.

Ownership remains conceptually valid until deletion completes.

---

# Backup Ownership Rules

A Backup preserves ownership.

It never acquires ownership.

Rules:

* Backup belongs to one User.
* Preserved entities retain their original ownership.
* Restoration preserves ownership.
* Backup never becomes the canonical owner.
* Backup never changes aggregate boundaries.

---

# Connected Service Ownership Rules

Connected Services represent trust relationships.

They never represent ownership.

Rules:

* Connected Services own nothing.
* Connected Services cannot acquire ownership.
* Disconnecting a service never changes ownership.
* External participation requires explicit consent.
* Local ownership remains authoritative.

---

# Device Ownership Rules

Devices belong to Users.

Knowledge does not belong to Devices.

Rules:

* Device ownership is separate from knowledge ownership.
* Devices create Captures.
* Devices never own Captures.
* Removing a Device never removes knowledge.
* Hardware replacement never affects ownership continuity.

This preserves Vaha's philosophy that hardware is replaceable, while ideas are enduring.

---

# Privacy & Consent Boundaries

Ownership and consent are related but distinct.

Ownership defines **who owns**.

Consent defines **what others may do**.

Core principles:

* Ownership cannot be delegated implicitly.
* Consent may be granted or withdrawn.
* Consent never changes ownership.
* Privacy decisions always originate from the User.
* Connected Services operate only within granted consent.

---

# Business Constraints

### Constraint 1

Every core entity must have exactly one owner.

---

### Constraint 2

Ownership must never become ambiguous.

---

### Constraint 3

Ownership remains independent of storage location.

---

### Constraint 4

Ownership remains independent of aggregate boundaries.

---

### Constraint 5

Ownership remains independent of operational responsibility.

---

### Constraint 6

Ownership remains independent of synchronization.

---

### Constraint 7

Ownership remains independent of backup.

---

### Constraint 8

Ownership remains independent of implementation.

---

### Constraint 9

Local ownership is always authoritative.

---

### Constraint 10

No business operation may implicitly change ownership.

---

# Architectural Notes

## Ownership Is a Business Concept

Ownership belongs to the domain.

It is not a technical concern.

---

## Aggregate ≠ Owner

An aggregate manages consistency.

An owner establishes legal and conceptual authority.

These concepts must never be merged.

---

## Responsibility ≠ Ownership

Entities perform responsibilities.

Only owners possess ownership.

Operational responsibility never implies ownership.

---

## Storage ≠ Ownership

Copies may exist in many places.

Ownership exists in exactly one place.

---

## Local-First Integrity

Offline operation is possible because ownership is established independently of external participation.

The architecture therefore remains valid regardless of connectivity.

---

## Stable Over Time

Ownership should change less frequently than implementation.

The Ownership Model is expected to remain stable across future versions of Vaha.

---

# Source of Truth

The Ownership Model establishes the architectural principle for ownership across the entire Vaha ecosystem:

> **The User is the root owner of the Vaha domain. Every core entity has exactly one explicit owner, and ownership remains independent of aggregate boundaries, operational responsibility, storage location, synchronization, backup, connected services, and implementation. Local ownership is always authoritative, ownership changes only through explicit user intent, and no external system, device, or service may acquire or redefine ownership of user knowledge.**

This model is intended to remain the **frozen architectural source of truth** for ownership throughout Vaha's design, implementation, and future evolution.
