
# Information Model

## Phase 2 – Entity Specification 05

# Tag

**Status:** Draft for Review

---

# Purpose

The **Tag** represents a reusable semantic classification defined by the User to describe, categorize, or label one or more Captures.

Its purpose is not to organize Captures into intentional groups or infer relationships. Its purpose is to provide a consistent vocabulary that improves classification and future retrieval.

Within the domain:

> **A Tag classifies Captures. It never changes what a Capture means.**

Tags are reusable concepts that can be applied across many Captures over time.

---

# Ownership

Every Tag belongs to exactly one User.

A Tag manages its own lifecycle independently while always referencing its owning User.

The Tag never owns Captures. It maintains classification relationships with them.

---

# Responsibilities

The Tag is responsible for:

* Representing a reusable semantic concept.
* Classifying one or more Captures.
* Maintaining consistency across repeated classifications.
* Supporting long-term discoverability through user-defined vocabulary.

The Tag is **not** responsible for:

* Creating Captures.
* Modifying Capture content.
* Organizing Captures into intentional groups.
* Generating Insights.
* Performing Search.
* Managing synchronization or backups.

These responsibilities belong to their respective domains.

---

# High-Level Attributes

Only conceptual attributes are defined at this stage.

### Identity

Represents a stable user-defined classification.

---

### Semantic Meaning

Represents the concept the Tag communicates.

The meaning is established by the User rather than the system.

---

### Classification Relationships

Represents references to one or more Captures.

The Tag never duplicates or stores Capture content.

---

### Reusability

Represents the expectation that a Tag may be applied consistently across many Captures over time.

---

### Status

Represents the Tag's current lifecycle.

Operational states belong to future state models.

---

# Relationships

## Tag → User

Every Tag references exactly one owning User.

---

## Tag ↔ Capture

A Tag may classify many Captures.

A Capture may reference many Tags.

Classification never changes Capture identity or ownership.

---

## Tag ↔ Collection

Tags and Collections complement one another but remain fundamentally different.

* **Tags** express reusable semantic classification.
* **Collections** express intentional user grouping.

Neither replaces the other.

---

## Tag ← Insight

Insights may recognize recurring Tags as supporting evidence.

Insights do not define Tag meaning.

---

## Tag → Backup

Backups preserve Tags and their classification relationships.

---

## Tag → Connected Service

Tags may participate in synchronization according to user preferences.

Their semantic meaning remains unchanged.

---

# Lifecycle

The Tag lifecycle reflects reusable classification.

### Created

The User establishes a new semantic concept.

---

### Active

The Tag is available for classifying Captures.

This is the normal operating state.

---

### Archived

The Tag is intentionally retired from everyday use while preserving historical classifications.

Previously classified Captures remain unchanged.

---

### Deleted

The Tag is intentionally removed.

Classification relationships are removed.

Referenced Captures remain unaffected.

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

Applying or removing a Tag from a Capture does not alter the Tag's lifecycle.

---

# CRUD Responsibilities

### Create

Establish a reusable semantic classification.

---

### Read

Access Tag meaning and its Capture relationships.

---

### Update

Refine the Tag's semantic meaning or classification relationships.

Updates never modify the referenced Captures.

---

### Delete

Remove the Tag and its classification relationships while preserving all Captures.

---

# Offline Behaviour

Tags are fully functional offline.

Users can:

* Create Tags.
* Apply Tags.
* Remove Tags.
* Rename Tags.
* Archive or delete Tags.

Classification remains available regardless of connectivity.

---

# Sync Behaviour

Synchronization extends availability rather than defining classification.

Core principles:

* Local classification remains authoritative until synchronization succeeds.
* Synchronization preserves semantic relationships.
* Synchronization never changes Tag meaning.
* Temporary synchronization delays never invalidate a Tag.

---

# Privacy Rules

Tags inherit the User's privacy principles.

Core rules include:

* Every Tag belongs to one User.
* Tag classifications remain private unless explicitly shared through future capabilities.
* Synchronization requires explicit user consent.
* Tags must never expose Capture content beyond the User's privacy choices.

---

# Validation Rules

A valid Tag must satisfy the following:

* References exactly one owning User.
* Represents one reusable semantic concept.
* Maintains a stable identity throughout its lifecycle.
* References Captures rather than containing Capture content.
* Remains meaningful independently of any single Capture.

---

# Business Rules

### Rule 1

A Tag classifies Captures without owning them.

---

### Rule 2

A Capture may reference multiple Tags.

---

### Rule 3

A Tag may classify multiple Captures.

---

### Rule 4

Removing a Tag never removes a Capture.

---

### Rule 5

Tags represent explicit user-defined semantic meaning.

They are never automatically created without user approval.

---

### Rule 6

Tags classify.

Collections organize.

Insights derive relationships.

Search retrieves.

These responsibilities remain intentionally separate.

---

### Rule 7

Changing a Tag never changes the identity, ownership, lifecycle, or meaning of any referenced Capture.

---

# Future Extensibility

The Tag should support future evolution without changing its core purpose.

Potential extensions include:

* Suggested Tags based on existing user vocabulary, requiring explicit acceptance.
* Tag aliases or synonymous labels.
* Hierarchical Tags if future research demonstrates sustained value.
* Color or icon customization for recognition (without affecting semantics).
* Shared vocabularies in future collaborative ownership models.

Every extension must preserve the principle that semantic meaning is established by the User, not inferred automatically.

---

# Architectural Notes

## Independent Aggregate Root

The Tag is an independent aggregate root.

It references its owning User while managing its own lifecycle and classification relationships.

---

## Classification Without Interpretation

A Tag labels a Capture.

It does not explain, summarize, or interpret it.

Interpretation belongs to the Insight domain.

---

## Stable Vocabulary

Tags form part of the User's personal vocabulary.

Their long-term value comes from consistent reuse rather than one-time labeling.

---

## Complementary Domain Responsibilities

The organizational domains remain intentionally distinct:

* **Collections** answer: *"Which ideas do I intentionally want together?"*
* **Tags** answer: *"How do I classify this idea?"*
* **Search** answers: *"How do I find an idea?"*
* **Insights** answer: *"What relationships emerge across my ideas?"*

Maintaining these boundaries prevents conceptual overlap and preserves a simple mental model.

---

## Source of Truth

The Tag establishes the architectural principle for semantic classification throughout Vaha:

> **A Tag is a reusable, user-defined semantic classification that labels Captures through stable relationships without changing their identity, ownership, lifecycle, or meaning.**

All future classification capabilities should extend this principle rather than introducing overlapping organizational models or automatically redefining the user's personal vocabulary.
