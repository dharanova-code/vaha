
# Architecture Decision Record

## ADR-003 — User Ownership as the Single Source of Data Ownership

**Status:** Accepted

**Date:** 2026-07-16

---

# Context

Vaha is built around preserving personal knowledge over long periods of time.

Throughout the product lifecycle, user knowledge may interact with many participants, including:

* trusted Devices,
* Backups,
* Connected Services,
* synchronization,
* derived Insights,
* future integrations.

Each of these participates in the lifecycle of user knowledge in different ways.

Without a clear architectural decision, participation could easily be mistaken for ownership, leading to ambiguity in responsibility, lifecycle, privacy, and long-term product evolution.

The architecture therefore requires a permanent definition of ownership that remains valid regardless of implementation or future capabilities.

---

# Problem Statement

As the ecosystem grows, more components will interact with user knowledge.

Without an explicit ownership model, the architecture risks conflating:

* ownership,
* aggregate boundaries,
* operational responsibility,
* storage location,
* synchronization,
* external participation.

This ambiguity would weaken the product's privacy-first and local-first principles while making future architectural decisions inconsistent.

The product therefore requires one immutable definition of business ownership.

---

# Decision

**Every piece of user knowledge in Vaha belongs to exactly one User.**

Ownership is singular, explicit, and continuous throughout the lifecycle of every domain entity.

Participation does not imply ownership.

Accordingly:

* Devices enable the creation of knowledge but never own it.
* Connected Services extend the experience but never own it.
* Synchronization extends availability but never transfers ownership.
* Backups preserve knowledge but never transfer ownership.
* Insights derive understanding but never own knowledge.

Ownership always remains with the User until explicitly ended according to the business lifecycle.

---

# Rationale

Ownership is a business concept rather than a technical characteristic.

It answers:

> **"Whose knowledge is this?"**

This question remains meaningful regardless of:

* where the information exists,
* how many copies exist,
* which systems participate,
* whether connectivity is available.

Separating ownership from operational participation creates a stable architectural foundation that preserves:

* user trust,
* privacy,
* continuity,
* explainability,
* long-term consistency.

It also ensures that future architectural evolution cannot accidentally redefine who owns the user's thoughts.

---

# Alternatives Considered

## Alternative A. Device Ownership

Knowledge would belong to the Device that created it.

**Rejected**

Reason:

Devices are replaceable companions.

User knowledge must outlive hardware.

---

## Alternative B. Service Ownership

External services would become the primary owners of synchronized knowledge.

**Rejected**

Reason:

This conflicts directly with Vaha's local-first and privacy-first principles.

---

## Alternative C. Shared Ownership

Knowledge would simultaneously belong to multiple participants.

**Rejected**

Reason:

Shared ownership creates ambiguity in responsibility, lifecycle, privacy, and conflict resolution.

Singular ownership provides a clearer and more durable model.

---

## Alternative D. Storage-Based Ownership

Ownership would depend on where information is currently stored.

**Rejected**

Reason:

Storage location is an implementation concern.

Ownership is a business concept that must remain independent of physical or logical storage.

---

# Consequences

## Positive

* Establishes one clear owner for every domain entity.
* Simplifies privacy and consent decisions.
* Prevents ambiguity during synchronization and recovery.
* Supports long-term hardware independence.
* Enables future integrations without redefining ownership.
* Creates consistent architectural reasoning across the entire domain.

## Negative

* Every future capability must distinguish between participation and ownership.
* Architectural reviews require ongoing discipline to prevent ownership leakage into supporting domains.
* Some implementation approaches that implicitly assign ownership to infrastructure will be incompatible with this model.

These consequences are accepted because they preserve conceptual integrity and user trust.

---

# Trade-offs

This decision intentionally favors:

* explicit ownership over inferred ownership,
* conceptual clarity over implementation convenience,
* long-term stability over localized optimization,
* user authority over infrastructure authority.

The architecture becomes more disciplined, but substantially more resilient.

---

# Related Architectural Principles

This decision reinforces the following established principles:

* User Ownership
* Local-First
* Privacy-First
* Hardware Independence
* Explicit User Consent
* Stable Business Identity
* Ownership Before Storage
* Explainable Domain Boundaries

These principles are defined in the approved architectural artifacts and are not redefined here.

---

# Related Documents

This decision should be interpreted alongside the following frozen artifacts:

* Product Vision
* Domain Model
* User Entity Specification
* Capture Entity Specification
* Device Entity Specification
* Backup Entity Specification
* Connected Service Entity Specification
* Ownership Model
* Metadata Standards

These artifacts define ownership relationships and domain responsibilities.

This ADR records **why** ownership is singular and permanently centered on the User.

---

# Future Reassessment Criteria

This decision should only be reconsidered if one or more of the following conditions occur:

* The product fundamentally changes from a personal knowledge system to a multi-owner domain.
* A future collaboration model requires explicit business ownership beyond a single User.
* A demonstrably superior ownership model preserves clarity, privacy, explainability, and long-term consistency while supporting new product goals.

The following are **not** valid reasons for reassessment:

* New Devices.
* New Connected Services.
* New synchronization methods.
* New backup strategies.
* New storage technologies.
* New processing capabilities.
* New implementation frameworks.

These changes affect participation, not ownership.

---

# Architectural Record

This ADR establishes the permanent architectural position that **the User is the single source of business ownership throughout the Vaha ecosystem**.

It also establishes a permanent distinction between ownership and other architectural concepts:

* **Ownership** answers: *Who owns this knowledge?*
* **Aggregate boundaries** answer: *Who maintains consistency?*
* **Operational responsibility** answers: *Who performs this work?*
* **Storage** answers: *Where does this information exist?*
* **Synchronization** answers: *Where is this information available?*

These concepts must remain independent.

When evaluating any future feature, the first ownership question should be:

> **Does this proposal preserve singular user ownership while allowing other participants to support the lifecycle without becoming owners?**

If the answer is **yes**, the proposal aligns with this architectural decision.

If ownership becomes ambiguous, implicit, or transferred as a side effect of participation, the proposal conflicts with this ADR and should be reconsidered before adoption.
