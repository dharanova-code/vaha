# Navigation & Routing Architecture

This document describes the routing hierarchy, layout responsibilities, deep linking, and navigation guard configuration in the Vaha companion mobile application.

---

## 1. Route Hierarchy

Vaha uses **Expo Router** to manage file-system based routing and layouts. The folder structure maps directly to the active screen inventory:

```text
app/
├── _layout.tsx              # Root Layout (composition of global providers & bootstrap loader)
├── index.tsx                # Entry redirect pointing to (tabs)/home
├── (tabs)/                  # Main Tab Bar navigation shell
│   ├── _layout.tsx          # Tab bar styling configuration
│   ├── home/
│   │   └── index.tsx        # Home timeline & suggested actions screen
│   ├── captures/
│   │   └── index.tsx        # Library (All captures, folders, search)
│   ├── insights/
│   │   └── index.tsx        # Reflection prompts and trend summaries
│   ├── device/
│   │   └── index.tsx        # Connection status, battery, diagnostics
│   └── settings/
│       └── index.tsx        # General settings root
├── (modals)/                # Global screen presentation overlays
│   ├── _layout.tsx          # Modal stack styling options
│   └── capture-details.tsx  # Capture details overlay
├── settings/                # Detailed settings stacks
│   └── _layout.tsx          # Nested settings route navigator
├── 404.tsx                  # Custom 404 Screen
└── +not-found.tsx           # Standard Expo Router 404 routing mapping
```

---

## 2. Layout Responsibilities & Provider Order

The Root Layout (`app/_layout.tsx`) serves as the application's central bootstrap and composition node. It composes providers in the following strict order:

```text
GestureHandlerRootView (React Native Gesture Handler)
└── SafeAreaProvider (React Native Safe Area Context)
    └── StatusBar (Expo Status Bar)
        └── Slot (Expo Router Navigation Engine)
```

### State Loading Lifecycle
1.  **Mount:** Triggers `ApplicationBootstrap.getInstance().run()`.
2.  **Initializing:** Displays a custom loading screen placeholder matching design styling.
3.  **Bootstrap Failure:** Displays a startup failure screen detailing errors to prevent rendering in a corrupted state.
4.  **Ready:** Removes the loading wrapper and mounts the primary routing slot.

---

## 3. Deep Linking Configuration

Deep linking maps external URLs and custom URI schemes to internal screens. It is defined in `src/core/navigation/DeepLinkingConfig.ts`:

*   **Schemes:** `vaha://` and `https://*.vaha.io`
*   **Path Mappings:**
    *   `/home` $\rightarrow$ `(tabs)/home/index`
    *   `/captures` $\rightarrow$ `(tabs)/captures/index`
    *   `/insights` $\rightarrow$ `(tabs)/insights/index`
    *   `/device` $\rightarrow$ `(tabs)/device/index`
    *   `/settings` $\rightarrow$ `(tabs)/settings/index`
    *   `/capture/:id` $\rightarrow$ `(modals)/capture-details`

---

## 4. Navigation Guards

Future transition authorization rules (such as ensuring a paired hardware device or authenticated profile before rendering details) are abstracted via the `NavigationGuard` interface defined in `src/core/navigation/NavigationGuard.ts`. Currently, `AuthGuardPlaceholder` evaluates all transitions as allowed.
