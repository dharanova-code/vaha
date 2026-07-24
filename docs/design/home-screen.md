# Home Screen Integration (Milestone 6B.1)

This document describes the design composition, data flow, and architecture of the production-ready Muji Minimal Home Screen integrated into the VAHA mobile companion app.

## Component Composition
The Home Screen is constructed entirely using modular components from the central Design System (`src/design-system/`). No inline/duplicate UI widgets were built:

1. **Welcoming Header:** EB Garamond greeting using `Text` typography variant (`display-lg`), coupled with a body copy serif prompt.
2. **Device Status Banner:** Visual companion status combining `DeviceCard` and `SensorCard` telemetry modules.
3. **Continuing Anchor:** Focus card using the outline `Card` variant with a natural background layout (`#F5F2EC`) and `Tag` components to anchor the user's last unfinished capture.
4. **Quick Actions:** Layout container grid displaying `Button` triggers mapped to app routes.
5. **Daily Insights Preview:** Stoic blockquote constructed with `InsightCard` featuring a copper accent bar indicator.
6. **Recent Timeline:** Monoline list detailing recently completed entries using the `ListItem` primitive separated by subtle dividers.

## Mock Data Structure
Statically typed mock data is stored inside `src/features/home/mock/` to decouple presentation logic:
- `todaySummary.ts`: Welcome headers and prompt strings.
- `quickActions.ts`: Interactive routing and accessibility properties.
- `deviceStatus.ts`: Battery, connection state, and BLE signal strength (dBm).
- `recentCaptures.ts`: Chronological list of completed captures, plus the continuing anchor info.

## Design Alignment Constraints
- **Color Mappings:** Background is locked to Warm Paper (`#FAF8F5`). Borders map to Border Stone (`#E2DFD9`), and elements stack along the 24px column margin thread.
- **Accessibility:** Touch targets exceed 44dp, using custom `accessibilityRole` and `accessibilityLabel` properties.
