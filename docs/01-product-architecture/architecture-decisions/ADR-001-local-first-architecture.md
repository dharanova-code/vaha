
# Architecture Decision Record

## ADR-001 — Local-First Architecture

**Status:** Accepted

**Date:** 2026-07-16

---

# Context

Vaha is designed to help people capture and preserve their thoughts in environments where connectivity cannot be assumed. Users should be able to trust the product regardless of network availability, external services, or infrastructure.

Early architectural exploration identified a fundamental question:

> **Should connectivity be a prerequisite for preserving user knowledge, or should it be an optional extension of an already complete experience?**

This decision influences every architectural layer of the product, including domain ownership, user experience, synchronization, privacy, and future extensibility.

Rather than treating offline capability as an enhancement, Vaha requires a foundational architectural position.

---

# Problem Statement

Without an explicit architectural decision, future features may gradually introduce dependencies on external systems that erode reliability, increase cognitive load, and weaken user ownership.

The architecture therefore requires a permanent decision defining the relationship between:

* user knowledge,
* connectivity,
* external participation,
* and product capability.

---

# Decision

**Vaha is a fundamentally local-first product.**

The complete core product experience must exist independently of external connectivity.

Local operation is the default architectural assumption.

External participation exists only to extend the experience after local ownership has already been established.

Connectivity is therefore considered an enhancement, never a prerequisite.

---

# Rationale

This decision aligns with Vaha's long-term product identity.

A local-first architecture:

* preserves uninterrupted thought capture,
* reinforces user trust,
* supports privacy by default,
* reduces dependence on external conditions,
* maintains predictable behavior,
* establishes clear ownership boundaries.

Most importantly, it ensures that the user's ability to preserve ideas is never determined by factors outside their control.

---

# Alternatives Considered

## Alternative A. Cloud-First Architecture

Knowledge would depend primarily on external infrastructure.

**Rejected**

Reason:

This conflicts with Vaha's ownership, reliability, and privacy principles.

---

## Alternative B. Hybrid Architecture with Equal Priority

Local and external environments would be treated as equivalent sources of operation.

**Rejected**

Reason:

Equal priority introduces ambiguity regarding authority, ownership, and recovery.

The architecture benefits from one clearly defined primary environment.

---

## Alternative C. Offline Mode as a Fallback

Connectivity would remain the expected operating condition, with offline capability added as an exception.

**Rejected**

Reason:

This makes reliability conditional rather than inherent.

Offline operation should not feel like a degraded experience.

---

# Consequences

## Positive

* Core functionality remains available regardless of connectivity.
* User trust is strengthened through predictable behavior.
* Ownership remains conceptually simple.
* Privacy principles become architectural rather than optional.
* External services remain optional extensions.
* Future integrations inherit clear boundaries.
* Business continuity improves under changing network conditions.

## Negative

* Some externally enhanced capabilities may become available later than core functionality.
* Additional architectural discipline is required to prevent future features from introducing hidden external dependencies.
* Feature evaluation must consistently distinguish between core capability and optional enhancement.

These consequences are accepted because they reinforce the product's long-term architectural integrity.

---

# Trade-offs

The decision intentionally favors:

* reliability over immediate connectivity,
* ownership over convenience,
* consistency over feature acceleration,
* architectural clarity over implementation flexibility.

This may limit certain real-time capabilities, but it produces a more resilient and trustworthy product.

---

# Related Architectural Principles

This decision reinforces the following established principles:

* Local-First
* Privacy-First
* User Ownership
* Calm Technology
* Offline-First Experience
* Explicit User Consent
* Explainable Intelligence
* Hardware Independence

These principles are defined in the approved architectural artifacts and are not redefined here.

---

# Related Documents

This decision is supported by, and should be interpreted alongside, the following frozen architectural artifacts:

* Product Vision
* Information Architecture
* Navigation Architecture
* Feature Ownership Matrix
* User Journey Maps
* Information Model

  * Domain Model
  * Entity Specifications
  * Ownership Model
  * Metadata Standards

These documents define **what** the product is.

This ADR records **why** local-first architecture was chosen.

---

# Future Reassessment Criteria

This decision should remain unchanged unless one or more of the following conditions occur:

* The core product purpose fundamentally changes from personal knowledge preservation to a connectivity-dependent service.
* User research consistently demonstrates that local-first behavior no longer serves the primary user needs.
* A future architectural shift can preserve user ownership, privacy, reliability, and autonomy while demonstrably providing superior long-term value.
* Regulatory or environmental changes fundamentally alter the assumptions under which local-first architecture was selected.

Implementation changes, new technologies, additional platforms, or new external services are **not** sufficient reasons to revisit this decision.

---

## Architectural Record

This ADR establishes the permanent architectural position that **local-first operation is a foundational characteristic of Vaha, not a feature**.

It exists to guide future architectural decisions by ensuring that any proposed capability is first evaluated against one enduring question:

> **Can this capability preserve Vaha's complete local-first experience, or does it make connectivity a prerequisite for the user's ownership of their ideas?**

If the latter is true, the proposal conflicts with this architectural decision and must be reconsidered before adoption.
