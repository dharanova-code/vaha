# Engineering Rules

## 1. General Constraints
*   **Never** redesign approved layout screens or branding specifications.
*   **Never** modify approved user interfaces or change navigation hierarchies.
*   **Never** break modular feature-first architecture boundaries.
*   **Always** compile typescript (`npm run ts:check`) before commits.
*   **Always** verify code style formatting (`npm run lint`) before commits.
*   **Always** run unit tests (`npm run test`) before commits.
*   Every library package dependency added must be consumed immediately.
*   No temporary coding hacks or unvalidated APIs.
*   No `TODO` comments without a GitHub issue reference.

## 2. Abstraction Boundaries
*   **Interfaces over concrete classes:** Ensure infrastructure components are injected via factory interfaces.
*   **Repositories own data access:** UI layers must never call local storage or SQLite databases directly.
*   **Services own business logic:** Keeps components focused on presentation tasks.

## 3. UI Token Optimization
*   **Background:** Always map to `var(--color-bg)` or `theme.colors.background` (`#FAF8F5`). Never use `#FFFFFF` or `#FFF`.
*   **Primary Text:** Always map to `var(--color-primary)` or `theme.colors.primary` (`#1B3629`).
*   **Secondary Text:** Always map to `var(--color-secondary)` or `theme.colors.secondary` (`#7A7265`).
*   **Accent:** Always map to `var(--color-accent)` or `theme.colors.accent` (`#C07D53`).
*   **Margin Thread:** Always render as `left: 24px` with a width of `0.5px` and color `rgba(122, 114, 101, 0.15)`.
*   **Paddings/Margins:** Limit variables strictly to:
    *   `space-1`: 4px
    *   `space-2`: 8px
    *   `space-3`: 12px
    *   `space-4`: 16px
    *   `space-6`: 24px
    *   `space-8`: 32px
*   **Serif (EB Garamond):** Restrict usage to class names containing `title`, `greeting`, `quote`, `reflection-prompt`.
*   **Sans-Serif (Inter):** Map as default body copy and UI controls.
