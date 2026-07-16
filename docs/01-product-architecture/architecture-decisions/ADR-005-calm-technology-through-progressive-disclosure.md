
# Architecture Decision Record

## ADR-005 — Calm Technology Through Progressive Disclosure

**Status:** Accepted

**Date:** 2026-07-16

---

# Context

Vaha exists to help users preserve and understand their thoughts without competing for their attention.

Throughout the product lifecycle, users interact with many capabilities, including:

* onboarding,
* capturing ideas,
* reviewing memories,
* discovering insights,
* organizing knowledge,
* managing devices,
* controlling privacy,
* optional synchronization,
* future extensions.

Each capability has the potential to introduce additional decisions, explanations, and interruptions.

Without a guiding architectural decision, complexity naturally accumulates as products mature.

The architecture therefore requires a permanent principle governing **when** the product should ask for user attention and **how much** information it should expose.

---

# Problem Statement

As capabilities expand, products often expose internal complexity in the name of transparency or flexibility.

This gradually increases:

* cognitive load,
* decision fatigue,
* unnecessary interruptions,
* attention fragmentation,
* dependence on user intervention.

Over time, the product shifts from supporting the user's thinking to competing with it.

The architecture therefore requires an explicit decision that treats user attention as a limited resource rather than an unlimited interface opportunity.

---

# Decision

**Vaha adopts Calm Technology through Progressive Disclosure as a product-wide architectural principle.**

Accordingly:

* Calmness is an architectural property, not merely a design preference.
* Complexity is revealed only when it becomes meaningful to the user.
* Routine operations remain invisible unless user attention is genuinely required.
* The product communicates outcomes rather than internal mechanisms.
* Every interruption must provide meaningful user value.
* Every additional decision presented to the user must justify its existence.

This principle applies consistently across every domain of the product, present and future.

---

# Rationale

The purpose of Vaha is to strengthen the user's relationship with their own thoughts.

Every unnecessary explanation, interruption, or decision competes with that purpose.

Progressive Disclosure allows the architecture to preserve simplicity without sacrificing capability.

Instead of removing complexity, the product manages **when** complexity becomes relevant.

This enables advanced capabilities to exist while ensuring that most users experience only what they need for the task at hand.

Over time, reducing unnecessary attention strengthens trust because users learn that Vaha asks for attention only when it truly matters.

---

# Alternatives Considered

## Alternative A. Maximum Transparency

Expose all available information and options by default.

**Rejected**

Reason:

Complete visibility increases cognitive load without increasing understanding.

Transparency should communicate meaningful outcomes rather than internal complexity.

---

## Alternative B. Feature-First Architecture

Expose every capability equally so users can discover everything immediately.

**Rejected**

Reason:

This encourages feature accumulation instead of purposeful interaction.

It weakens the product's calm and focused experience.

---

## Alternative C. Adaptive Complexity Without Principles

Reveal or hide information based solely on evolving product decisions.

**Rejected**

Reason:

Without a consistent architectural principle, complexity becomes inconsistent across domains and increasingly difficult to govern.

---

## Alternative D. Permanent Minimalism

Hide advanced capabilities entirely.

**Rejected**

Reason:

Some users legitimately require deeper control.

The architecture should delay complexity, not eliminate meaningful capability.

---

# Consequences

## Positive

* Reduces unnecessary cognitive load.
* Preserves user attention for meaningful moments.
* Supports long-term product simplicity despite increasing capability.
* Produces consistent behavior across all domains.
* Strengthens user trust through predictable interaction.
* Allows future capabilities to integrate without overwhelming existing workflows.

## Negative

* Architectural reviews must continually evaluate whether new features deserve immediate visibility.
* Some advanced capabilities may become less immediately discoverable.
* Product teams must justify new interruptions rather than assuming they are acceptable.

These consequences are accepted because they reinforce the long-term quality of the product experience.

---

# Trade-offs

This decision intentionally favors:

* attention preservation over feature visibility,
* meaningful communication over complete exposure,
* progressive understanding over immediate complexity,
* long-term clarity over short-term discoverability.

The architecture accepts that some capabilities may require an additional step to access if doing so preserves overall calmness.

---

# Related Architectural Principles

This decision reinforces the following established principles:

* Calm Technology
* Progressive Disclosure
* Content Before Configuration
* Local-First
* Privacy-First
* Reflection Over Prescription
* Minimal Domain Surface
* Human-Centered Design

These principles are defined in the approved architectural artifacts and are not redefined here.

---

# Related Documents

This decision should be interpreted alongside the following frozen artifacts:

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

These artifacts define **what** the product does.

This ADR records **why** complexity is intentionally revealed only when it becomes meaningful.

---

# Future Reassessment Criteria

This decision should only be reconsidered if one or more of the following conditions occur:

* The fundamental purpose of Vaha changes from a calm personal knowledge companion to a product whose primary value depends on continuous user interaction.
* Long-term user research consistently demonstrates that users derive greater value from persistent exposure to complexity than from progressive disclosure.
* A demonstrably superior architectural approach preserves trust, reduces cognitive load, and improves understanding without relying on progressive disclosure.

The following are **not** valid reasons for reassessment:

* Additional product features.
* Increased implementation complexity.
* New integration opportunities.
* New intelligence capabilities.
* Growth in configurable options.
* Changes in technology or platforms.

These developments increase capability, not the architectural value of user attention.

---

# Architectural Record

This ADR establishes the permanent architectural position that **Calm Technology and Progressive Disclosure are architectural governance principles for the entire Vaha ecosystem**.

It also establishes a permanent distinction between:

* **Capability**, which defines what the product can do.
* **Attention**, which defines what the user needs to know at a given moment.

Capability may grow over time.

Required attention should grow only when meaningful.

Every future feature should therefore be evaluated against one enduring architectural question:

> **Does this proposal earn the user's attention, or is it exposing complexity that can remain invisible until it becomes meaningful?**

If the proposal communicates meaningful outcomes while minimizing unnecessary attention, it aligns with this architectural decision.

If it introduces additional cognitive load without corresponding user value, it conflicts with this ADR.

This decision ensures that Vaha continues to evolve in capability while preserving the calm, trustworthy, and human-centered experience that defines the product.
