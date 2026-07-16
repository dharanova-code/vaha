
# Architecture Decision Record

## ADR-006 — Modular Domain Evolution

**Status:** Accepted

**Date:** 2026-07-16

---

# Context

Vaha has established a stable architectural foundation through its Product Vision, Domain Model, Entity Specifications, State Models, Ownership Model, Metadata Standards, and preceding Architecture Decision Records.

As the product evolves, new ideas will naturally emerge, including:

* additional capabilities,
* new workflows,
* richer understanding,
* new integrations,
* broader device support,
* future product modules.

Without architectural discipline, successful products often accumulate new domain entities whenever new features are introduced. Over time, this leads to an increasingly fragmented Core Domain, overlapping responsibilities, and inconsistent business language.

The architecture therefore requires a long-term governance decision that defines **how the domain is allowed to evolve**.

---

# Problem Statement

Growth is inevitable.

Domain expansion is optional.

Without explicit governance, future architectural decisions may:

* introduce entities that duplicate existing concepts,
* confuse capabilities with business objects,
* weaken ownership boundaries,
* fragment business meaning,
* increase long-term complexity.

The Core Domain must therefore be protected from unnecessary expansion while remaining capable of supporting future product evolution.

---

# Decision

**Vaha evolves through modular extension rather than continuous expansion of its Core Domain.**

Accordingly:

* The Core Domain remains intentionally small and stable.
* Existing domain concepts are extended before new domain entities are introduced.
* A new entity is created only when it represents independent business meaning, independent ownership, and an independent lifecycle.
* Capabilities, representations, workflows, integrations, and implementation concerns do not automatically become domain entities.
* Architectural growth occurs through bounded modules that build upon the Core Domain rather than redefining it.

The burden of justification always rests with introducing a new domain entity.

---

# Rationale

A stable domain model provides continuity across years of product evolution.

Most new capabilities do not represent new business concepts.

Instead, they enrich, organize, protect, reference, or derive understanding from concepts that already exist.

By preserving a deliberately small Core Domain, Vaha gains:

* clearer architectural reasoning,
* stronger business language,
* simpler ownership boundaries,
* more durable documentation,
* lower conceptual complexity,
* greater adaptability over time.

This approach treats architectural simplicity as a strategic asset rather than a temporary convenience.

---

# Alternatives Considered

## Alternative A. Feature-Driven Domain Growth

Introduce a new domain entity whenever a significant feature is added.

**Rejected**

Reason:

Features often represent behavior rather than independent business concepts.

This approach steadily fragments the domain.

---

## Alternative B. Unlimited Core Expansion

Allow the Core Domain to absorb new concepts whenever they appear useful.

**Rejected**

Reason:

An ever-growing Core Domain becomes increasingly difficult to understand, govern, and evolve.

---

## Alternative C. Capability-Centric Modeling

Treat workflows, integrations, representations, and services as primary domain entities.

**Rejected**

Reason:

Capabilities describe what the product does.

They do not necessarily represent enduring business concepts.

---

## Alternative D. Rigidly Frozen Domain

Prevent the introduction of any future entities.

**Rejected**

Reason:

The architecture must remain capable of evolving when genuinely new business concepts emerge.

Growth should be disciplined, not prohibited.

---

# Consequences

## Positive

* Preserves long-term architectural clarity.
* Prevents unnecessary domain fragmentation.
* Encourages thoughtful evaluation of new concepts.
* Strengthens consistency across documentation and product evolution.
* Supports modular expansion without destabilizing the Core Domain.
* Makes future architectural reviews more objective.

## Negative

* Introducing new entities requires deliberate architectural review.
* Some features may require additional design effort to integrate with existing concepts.
* Product evolution may proceed more deliberately than feature-driven expansion.

These consequences are accepted because they protect the long-term integrity of the domain.

---

# Trade-offs

This decision intentionally favors:

* domain stability over rapid expansion,
* conceptual clarity over feature-specific modeling,
* enduring business concepts over short-term convenience,
* architectural governance over unrestricted growth.

The architecture accepts a higher threshold for introducing new entities in exchange for a more coherent and sustainable domain.

---

# Related Architectural Principles

This decision reinforces the following established principles:

* Minimal Domain Surface
* Capture-Centric Domain
* User Ownership
* Local-First
* Privacy-First
* Explainable Intelligence
* Calm Technology
* Progressive Disclosure
* Stable Business Identity

These principles are defined in the approved architectural artifacts and are not redefined here.

---

# Related Documents

This decision should be interpreted alongside the following frozen artifacts:

* Product Vision
* Domain Model
* Entity Specifications
* State Models
* Ownership Model
* Metadata Standards
* ADR-001 — Local-First Architecture
* ADR-002 — Capture as the Canonical Business Object
* ADR-003 — User Ownership as the Single Source of Data Ownership
* ADR-004 — Explainable Intelligence by Design
* ADR-005 — Calm Technology Through Progressive Disclosure

These artifacts define the current architecture.

This ADR defines how that architecture should evolve over time.

---

# Future Reassessment Criteria

This decision should only be reconsidered if one or more of the following conditions occur:

* The product fundamentally changes beyond personal knowledge preservation into multiple independent business domains.
* Sustained architectural evidence demonstrates that the existing Core Domain can no longer represent essential business concepts without losing clarity.
* A demonstrably superior governance model preserves conceptual simplicity, ownership clarity, and long-term maintainability while enabling healthier domain evolution.

The following are **not** valid reasons for reassessment:

* New product features.
* New workflows.
* New representations of existing concepts.
* Additional integrations.
* New implementation techniques.
* Platform expansion.
* Growth in product scope.

These changes represent opportunities to extend the architecture, not reasons to redefine its core.

---

# Architectural Record

This ADR establishes the permanent architectural position that **the Core Domain is a long-term asset that should evolve through disciplined extension rather than continuous expansion**.

It also establishes a permanent distinction between:

* **Business concepts**, which may justify domain entities.
* **Capabilities**, which describe what the product does.
* **Representations**, which describe how business concepts are expressed.
* **Workflows**, which describe how users interact with the product.
* **Integrations**, which extend the ecosystem without redefining the domain.

Only business concepts with independent meaning, ownership, and lifecycle should become Core Domain entities.

Every future proposal to introduce a new entity should therefore answer the following architectural questions:

1. Does it represent a genuinely independent business concept?
2. Does it require its own ownership model?
3. Does it require its own lifecycle?
4. Can the capability instead extend an existing domain entity?
5. Will introducing this entity make the Core Domain simpler rather than more complex five years from now?

If these questions cannot be answered affirmatively, the proposal should extend the existing domain instead of expanding it.

This ADR concludes **Phase A – Architectural Foundation** for Vaha.

Together, the Product Vision, Domain Model, Information Model, User Journey Maps, Ownership Model, Metadata Standards, and Architecture Decision Records establish the long-term governance framework for the Vaha ecosystem. Future product evolution should be measured against these decisions to preserve architectural clarity, user ownership, privacy, and conceptual simplicity over the lifetime of the product.
