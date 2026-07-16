
# Architecture Decision Record

## ADR-002 — Capture as the Canonical Business Object

**Status:** Accepted

**Date:** 2026-07-16

---

# Context

Vaha exists to help users preserve and better understand their own thoughts.

During the early architectural design, it became clear that many different artifacts could emerge from a single moment of capture, including recorded audio, written transcript, contextual information, derived understanding, organization, preservation, and future forms of enrichment.

Without a clear architectural center, these artifacts could gradually evolve into competing business objects, fragmenting the domain model and creating inconsistent ownership, lifecycle, and user understanding.

The architecture therefore required a single canonical business object around which the entire product could be organized.

---

# Problem Statement

As Vaha evolves, new capabilities will naturally be introduced.

Without an explicit architectural decision, these capabilities may begin creating independent domain objects that duplicate or compete with the user's original thought.

Over time this would introduce:

* multiple competing sources of business meaning,
* inconsistent ownership boundaries,
* fragmented user workflows,
* duplicated lifecycle models,
* increasing architectural complexity.

The product therefore requires a permanent decision defining the canonical representation of user knowledge.

---

# Decision

**The Capture is the canonical business object of the Vaha ecosystem.**

Every meaningful capability within Vaha must relate to a Capture in one of the following ways:

* create a Capture,
* enrich a Capture,
* organize a Capture,
* reference a Capture,
* protect a Capture,
* derive understanding from one or more Captures.

No capability should introduce an alternative business object that competes with the Capture as the primary representation of the user's knowledge.

Representations of a Capture, including audio, transcript, summaries, contextual information, and future representations, remain subordinate to the Capture itself.

---

# Rationale

The user's original thought is the enduring asset that Vaha exists to preserve.

Different representations may evolve over time, but they all describe the same underlying business concept.

Treating the Capture as the canonical object provides:

* one stable business identity,
* one ownership boundary,
* one lifecycle,
* one source of business meaning.

This keeps the architecture centered on preserving user knowledge rather than managing multiple representations of it.

It also allows future capabilities to evolve without introducing conceptual duplication.

---

# Alternatives Considered

## Alternative A. Multiple Equal Business Objects

Audio, transcript, summaries, and other representations would each become independent domain entities.

**Rejected**

Reason:

This fragments business meaning and creates unnecessary ownership and lifecycle complexity.

---

## Alternative B. Media-Centric Architecture

The recording itself would become the primary business object.

**Rejected**

Reason:

A recording is only one representation of a captured thought.

The business value lies in the thought, not the medium through which it was preserved.

---

## Alternative C. Transcript-Centric Architecture

The transcript would become the canonical representation.

**Rejected**

Reason:

The transcript is an interpretation or representation of the Capture rather than the Capture itself.

Future representations should not require redefining the business model.

---

## Alternative D. Feature-Specific Domain Objects

Each major capability would introduce its own primary business object.

**Rejected**

Reason:

This would gradually decentralize the domain and make future architecture increasingly difficult to reason about.

---

# Consequences

## Positive

* Establishes one clear source of business meaning.
* Simplifies ownership and lifecycle modeling.
* Reduces duplication across future capabilities.
* Provides a stable foundation for organization, preservation, and understanding.
* Makes future extensions easier to evaluate.
* Preserves a consistent mental model for users and architects.

## Negative

* New capabilities must integrate with the Capture rather than defining independent primary objects.
* Architectural reviews require ongoing discipline to prevent domain fragmentation.
* Some implementation approaches may appear simpler initially but conflict with the canonical model.

These consequences are accepted because they improve long-term architectural coherence.

---

# Trade-offs

This decision intentionally favors:

* conceptual simplicity over feature-specific modeling,
* one canonical object over multiple specialized objects,
* architectural consistency over local optimization,
* long-term maintainability over short-term implementation convenience.

The architecture becomes more opinionated, but significantly more stable.

---

# Related Architectural Principles

This decision reinforces the following established principles:

* Capture-Centric Domain
* User Ownership
* Explainable Intelligence
* Local-First
* Privacy-First
* Minimal Domain Surface
* Stable Business Identity
* Representation Independence

These principles are defined in the approved architectural artifacts and are not redefined here.

---

# Related Documents

This decision should be interpreted alongside the following frozen artifacts:

* Product Vision
* Information Architecture
* Feature Ownership Matrix
* User Journey Maps
* Information Model

  * Domain Model
  * Capture Entity Specification
  * Ownership Model
  * Metadata Standards
  * Capture State Model

These documents define the role and behavior of the Capture.

This ADR records **why** the Capture occupies the architectural center of the domain.

---

# Future Reassessment Criteria

This decision should only be reconsidered if one or more of the following conditions occur:

* The primary purpose of Vaha fundamentally changes from preserving personal knowledge to managing multiple independent business objects.
* User research consistently demonstrates that a single canonical representation no longer reflects how users understand their own information.
* A demonstrably superior domain model preserves clarity, ownership, lifecycle integrity, and long-term maintainability while replacing the Capture-centric architecture.

The following are **not** valid reasons for reassessment:

* New media types.
* New enrichment capabilities.
* New AI capabilities.
* New storage technologies.
* New synchronization methods.
* New implementation frameworks.

These changes affect representations or capabilities, not the canonical business object.

---

# Architectural Record

This ADR establishes the permanent architectural position that **the Capture is the canonical business object of the Vaha ecosystem**.

It ensures that every future capability strengthens rather than fragments the domain.

When evaluating any new feature, the first architectural question should be:

> **Does this capability create, enrich, organize, reference, protect, or derive understanding from a Capture?**

If the answer is **yes**, the capability aligns with the architecture.

If the answer requires introducing a competing primary business object, the proposal should be challenged before adoption.

This decision preserves a single source of business meaning while allowing representations, enrichments, and future capabilities to evolve without redefining the fundamental structure of the domain.
