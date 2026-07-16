
# Information Model

## Phase 2 – Entity Specification 06

# Insight

**Status:** Draft for Review

---

# Purpose

The **Insight** represents a derived understanding that emerges from one or more user-owned Captures.

Its purpose is not to create knowledge. Its purpose is to reveal patterns, relationships, themes, or reflections that already exist within the user's own thoughts.

Within the domain:

> **An Insight reveals understanding. It never becomes the knowledge itself.**

An Insight always exists in service of helping the user better understand their own thinking.

---

# Ownership

Every Insight belongs to exactly one User.

An Insight manages its own lifecycle independently while always referencing its owning User.

An Insight never owns knowledge.

It references the Captures from which it is derived.

---

# Responsibilities

The Insight is responsible for:

* Representing a derived understanding.
* Maintaining traceable relationships to originating Captures.
* Evolving as the user's body of knowledge grows.
* Supporting reflection rather than decision-making.
* Remaining understandable through supporting evidence.

The Insight is **not** responsible for:

* Creating knowledge.
* Modifying Captures.
* Replacing Captures.
* Organizing Captures.
* Classifying Captures.
* Managing synchronization.
* Managing privacy decisions.

These responsibilities belong to their respective domains.

---

# High-Level Attributes

Only conceptual attributes are defined at this stage.

### Identity

Represents a stable derived understanding.

---

### Interpretation

Represents the human-readable observation revealed from one or more Captures.

Interpretation exists to support reflection.

---

### Evidence

Represents references to the originating Captures.

Evidence forms the foundation of every Insight.

---

### Scope

Represents the conceptual range over which the Insight applies.

Its scope may naturally evolve as additional Captures become available.

---

### Status

Represents the Insight's current lifecycle.

Operational processing belongs to future state models.

---

# Relationships

## Insight → User

Every Insight references exactly one owning User.

---

## Insight ↔ Capture

Every Insight references one or more Captures.

Every Capture may contribute to multiple Insights.

Captures remain the canonical source of knowledge.

---

## Insight ↔ Collection

Insights may reference Collections when presenting broader reflections.

Collections never define Insight meaning.

---

## Insight ↔ Tag

Insights may recognize recurring Tags as supporting evidence.

Tags never define Insight interpretation.

---

## Insight → Backup

Backups preserve Insights together with their evidence relationships.

---

## Insight → Connected Service

Insights may participate in synchronization according to user preferences.

Their conceptual meaning remains unchanged.

---

# Lifecycle

The Insight lifecycle reflects evolving understanding.

### Derived

The Insight is first recognized from available Captures.

Its evidence relationships are established.

---

### Active

The Insight provides meaningful reflection.

This is the normal operating state.

---

### Evolved

The Insight has been naturally refined because additional Captures provide stronger or broader supporting evidence.

Its identity remains continuous.

---

### Retired

The Insight is no longer considered meaningful because its supporting evidence has materially changed.

The Insight is preserved only when appropriate according to future product policy.

---

# High-Level State Model

```text
Derived
    ↓
Active
    ↓
Evolved (optional)
    ↓
Active
    ↓
Retired (optional)
```

The evolution of an Insight reflects changing understanding, not changing ownership.

---

# CRUD Responsibilities

### Create

Establish a new derived understanding from existing Captures.

---

### Read

Present the Insight together with its supporting evidence.

---

### Update

Refine the Insight as new evidence becomes available.

Updates must preserve explainability.

---

### Delete

Remove the Insight without affecting any originating Captures.

---

# Offline Behaviour

Insights support full offline operation.

Insights derived locally remain available without internet connectivity.

The absence of connectivity never invalidates an existing Insight.

Optional future enhancements requiring external services never replace locally available Insights.

---

# Sync Behaviour

Synchronization extends availability rather than defining understanding.

Core principles:

* Local Insights remain valid until synchronization succeeds.
* Synchronization preserves evidence relationships.
* Synchronization never changes ownership.
* Synchronization must never introduce Insights that cannot be explained through user-owned Captures.

---

# Privacy Rules

Insights inherit the User's privacy principles.

Core rules include:

* Every Insight belongs to one User.
* Every Insight remains explainable through user-owned Captures.
* Synchronization requires explicit user consent.
* Insights must never expose knowledge beyond the Captures from which they derive.
* The existence of an Insight never grants broader access to underlying Captures.

---

# Validation Rules

A valid Insight must satisfy the following:

* References exactly one owning User.
* References one or more existing Captures.
* Maintains traceable evidence relationships.
* Represents understanding rather than original knowledge.
* Remains understandable without external explanation.

---

# Business Rules

### Rule 1

Every Insight must reference one or more Captures.

---

### Rule 2

Insights never replace Captures.

---

### Rule 3

Insights never modify Captures.

---

### Rule 4

Insights never own knowledge.

Knowledge always remains within Captures.

---

### Rule 5

Every Insight must be explainable through its supporting evidence.

---

### Rule 6

Insights may evolve as additional Captures become available.

Evolution must preserve continuity and explainability.

---

### Rule 7

Insights encourage reflection.

They never prescribe actions or decisions.

---

### Rule 8

If sufficient supporting evidence no longer exists, the Insight must evolve or retire rather than presenting unsupported conclusions.

---

# Future Extensibility

The Insight should support future evolution without changing its core purpose.

Potential extensions include:

* Long-term thematic reflections.
* Periodic summaries across selected timeframes.
* Stronger relationship discovery across large Capture collections.
* User feedback indicating whether an Insight remains meaningful.
* Optional advanced derivation methods, provided every resulting Insight remains fully explainable.

Every extension must preserve the principle that Insights reveal existing knowledge rather than creating new knowledge.

---

# Architectural Notes

## Independent Aggregate Root

The Insight is an independent aggregate root.

It references its owning User while managing its own lifecycle and evidence relationships.

---

## Explainability First

An Insight is trustworthy only if it can be traced back to the Captures that support it.

Explainability is a core domain requirement rather than an implementation feature.

---

## Derived, Never Original

Insights are secondary knowledge.

The primary source of truth always remains the originating Captures.

---

## Reflection Over Prescription

The Insight domain exists to help users notice patterns already present in their thinking.

It deliberately avoids recommendations, judgments, or task-oriented behavior.

---

## Evolution Without Reinvention

As new Captures are added, an Insight may evolve naturally.

This evolution strengthens understanding while preserving continuity rather than repeatedly generating disconnected observations.

---

# Source of Truth

The Insight establishes the architectural principle for understanding throughout Vaha:

> **An Insight is a user-owned, derived understanding that reveals patterns already present across one or more Captures through explainable evidence. It never replaces, modifies, or owns the knowledge contained within those Captures.**

All future reflection and understanding capabilities must build upon this principle, ensuring that Vaha remains a trusted companion for understanding the user's own thoughts rather than generating opaque or independent knowledge.
