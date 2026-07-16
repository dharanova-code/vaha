
# Information Model

## Phase 5 – Metadata Standards

**Status:** Draft for Review

---

# Purpose

The Metadata Standards define the common descriptive information that accompanies every core domain entity throughout the Vaha ecosystem.

Metadata exists to provide consistency, traceability, continuity, and interoperability across the domain.

It does **not** define business meaning.

Business meaning belongs to the entities and their state models.

Metadata exists to support those models, never replace them.

---

# Why a Separate Metadata Standards Document Exists

Without common metadata standards, each entity would evolve independently, resulting in inconsistent naming, lifecycle interpretation, ownership representation, and traceability.

This document establishes one shared architectural contract for every current and future domain entity.

It answers:

> **"How should business information be described consistently across the domain?"**

It deliberately does **not** answer:

* What an entity means.
* How an entity behaves.
* How an entity is implemented.

---

# Metadata Design Principles

## Principle 1. Metadata Supports the Domain

Metadata describes entities.

It never defines them.

---

## Principle 2. Metadata Is Universal

Every core entity follows the same conceptual metadata conventions.

---

## Principle 3. Stable Identity

Identity is permanent.

Metadata may evolve.

Identity never does.

---

## Principle 4. Business Before Operations

Business metadata takes precedence over operational metadata.

Operational concerns must never redefine business meaning.

---

## Principle 5. Local-First

Metadata is established locally together with the business entity.

External participation never becomes the authoritative source.

---

## Principle 6. Privacy by Design

Metadata should expose only what is necessary to support the domain.

Metadata itself must respect privacy principles.

---

## Principle 7. Future Compatibility

Future entities inherit these standards automatically unless a compelling business reason justifies an exception.

---

# Global Identifier Standards

Every core entity must possess one stable business identifier.

Identifier principles:

* Established once.
* Never reused.
* Never reassigned.
* Never changes throughout the entity lifecycle.
* Independent of storage location.
* Independent of synchronization.
* Independent of implementation.

An identifier represents business identity rather than technical identity.

---

# Timestamp Standards

Business time and operational time are conceptually different.

## Business Timestamps

Represent meaningful business events.

Examples include:

* Created
* Archived
* Deleted
* Restored

These describe the entity's business lifecycle.

---

## Operational Timestamps

Represent supporting operational events.

Examples include:

* Last synchronized
* Last preserved
* Last processed

Operational timestamps must never redefine business state.

---

# Lifecycle Metadata

Lifecycle metadata exists to support the entity's lifecycle.

It should:

* describe lifecycle milestones,
* remain consistent with the entity state model,
* never replace the state model.

Lifecycle meaning always belongs to the State Model.

Metadata records when meaningful lifecycle events occurred.

---

# Ownership Metadata

Ownership metadata records:

* owning User
* ownership establishment
* ownership continuity

Ownership metadata never defines ownership rules.

Those belong to the Ownership Model.

---

# Relationship Metadata

Relationship metadata describes references between entities.

It should:

* preserve referential meaning,
* distinguish ownership from relationships,
* avoid duplicating business information,
* remain independent of implementation.

Relationships describe connections.

They never redefine entity identity.

---

# Versioning Standards

Versioning represents conceptual evolution.

It does **not** represent technical revisions.

Examples include:

* meaningful user edits,
* intentional refinement,
* evolving derived understanding.

Versioning principles:

* Identity remains stable.
* Evolution remains traceable.
* Historical meaning remains understandable.

---

# Audit Metadata

Audit metadata exists to support accountability and traceability.

It should answer:

* When did meaningful business events occur?
* Who initiated them?
* What type of business event occurred?

Audit metadata must remain proportionate.

It should never become surveillance.

---

# Status Metadata

Status metadata provides concise descriptive context.

It supports:

* lifecycle interpretation,
* operational understanding,
* business traceability.

Status metadata never replaces:

* entity lifecycle,
* ownership,
* business rules.

---

# Naming Standards

Every metadata element should follow consistent naming principles.

Names should be:

* human understandable,
* business oriented,
* stable,
* implementation independent,
* future compatible.

Avoid names derived from:

* programming languages,
* storage technologies,
* transport mechanisms,
* implementation frameworks.

Business terminology always takes precedence.

---

# Deletion Standards

Deletion metadata records that deletion has occurred.

It does not define deletion behavior.

Deletion standards include:

* deletion remains explicit,
* deletion remains traceable,
* deletion preserves business integrity,
* deletion respects ownership.

Deletion metadata never implies ownership transfer.

---

# Restoration Standards

Restoration metadata records meaningful restoration events.

Restoration principles:

* restoration is intentional,
* restoration remains traceable,
* restoration preserves ownership,
* restoration never changes business identity.

Restoration metadata exists independently from backup implementation.

---

# Synchronization Metadata Principles

Synchronization metadata exists solely to describe synchronization participation.

Core principles:

* synchronization metadata never changes ownership,
* synchronization metadata never changes lifecycle,
* synchronization metadata never changes business meaning,
* synchronization metadata never becomes the source of truth.

Synchronization metadata remains operational.

Business meaning remains within the domain entities.

---

# Privacy Metadata Principles

Privacy metadata exists to describe user-approved privacy context.

It should support:

* user consent,
* ownership,
* traceability,
* transparency.

Privacy metadata should never expose unnecessary information.

The existence of metadata must not weaken privacy-first architecture.

---

# Validation Rules

Every entity metadata model must satisfy the following:

* possesses one stable identifier,
* preserves ownership continuity,
* distinguishes business timestamps from operational timestamps,
* remains implementation independent,
* preserves traceability,
* supports offline-first operation,
* respects privacy principles.

---

# Business Constraints

### Constraint 1

Metadata never defines business meaning.

---

### Constraint 2

Metadata never replaces entity specifications.

---

### Constraint 3

Metadata never replaces lifecycle state models.

---

### Constraint 4

Metadata never replaces ownership rules.

---

### Constraint 5

Metadata never changes ownership.

---

### Constraint 6

Metadata never changes lifecycle.

---

### Constraint 7

Metadata remains stable across synchronization.

---

### Constraint 8

Metadata remains independent of storage location.

---

### Constraint 9

Metadata remains independent of implementation technology.

---

### Constraint 10

Future entities automatically inherit these standards unless explicitly justified through architectural governance.

---

# Architectural Notes

## Metadata Is Descriptive

Metadata describes the business object.

It never becomes the business object.

---

## Consistency Over Convenience

A single metadata vocabulary should exist across the entire domain.

This reduces ambiguity between entities.

---

## Business Before Technical Representation

Metadata is defined using business language.

Technical representations belong to implementation.

---

## Stable Foundation

Metadata standards should evolve more slowly than application features.

They provide continuity across the product lifecycle.

---

## Offline-First Compatibility

Metadata originates together with the business entity.

Connectivity never determines metadata validity.

---

## Privacy-First Compatibility

Metadata should expose the minimum business information necessary to support ownership, traceability, and lifecycle understanding.

---

## Inheritance by Default

Every future entity specification should inherit these metadata standards automatically.

Only genuine business requirements justify deviation.

---

# Source of Truth

The Metadata Standards establish the architectural principle for descriptive information across the Vaha ecosystem:

> **Metadata exists to consistently describe domain entities without defining their business meaning. Every core entity inherits a stable business identity, clear ownership context, traceable lifecycle information, consistent relationships, conceptual versioning, proportionate auditability, and privacy-respecting metadata that remain independent of implementation, storage, synchronization, and user interface. Business entities remain the source of meaning, state models remain the source of lifecycle, ownership models remain the source of authority, and metadata provides the consistent descriptive foundation that connects them.**

With this artifact, the **Information Model** reaches architectural completeness. Together, the Domain Model, Entity Specifications, State Models, Ownership Model, and Metadata Standards form a coherent, implementation-independent foundation that can guide UX, application architecture, synchronization, persistence, and future extensions while preserving Vaha's core principles of local-first ownership, privacy-first design, and clear domain boundaries.
