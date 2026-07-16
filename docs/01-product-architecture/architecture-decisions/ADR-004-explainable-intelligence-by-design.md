
# Architecture Decision Record

## ADR-004 — Explainable Intelligence by Design

**Status:** Accepted

**Date:** 2026-07-16

---

# Context

Vaha exists to help users better understand their own thoughts without replacing them.

As the product evolves, it will increasingly provide derived understanding through reflections, recurring themes, relationships, summaries, and future forms of intelligence.

These capabilities introduce a fundamental architectural question:

> **Should derived understanding become independently authoritative, or should it always remain accountable to the user's original knowledge?**

This decision establishes the long-term architectural position for all present and future intelligence capabilities.

---

# Problem Statement

Derived understanding can improve comprehension, but it also introduces the risk that users begin trusting conclusions without understanding their origin.

Without an explicit architectural decision, future capabilities may gradually:

* produce conclusions that cannot be verified,
* weaken the user's connection to their original thoughts,
* create competing sources of truth,
* reduce transparency,
* erode long-term trust.

The architecture therefore requires a permanent rule governing how intelligence relates to user knowledge.

---

# Decision

**Every Insight and every future intelligence-derived capability within the Vaha Core Domain must remain explainable through user-owned evidence.**

Accordingly:

* AI is never a source of truth.
* Captures remain the canonical source of knowledge.
* Every Insight references one or more originating Captures.
* Derived understanding augments user knowledge without replacing it.
* Users must always be able to understand why an Insight exists.
* Opaque or untraceable conclusions are not permitted within the Core Domain.

Explainability is a mandatory architectural property rather than an optional product feature.

---

# Rationale

Vaha exists to strengthen the user's understanding of their own thinking.

That objective can only be achieved if derived understanding remains accountable to the underlying knowledge from which it emerged.

Explainability ensures that users can:

* understand where an observation came from,
* verify that it reflects their own thoughts,
* maintain confidence in the product,
* distinguish original knowledge from derived understanding.

This preserves a consistent relationship between evidence and interpretation.

Over time, trust is built not by producing more observations, but by ensuring every observation remains understandable.

---

# Alternatives Considered

## Alternative A. Opaque Derived Understanding

Insights would be presented without requiring supporting evidence.

**Rejected**

Reason:

Users cannot evaluate conclusions they cannot understand.

Trust becomes dependent on the system rather than their own knowledge.

---

## Alternative B. Intelligence as a New Source of Truth

Derived understanding would become the primary representation of knowledge.

**Rejected**

Reason:

This conflicts with the Capture-centric architecture and weakens user ownership of meaning.

---

## Alternative C. Partial Explainability

Some intelligence capabilities would remain explainable while others would not.

**Rejected**

Reason:

Inconsistent explainability introduces uncertainty and makes the architecture difficult to reason about.

---

## Alternative D. User Trust Through Authority

The product would encourage users to accept conclusions without verification.

**Rejected**

Reason:

Authority is not the purpose of Vaha.

The product exists to improve understanding, not replace judgment.

---

# Consequences

## Positive

* Reinforces Captures as the canonical source of knowledge.
* Builds long-term user trust through transparency.
* Preserves a clear distinction between evidence and interpretation.
* Enables future intelligence capabilities without weakening architectural consistency.
* Supports meaningful reflection rather than passive acceptance.
* Keeps the domain explainable as it evolves.

## Negative

* Future intelligence capabilities must satisfy explainability requirements before becoming part of the Core Domain.
* Some forms of derived understanding may be excluded if they cannot be meaningfully traced to user-owned evidence.
* Architectural reviews require ongoing discipline to ensure new capabilities strengthen, rather than obscure, user understanding.

These consequences are accepted because they preserve trust and conceptual integrity.

---

# Trade-offs

This decision intentionally favors:

* transparency over perceived sophistication,
* evidence over authority,
* user understanding over system interpretation,
* explainability over unrestricted intelligence.

The architecture places long-term trust above short-term capability.

---

# Related Architectural Principles

This decision reinforces the following established principles:

* Capture-Centric Domain
* Explainable Intelligence
* User Ownership
* Privacy-First
* Local-First
* Reflection Over Prescription
* Stable Business Meaning
* Minimal Domain Surface

These principles are defined in the approved architectural artifacts and are not redefined here.

---

# Related Documents

This decision should be interpreted alongside the following frozen artifacts:

* Product Vision
* User Journey 6 – Understanding My Ideas (Insights)
* Domain Model
* Capture Entity Specification
* Insight Entity Specification
* Capture State Model
* Ownership Model

These artifacts define the role of Captures and Insights.

This ADR records **why** explainability is a permanent architectural requirement.

---

# Future Reassessment Criteria

This decision should only be reconsidered if one or more of the following conditions occur:

* The fundamental purpose of Vaha changes from helping users understand their own knowledge to providing independent knowledge.
* A demonstrably superior architectural approach preserves user trust, ownership, transparency, and verifiability while eliminating the need for evidence-based understanding.
* The Core Domain is intentionally redefined around a different concept of knowledge.

The following are **not** valid reasons for reassessment:

* New intelligence techniques.
* New processing methods.
* Improved analytical capabilities.
* New forms of summarization.
* Greater computational capability.
* Changes in implementation technology.

These developments may expand how understanding is derived, but they do not change the architectural requirement that understanding must remain explainable.

---

# Architectural Record

This ADR establishes the permanent architectural position that **explainability is a fundamental property of intelligence within Vaha, not an optional implementation characteristic**.

It also establishes a permanent distinction between:

* **Knowledge**, which originates from the User's Captures.
* **Understanding**, which is derived from that knowledge.

Knowledge remains primary.

Understanding remains secondary.

Every future intelligence capability should therefore be evaluated against one enduring architectural question:

> **Can the user understand why this conclusion exists by following it back to their own Captures?**

If the answer is **yes**, the capability strengthens the user's relationship with their own thoughts and aligns with this architectural decision.

If the answer is **no**, the capability introduces untraceable interpretation into the Core Domain and conflicts with this ADR.

This decision ensures that Vaha continues to help users understand their own thinking while preserving the transparency, trust, and ownership that define the product.
