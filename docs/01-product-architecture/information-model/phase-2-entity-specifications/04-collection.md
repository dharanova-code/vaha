
# Information Model

## Phase 2 – Entity Specification 04

# Collection

**Status:** Draft for Review

---

# Purpose

The **Collection** represents a user-defined organizational construct for grouping related Captures.

Its purpose is not to create new knowledge or duplicate existing Captures. Its purpose is to provide meaningful organization that reflects how the user chooses to think about their ideas.

Within the domain:

> **A Collection organizes Captures. It never changes what a Capture is.**

Collections are intentional and user-created. They express the user's mental model rather than an automatically inferred one.

---

# Ownership

Every Collection belongs to exactly one User.

A Collection manages its own lifecycle independently while always referencing its owning User.

The Collection never owns Captures. It maintains references to them.

---

# Responsibilities

The Collection is responsible for:

* Grouping related Captures.
* Representing user-defined organization.
* Maintaining its own identity.
* Preserving relationships between itself and referenced Captures.
* Supporting long-term organization of personal knowledge.

The Collection is **not** responsible for:

* Creating Captures.
* Modifying Capture content.
* Owning Captures.
* Generating Insights.
* Replacing Search.
* Replacing Tags.
* Managing synchronization or backups.

These responsibilities belong to their respective domains.

---

# High-Level Attributes

Only conceptual attributes are defined at this stage.

### Identity

Represents a stable user-defined organizational unit.

---

### User Intent

Represents the purpose or meaning the user assigns to the Collection.

The Collection exists because the user intentionally created it.

---

### Membership

Represents references to one or more Captures.

Membership never duplicates Capture content.

---

### Organization Context

Represents user-defined organization that may evolve over time without changing the underlying Captures.

---

### Status

Represents the Collection's current lifecycle.

Detailed operational states belong to future state models.

---

# Relationships

## Collection → User

Every Collection references exactly one owning User.

---

## Collection ↔ Capture

A Collection may reference many Captures.

A Capture may belong to multiple Collections.

Adding or removing a Capture from a Collection never changes the Capture itself.

---

## Collection ↔ Tag

Collections and Tags complement one another but remain independent.

Collections represent intentional grouping.

Tags represent reusable classification.

Neither replaces the other.

---

## Collection ← Insight

Insights may reference Collections when presenting reflections, but Collections do not depend on Insights.

---

## Collection → Backup

Backups preserve Collection membership along with referenced relationships.

---

## Collection → Connected Service

Collections may participate in synchronization according to user preferences.

Their conceptual meaning remains unchanged.

---

# Lifecycle

The Collection lifecycle reflects intentional organization.

### Created

The user creates a new Collection.

Its identity is established.

---

### Active

The Collection is available for organizing Captures.

This is the normal operating state.

---

### Archived

The Collection is intentionally removed from everyday attention while preserving its organizational meaning.

Referenced Captures remain unaffected.

---

### Deleted

The Collection is intentionally removed.

Referenced Captures remain unchanged.

Only the organizational relationship is removed.

---

# High-Level State Model

```text
Created
    ↓
Active
    ↓
Archived (optional)
    ↓
Active
    ↓
Deleted
```

Membership changes do not redefine the Collection lifecycle.

---

# CRUD Responsibilities

### Create

Establish a new organizational construct.

---

### Read

Access Collection identity and referenced Captures.

---

### Update

Modify Collection organization, membership, or user-defined meaning.

Updates never modify the referenced Captures.

---

### Delete

Remove the Collection while preserving all referenced Captures.

---

# Offline Behaviour

Collections are fully functional offline.

Users can:

* Create Collections.
* Organize Captures.
* Modify membership.
* Rename Collections.
* Archive or delete Collections.

Organization never depends on internet connectivity.

---

# Sync Behaviour

Synchronization extends availability rather than defining organization.

Core principles:

* Local organization remains the primary representation.
* Synchronization follows user preferences.
* Synchronization preserves relationships rather than creating new organizational meaning.
* Temporary synchronization delays never invalidate a Collection.

---

# Privacy Rules

Collections inherit the User's privacy principles.

Core rules include:

* Every Collection belongs to one User.
* Collection organization remains private unless explicitly shared through future capabilities.
* Synchronization requires explicit user consent.
* Collection membership should never expose Capture content beyond the user's privacy decisions.

---

# Validation Rules

A valid Collection must satisfy the following:

* References exactly one owning User.
* Maintains a stable identity.
* Contains references rather than duplicated Capture content.
* Does not modify Capture ownership or lifecycle.
* Remains meaningful even if membership changes over time.

---

# Business Rules

### Rule 1

A Collection organizes Captures without owning them.

---

### Rule 2

A Capture may belong to multiple Collections.

---

### Rule 3

Removing a Collection never removes a Capture.

---

### Rule 4

Collection membership must never duplicate Capture content.

---

### Rule 5

Collections represent explicit user intent rather than automatic system organization.

---

### Rule 6

Collections and Tags serve different organizational purposes and should not replace one another.

---

### Rule 7

Changing a Collection never changes the identity or meaning of its referenced Captures.

---

# Future Extensibility

The Collection should support future evolution without changing its core purpose.

Potential extensions include:

* Nested collections, if future research demonstrates clear user value.
* Smart collections based on user-defined criteria.
* Collaborative collections, if multi-user ownership is introduced with explicit ownership semantics.
* Collection templates for recurring organizational patterns.
* User-defined collection icons or visual identities.

Every extension must preserve the principle that Collections organize knowledge without becoming knowledge themselves.

---

# Architectural Notes

## Independent Aggregate Root

The Collection is an independent aggregate root.

It references its owning User while managing its own lifecycle and the integrity of its Capture relationships.

---

## Organization Without Transformation

Collections organize existing Captures.

They never transform, merge, duplicate, or reinterpret them.

---

## User Intent Over Automation

Collections exist because the user chooses to create them.

Automatic grouping belongs to the Insight domain, not the Collection domain.

---

## Stable References

Collections reference Captures rather than containing them.

This preserves a single canonical Capture while allowing multiple organizational perspectives.

---

## Complementary to Search and Tags

Collections answer the question:

> **"Which ideas do I intentionally want together?"**

They do not replace:

* Search, which answers **"How do I find something?"**
* Tags, which answer **"How do I classify something?"**
* Insights, which answer **"What relationships can Vaha help me discover?"**

Each domain remains distinct.

---

# Source of Truth

The Collection establishes the architectural principle for intentional organization throughout Vaha:

> **A Collection is a user-defined organizational construct that groups Captures through stable references without changing their identity, ownership, lifecycle, or meaning.**

All future organizational capabilities should build upon this principle, ensuring that Collections remain a simple, durable expression of the user's own mental organization rather than an automated or system-controlled structure.
