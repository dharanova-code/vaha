# Vaha Design System

This document translates the Vaha [BRAND.md](file:///c:/Projects/vaha/design/brand/BRAND.md) and [VISUAL_IDENTITY.md](file:///c:/Projects/vaha/design/brand/VISUAL_IDENTITY.md) into concrete design specifications, tokens, and component principles. It establishes the visual rules and primitives to ensure consistency across the mobile and companion platforms.

---

## 1 Color System

Vaha uses a restrained, high-contrast, slate-based palette. The system is designed to minimize visual noise and eye strain.

### Dark Mode Base (Default)
*   **Slate Primary (Background)**: `#0F172A` (Deep Slate - base background layer)
*   **Slate Secondary (Surface)**: `#1E293B` (Muted Slate - container cards and sheets)
*   **Slate Accent (Muted Border)**: `#334155` (Borders, divider lines, and disabled states)
*   **Slate Text Primary**: `#F8FAFC` (Off-white - high readability text)
*   **Slate Text Muted**: `#94A3B8` (Muted gray - metadata, telemetry labels, and timestamps)

### Light Mode Base (Utility)
*   **Bone Primary (Background)**: `#F8FAFC` (Soft paper-white - base background layer)
*   **Bone Secondary (Surface)**: `#F1F5F9` (Muted gray-white - container cards and sheets)
*   **Bone Accent (Muted Border)**: `#E2E8F0` (Borders, dividers, and disabled states)
*   **Bone Text Primary**: `#0F172A` (Deep slate - high readability text)
*   **Bone Text Muted**: `#64748B` (Muted slate - metadata, telemetry labels, and timestamps)

### Brand Highlights
*   **Teal Accent**: `#0EA5E9` (Interactive highlights, focus indicators, and active telemetry)
*   **Emerald Green**: `#10B981` (Success states, complete synchronization indicators)

---

## 2 Semantic Colors

Semantic colors map directly to system status and mirror the physical hardware interface indicators:

*   **Info / Syncing**: `#0EA5E9` (Teal) - Active background sync, BLE transmission, and loading transitions.
*   **Success**: `#10B981` (Emerald) - Complete data sync, verified device updates, and safe file purge status.
*   **Warning / Pairing**: `#F97316` (Orange) - Bluetooth pairing request, hardware connection negotiation.
*   **Error**: `#EF4444` (Red) - Sync failure, storage buffer warning, hardware diagnostics error.

---

## 3 Typography System

Vaha employs a dual-typeface typographic system. All typography scales must maintain strict vertical rhythm.

*   **Primary Typeface (Prose & Controls)**: `Inter` (Sans-serif)
    *   Clean, highly legible neo-grotesque designed for screen interface readability.
*   **Telemetry & Log Typeface (Data & Timestamps)**: `JetBrains Mono` (Monospace)
    *   Optimized for tabular telemetry data alignment, sensor readouts, timestamps, and secure system keys.

### Scale

| Level | Size (px) | Line Height (px) | Tracking | Font Weight | Typeface | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **H1** | 24px | 32px | -0.02em | Bold (700) | `Inter` | Screen Title |
| **H2** | 18px | 24px | -0.01em | SemiBold (600) | `Inter` | Section Header |
| **Body** | 15px | 22px | 0 | Regular (400) | `Inter` | Note Transcripts |
| **Meta** | 13px | 18px | +0.01em | Regular (400) | `Inter` | Description, Labels |
| **Mono Bold**| 14px | 20px | 0 | Bold (700) | `JetBrains Mono`| Data values, status logs |
| **Mono Reg** | 12px | 16px | 0 | Regular (400) | `JetBrains Mono`| Timestamps, telemetry metrics |

---

## 4 Spacing Scale

All layout properties (margins, padding, gap values, element dimensions) must align to an 8px grid system.

*   **`space-1` (4px)**: Micro-adjustments, compact label alignment.
*   **`space-2` (8px)**: Tight component spacing, internal padding of inputs.
*   **`space-3` (12px)**: Mid-level grouping spacing.
*   **`space-4` (16px)**: Standard card padding, gap between related items.
*   **`space-6` (24px)**: Outer screen margins, separation between distinct sections.
*   **`space-8` (32px)**: Deep spacing, page header top margin.
*   **`space-12` (48px)**: Extra-large breathing room, empty-state margins.

---

## 5 Corner Radius

Following the Visual Identity of **Structured Orthogonality**:

*   **`radius-none` (0px)**: Default for screen-edge panels, system headers, and lists.
*   **`radius-small` (2px)**: Internal buttons, checkboxes, inputs, and functional tags.
*   **`radius-medium` (4px)**: Container cards, modal dialogs, and slide-up sheets.
*   **`radius-pill` (9999px)**: Prohibited (except for circular status indicators under 8px).

---

## 6 Elevation

Vaha operates on a flat, low-depth surface system. It excludes heavy drop shadows.

*   **`elevation-base` (0dp)**: The primary application background (`Slate Primary`).
*   **`elevation-surface` (1dp)**: Raised container card (`Slate Secondary`) sitting directly on base background. Muted visual separation is achieved through a solid border stroke, not a shadow.
*   **`elevation-overlay` (2dp)**: Floating sheets and dialog panels. Uses a thin, high-contrast border and a subtle dark, desaturated outline mask (`rgba(0, 0, 0, 0.4)` black tint at 12px blur) to improve contrast.

---

## 7 Borders

Containers are visually defined by structured border rules:

*   **Border Stroke Weight**: `1px` (standard borders), `2px` (focus borders).
*   **Border Style**: `solid` (all layout structures), `dashed` (empty state targets or connection drop zones).
*   **Border Colors**:
    *   Muted State: `Slate Accent` (`#334155`) for Dark Mode; `Bone Accent` (`#E2E8F0`) for Light Mode.
    *   Focus State: `Teal Accent` (`#0EA5E9`).
    *   Alert/Error State: `Red` (`#EF4444`).

---

## 8 Icons

*   **Visual Style**: 1.5px stroke weight, monoline, sharp vertices, open paths.
*   **Sizing Boundary**:
    *   Small: `16px x 16px` (within text lines or buttons).
    *   Standard: `24px x 24px` (navigation bars, list items, section triggers).
    *   Large: `32px x 32px` (diagnostic indicators, empty states).
*   **Padding**: Icons must occupy a square bounding box with uniform internal padding to ensure optical alignment.

---

## 9 Buttons

Buttons use high geometric constraint and absolute clarity.

*   **Primary Button**:
    *   *Theme*: Solid `#F8FAFC` (Dark Mode); `#0F172A` (Light Mode).
    *   *Typography*: `Inter` SemiBold.
    *   *Action*: Triggers primary page action.
*   **Secondary Button**:
    *   *Theme*: Transparent fill, `1px solid Slate Accent` outline, default text color.
    *   *Action*: Secondary configuration, non-destructive tools.
*   **Subtle / Destructive Button**:
    *   *Theme*: Transparent background. Underlined text or red text (`#EF4444`) to warn of dangerous actions (e.g., purging device buffers).
*   **Button States**:
    *   *Hover/Active*: Muted opacity scale transition (80% opacity on active press).
    *   *Focus*: `2px solid Teal Accent` wrapper offset by 2px.

---

## 10 Inputs

Inputs are highly functional and devoid of decorative transitions.

*   **Text/Textarea Input**:
    *   *Background*: Muted slate surface.
    *   *Border*: `1px solid Slate Accent`.
    *   *Focus State*: Border changes to `1px solid Teal Accent` with zero shadow.
*   **Capture Switch (Hardware Toggle Emulation)**:
    *   *Visual*: Flat rectangular toggle. Toggle switch shifts position along a linear grid track.
    *   *Colors*: Teal for active sync tracking; Slate Accent for dormant state.

---

## 11 Cards

Cards group related items together (e.g., transcripts, diagnostic logs).

*   **Structure**: Flat layout sitting on `Slate Primary` base.
*   **Attributes**:
    *   Background: `Slate Secondary`
    *   Border: `1px solid Slate Accent`
    *   Corner Radius: `radius-medium` (4px)
    *   Padding: `space-4` (16px) uniform padding.

---

## 12 Lists

Lists present chronological collections of data (e.g., transcripts, connected devices).

*   **Structure**: Frameless flat stacking. Divider lines between list items use `1px solid Slate Accent`.
*   **Timeline Item**:
    *   Presents transcript snippets, timestamped metadata, and telemetry tags.
    *   Uses absolute alignment: Time (monospace, right-aligned or metadata stack) and transcript text (sans-serif, left-aligned).

---

## 13 Navigation

Navigation is sparse, quiet, and utility-driven.

*   **Layout**: Top Header and Bottom Utility Bar.
*   **Properties**:
    *   Background: Transparent or matching the `Slate Primary` color, with a thin bottom divider (`1px solid Slate Accent`).
    *   Controls: Icon triggers with explicit labels. Highlight active pages using a simple underline or desaturated teal accent.

---

## 14 Sheets

Sheets slide up from the bottom of the screen to reveal hardware settings or filter options.

*   **Structure**: Anchor to screen bottom, covering full width.
*   **Attributes**:
    *   Background: `Slate Secondary`
    *   Border: `1px solid Slate Accent` on the top boundary.
    *   Corner Radius: `4px` top-left and top-right corners; `0px` bottom corners.

---

## 15 Dialogs

Modal windows for critical, destructive actions (e.g., data purging, factory reset).

*   **Structure**: Centered panel with a dark screen overlay (`rgba(0, 0, 0, 0.6)`).
*   **Attributes**:
    *   Background: `Slate Secondary`
    *   Border: `2px solid Slate Accent` (or `Red` for destructive alerts).
    *   Buttons: Standard stack placing confirmation on top or right; cancellation on bottom or left.

---

## 16 Feedback Components

*   **Sync Banner**: A persistent bar indicating live data sync. Uses a pulsing Teal indicator matching the physical device's blue LED frequency.
*   **Error Banner**: Solid Red outline, providing diagnostic info in monospace layout alongside a clear resolution action.
*   **Connection Status Indicator**: A small circular indicator indicating BLE sync status (flashing orange during pairing; steady teal when connected; gray when offline).

---

## 17 Motion Tokens

Following the Visual Identity rules of **Mathematical Easing**:

*   **`duration-fast`**: `120ms` (hover state updates, button active presses).
*   **`duration-standard`**: `200ms` (dialog transitions, sheets sliding up).
*   **`easing-standard`**: `cubic-bezier(0.16, 1, 0.3, 1)` (linear-out-slow-in, rapid entry, clean deceleration).
*   **`pulse-sync`**: `2000ms` period, sinusoidal progression (10% to 100% opacity) mimicking the physical recording cycle.

---

## 18 Accessibility Tokens

*   **Contrast Ratio**: Base text-to-background contrast ratio must be minimum `4.5:1` (WCAG AA) for standard text and `7:1` (WCAG AAA) for transcripts.
*   **Touch Targets**: Interactive controls must maintain a minimum bounding box of `48px x 48px` on mobile displays.
*   **Screen Scale Boundaries**: Maximum text line widths constrained to `60-70 characters` (approx. 560px max width) for reading comfort.

---

## 19 Responsive Rules

Vaha scales layout columns based on viewport boundaries:

*   **Compact (Mobile: < 600px)**: Single column layouts, fullscreen dialogs, full-width bottom sheets, and minimal top/bottom navigation bars.
*   **Medium (Tablet/Web: 600px to 1024px)**: Split column layouts (left panel for timeline navigation, right panel for note transcripts and telemetry logs).
*   **Grid Padding Scale**: Screen outer padding scales from `16px` on Compact screens to `24px` on Medium layouts.

---

## 20 Component Principles

*   **No Decorative Blobs**: Every layout element, container boundary, or background shade must represent physical boundaries or real data groupings.
*   **Flat Over Depth**: Muted visual borders take precedence over shadow gradients to indicate grouping.
*   **Strict Monospace Partitioning**: Never mix typefaces within a single label block. Raw data and timestamps must strictly utilize monospace fonts, while human-written and transcribed thoughts must utilize sans-serif layouts.
*   **State Mirroring**: All state transitions on the screen must reflect the status of the local hardware. If the hardware is buffering or offline, the interface must explicitly state it without trying to hide or beautify connection lapses.
