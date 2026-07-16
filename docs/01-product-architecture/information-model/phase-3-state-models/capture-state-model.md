
# Information Model

## Phase 3 – State Model 01

# Capture State Model

**Status:** Approved

---

# Purpose

The Capture State Model defines the **business lifecycle** of a Capture.

It answers one question:

> **"Where is this Capture in its business life?"**

It deliberately does **not** describe operational activities such as transcription, synchronization, indexing, enrichment, or backup. Those are independent concerns that may occur while a Capture remains in the same business state.

---

# Why a Separate State Model Exists

The Capture entity defines **what** a Capture is.

The Capture State Model defines **how its business status changes over time.**

Separating lifecycle from implementation provides several architectural benefits:

* Prevents operational events from redefining business meaning.
* Allows processing to evolve independently.
* Keeps business rules stable as implementation changes.
* Preserves a simple, explainable lifecycle.

This separation reinforces a core Vaha principle:

> **A Capture exists because a thought was preserved, not because processing completed successfully.**

---

# State Definitions

## Created

The Capture has been successfully established as a new user-owned business object.

Ownership exists.

Identity exists.

The Capture is valid.

This state is intentionally short-lived.

---

## Available

The Capture is part of the User's knowledge.

It may be:

* referenced
* organized
* classified
* reflected upon
* preserved

This is the normal and longest-lived business state.

---

## Archived

The User intentionally removes the Capture from everyday attention.

The Capture remains fully preserved.

Its ownership, identity, and meaning remain unchanged.

Archiving affects visibility, not existence.

---

## Deleted

The User intentionally removes the Capture.

The Capture is no longer part of the active knowledge domain.

Deletion represents the end of the business lifecycle.

---

# State Transition Diagram

```text
Created
    │
    ▼
Available
    │
    ├─────────────┐
    ▼             │
Archived          │
    │             │
    └──────►Available
                  │
                  ▼
               Deleted
```

---

# Valid Transitions

## Created → Available

The Capture becomes part of the User's active knowledge.

---

## Available → Archived

The User intentionally removes the Capture from everyday attention.

---

## Archived → Available

The User intentionally restores the Capture to active use.

---

## Available → Deleted

The User intentionally deletes the Capture.

---

# Invalid Transitions

The following transitions are not permitted.

## Created → Archived

A Capture cannot be archived before becoming part of the User's knowledge.

---

## Created → Deleted

A Capture cannot bypass establishment of ownership.

---

## Archived → Deleted (direct)

Deletion should occur only from the active business state.

This preserves a deliberate, understandable lifecycle.

If the User deletes an archived Capture, the domain first conceptually restores it to the active lifecycle before deletion.

---

## Deleted → Any State

Deletion is terminal.

A deleted Capture never re-enters the lifecycle.

Recovery, if supported through Backup, results in a new business lifecycle established through restoration rather than reversing deletion.

---

# Transition Triggers

## Capture Created

A new thought is successfully preserved.

Transition:

Created → Available

---

## Archive Requested

The User intentionally archives the Capture.

Transition:

Available → Archived

---

## Restore Requested

The User intentionally restores an archived Capture.

Transition:

Archived → Available

---

## Delete Requested

The User intentionally removes the Capture.

Transition:

Available → Deleted

---

# Transition Rules

## Rule 1

Every Capture begins in **Created**.

---

## Rule 2

Every valid Capture must become **Available**.

---

## Rule 3

Archiving is reversible.

---

## Rule 4

Deletion is intentional.

---

## Rule 5

Operational activities never change business state.

Examples include:

* synchronization
* preservation
* enrichment
* classification
* indexing

These occur independently.

---

## Rule 6

State transitions always preserve ownership until deletion completes.

---

# Business Constraints

### Constraint 1

Only the User may intentionally archive or delete a Capture.

---

### Constraint 2

No automated process may archive or delete a Capture on behalf of the User.

---

### Constraint 3

Archiving must never modify Capture content.

---

### Constraint 4

Deleting a Capture ends its business lifecycle.

It must never implicitly delete Collections, Tags, Insights, or other domain entities.

Those domains manage their own integrity according to their own rules.

---

### Constraint 5

A Capture's identity never changes throughout its lifecycle.

Only its business state changes.

---

# Offline Behaviour

The business lifecycle is fully available offline.

The User may:

* create
* archive
* restore
* delete

without requiring connectivity.

Ownership remains local throughout the lifecycle.

Offline operation never introduces alternative business states.

---

# Sync Considerations

Synchronization must never redefine business state.

Examples:

* A synchronized Capture remains **Available**.
* An unsynchronized Capture remains **Available**.
* A synchronized archived Capture remains **Archived**.

Synchronization affects availability across environments, not business meaning.

---

# Failure Recovery

Failures affect operations, not lifecycle.

Examples include:

* synchronization interruption
* enrichment delay
* temporary processing failure

These events do **not** change the Capture's business state.

If a transition cannot complete:

* the previous valid business state remains authoritative.
* ownership remains preserved.
* no intermediate business states are introduced.

---

# Architectural Notes

## Business Before Processing

The Capture lifecycle represents user meaning rather than system activity.

Operational concerns belong to separate models.

---

## Minimal State Surface

Only states with independent business meaning are included.

Temporary technical conditions are intentionally excluded.

---

## Stable Lifecycle

The Capture lifecycle should evolve very slowly.

New states should only be introduced if they represent a genuinely new business meaning rather than implementation complexity.

---

## Local-First Consistency

Business state belongs to the User's local knowledge.

Connectivity never determines whether a Capture exists or which business state it occupies.

---

## Independent of Representation

Audio, transcript, summaries, tags, insights, and backups may evolve independently.

None of these alter the Capture's business lifecycle.

---

# Source of Truth

The Capture State Model establishes the lifecycle principle for the canonical business object of Vaha:

> **A Capture progresses through a small, intentional business lifecycle that reflects the user's relationship with their preserved thought. Operational activities such as synchronization, transcription, enrichment, indexing, or backup never redefine that lifecycle. Business meaning always takes precedence over system behavior, preserving local-first ownership, privacy-first principles, and a stable domain model.**
