
# Information Model

## Phase 2 – Entity Specification 02

# Capture

**Status:** Draft for Review

---

# Purpose

The **Capture** is the canonical business object of Vaha.

It represents a single preserved thought, observation, or idea intentionally retained by the user.

Everything else in the product exists to:

* create a Capture,
* enrich a Capture,
* organize a Capture,
* reference a Capture,
* protect a Capture, or
* derive understanding from one or more Captures.

If an object does not relate to a Capture in one of these ways, it likely belongs outside the Core Domain.

---

# Ownership

Every Capture belongs to exactly one User.

A Capture may originate from a Vaha Device, but ownership belongs to the User from the moment the Capture is created.

A Capture manages its own lifecycle independently while always referencing its owning User.

---

# Responsibilities

The Capture entity is responsible for:

* Preserving a single captured thought.
* Maintaining all representations of that thought.
* Maintaining its own contextual information.
* Providing a stable reference for organization.
* Acting as the source material for insights.
* Remaining available regardless of connectivity.

The Capture is **not** responsible for:

* Generating insights.
* Managing collections.
* Managing tags.
* Managing synchronization.
* Managing backups.
* Managing devices.
* Managing search.

These belong to their respective domains or cross-cutting services.

---

# Attributes (High-Level)

Only conceptual attributes are defined at this stage.

### Identity

A stable identity representing one captured thought.

---

### Content

The preserved representations of the captured thought, including:

* Audio
* Transcript

These are representations of the Capture, not separate business objects.

---

### Context

Supporting information associated with the capture, such as:

* Time
* Origin
* Environmental context
* User-added context

Context exists to improve understanding, not redefine the Capture.

---

### Organization

Information that enables grouping and retrieval.

Examples include references to:

* Collections
* Tags

Organization is external to the Capture's core identity.

---

### Status

High-level information describing the Capture's current lifecycle.

Detailed states belong to the Capture State Model.

---

# Relationships

## Capture → User

Every Capture references exactly one owning User.

---

## Capture → Device

A Capture may originate from one Device.

The Device records origin, not ownership.

---

## Capture ↔ Collection

A Capture may belong to multiple Collections.

Collections organize Captures without changing them.

---

## Capture ↔ Tag

A Capture may reference multiple Tags.

Tags classify rather than modify Captures.

---

## Capture ← Insight

Insights derive from one or more Captures.

Captures never depend on Insights.

---

## Capture → Backup

Backups preserve Captures.

A Backup never changes the Capture itself.

---

## Capture → Connected Service

Connected Services may synchronize or extend access to Captures only with explicit user consent.

The Capture remains conceptually unchanged.

---

# Lifecycle

The Capture lifecycle reflects preservation rather than processing.

### Created

A new thought is successfully captured.

Ownership is immediately established.

---

### Available

The Capture is ready for reading, listening, searching, organizing, and referencing.

This is the normal operating state.

---

### Archived

The Capture remains preserved but is intentionally removed from everyday attention.

Its content and identity remain unchanged.

---

### Deleted

The Capture has been intentionally removed according to the user's decision and applicable data policies.

Deletion is always explicit.

---

# State Model (High-Level)

```text
Created
    ↓
Available
    ↓
Archived (optional)
    ↓
Available
    ↓
Deleted
```

Future internal processing states (such as enrichment or synchronization) belong to separate state models and do not redefine the business lifecycle.

---

# CRUD Responsibilities

### Create

Establish a new preserved thought.

---

### Read

Access the Capture and its representations.

---

### Update

Allow user-controlled improvements such as edits, organization, or contextual enrichment.

The identity of the Capture remains stable.

---

### Delete

Remove the Capture only through explicit user intent.

Deletion must never occur automatically.

---

# Offline Behaviour

Offline operation is the default.

A Capture:

* can be created,
* accessed,
* searched,
* organized,
* edited,
* archived,

without internet connectivity.

Connectivity never determines whether a Capture exists.

---

# Sync Behaviour

Synchronization extends availability rather than defining it.

Core principles:

* The local Capture is the primary representation.
* Synchronization is optional.
* User ownership remains unchanged.
* Synchronization never creates a second conceptual Capture.
* Temporary synchronization delays do not affect the Capture's validity.

---

# Privacy Rules

The Capture inherits the User's ownership and privacy principles.

Rules include:

* Every Capture belongs to one User.
* Sharing requires explicit user action.
* Synchronization requires explicit user consent.
* Derived insights must never expose information beyond the originating Captures.
* The Capture remains understandable without external services.

---

# Validation Rules

A valid Capture must satisfy the following:

* Has exactly one owning User.
* Represents one coherent captured thought.
* Maintains a stable identity throughout its lifecycle.
* Remains independently meaningful without requiring an Insight.
* Preserves ownership regardless of synchronization status.

---

# Business Rules

### Rule 1

A Capture is the canonical business object of Vaha.

---

### Rule 2

Audio and transcript are representations of the Capture, not independent entities.

---

### Rule 3

Every Insight must reference one or more existing Captures.

---

### Rule 4

Collections and Tags organize Captures without altering their identity.

---

### Rule 5

A Capture must remain accessible regardless of network availability.

---

### Rule 6

Deletion is always explicit and intentional.

---

### Rule 7

A Capture's identity never changes because of enrichment, synchronization, or organization.

---

### Rule 8

No feature may bypass the Capture as the primary representation of user knowledge.

---

# Future Extensibility

The Capture should support future capabilities without changing its core meaning.

Potential extensions include:

* Rich attachments associated with a Capture.
* Multiple media representations of the same captured thought.
* Cross-references between related Captures.
* Version history for user edits.
* User annotations.
* Additional contextual information from future sensors.
* New enrichment methods that preserve the original Capture.

All future extensions must continue to represent **the same captured thought**, not create a new business object.

---

# Architectural Notes

## Canonical Object

The Capture is the canonical object throughout the Vaha ecosystem.

Every major workflow ultimately begins with or returns to a Capture.

---

## Representation vs. Identity

Audio, transcript, summaries, and contextual information are representations or enrichments of a Capture.

They never become separate business entities.

---

## Independent Aggregate Root

The Capture is an independent aggregate root.

It references its owning User while managing its own lifecycle and consistency boundaries.

---

## Explainable Intelligence

Insights never replace Captures.

Every derived understanding must remain traceable back to one or more originating Captures.

---

## Local-First Foundation

A Capture is conceptually complete without cloud connectivity.

External services extend access, protection, or enrichment but never redefine the Capture.

---

## Source of Truth

The Capture establishes the central architectural principle for the remainder of the Information Model:

> **Every meaningful capability in Vaha must either create, enrich, organize, reference, protect, or derive from a Capture.**

This principle should govern every future entity specification, ensuring that the product remains centered on preserving and understanding the user's thoughts rather than accumulating disconnected features.
