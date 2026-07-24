# VAHA Branding Assets

Version: 1.0.0  
Status: Production  
Last Updated: 2026-07-20

---

## Overview

VAHA's branding uses **Direction 2: The Reflective Basin** from the approved [APP_ICON_SYSTEM.md](../../design/brand/APP_ICON_SYSTEM.md).

The symbol is a D-shaped basin vessel (forest green) containing a floating copper dot — representing a single captured thought held in stillness and privacy.

---

## Color Palette

| Role | Name | Hex |
|---|---|---|
| Background | Warm Paper | `#FAF8F5` |
| Primary | Deep Forest Green | `#1B3629` |
| Accent | Muted Copper | `#C07D53` |
| Secondary | Muted Stone | `#7A7265` |
| Dark Background | Charcoal Slate | `#0F172A` |
| Dark Accent | Light Copper | `#D9A07E` |

### Rules

- **No gradients** — all fills are flat
- **No shadows** — surfaces are matte
- **No transparency effects** — colors are fully opaque

---

## Asset Inventory

### Production Assets (`assets/`)

| File | Size | Purpose |
|---|---|---|
| `icon.png` | 1024×1024 | iOS app icon, Android fallback icon |
| `adaptive-icon.png` | 1024×1024 | Android adaptive icon foreground layer |
| `splash.png` | 1284×2778 | Expo splash screen (all platforms) |
| `favicon.png` | 48×48 | Web browser favicon |
| `notification-icon.png` | 96×96 | Android push notification icon |

### SVG Sources (`assets/branding/`)

| File | Purpose |
|---|---|
| `app-icon-source.svg` | Master app icon (1024×1024 viewBox) |
| `adaptive-icon-source.svg` | Android adaptive icon foreground (1024×1024) |
| `splash-source.svg` | Splash screen layout (1284×2778 viewBox) |
| `favicon-source.svg` | Favicon (48×48 viewBox) |
| `notification-icon-source.svg` | Notification icon, white on transparent (96×96) |
| `logo.svg` | Neutral logo mark (light theme) |
| `logo-light.svg` | Light theme logo |
| `logo-dark.svg` | Dark theme logo (bone on slate) |

---

## Regenerating Assets

All PNG assets are generated from parametric SVG via `generate-assets.js`.

```bash
# From app/mobile/
node generate-assets.js
```

**Dependencies:** `sharp` (already installed as devDependency)

---

## Icon Design

### The Reflective Basin

```
         ╭─────────────────╮
        ╱                   ╲
       ╱        ●            ╲
      │       (copper)        │
      └─────────────────────-─┘
```

- **Arc**: Semicircular, monoline, Forest Green `#1B3629`, stroke-width ~3.5% of canvas
- **Walls**: Vertical stems closing the D-shape
- **Base**: Horizontal line — the ground of the vessel
- **Dot**: Positioned at the **geometric centroid** of the semicircle (`4R/3π` above the diameter)

### Geometry Constraints

- Basin radius: 29% of canvas size
- Stroke width: 3.5% of canvas size (min 2px)
- Dot radius: 5.2% of canvas size
- The mark occupies the center 58% of the canvas vertically (leaving padding top and bottom)

---

## Expo Configuration

```json
{
  "icon": "./assets/icon.png",
  "splash": {
    "image": "./assets/splash.png",
    "resizeMode": "contain",
    "backgroundColor": "#FAF8F5"
  },
  "android": {
    "adaptiveIcon": {
      "foregroundImage": "./assets/adaptive-icon.png",
      "backgroundColor": "#FAF8F5"
    },
    "notification": {
      "icon": "./assets/notification-icon.png",
      "color": "#1B3629"
    }
  },
  "web": {
    "favicon": "./assets/favicon.png",
    "backgroundColor": "#FAF8F5"
  }
}
```

---

## Export Rules

### iOS App Icon

- **Format**: PNG, no alpha channel
- **Size**: 1024×1024px minimum
- **Background**: Warm Paper `#FAF8F5` (solid, no transparency)

### Android Adaptive Icon

- **Foreground**: PNG with the mark centered in the safe zone (72dp safe area out of 108dp canvas)
- **Background**: Set to `#FAF8F5` in `app.json` (not baked into PNG)
- The mark must be entirely within the inner 66% of the canvas to survive icon masking

### Splash Screen

- **Expo resizeMode**: `contain` — the splash image is centered and letterboxed on `#FAF8F5`
- **Recommended size**: 1284×2778 (covers all iOS/Android screen sizes safely)
- The mark + wordmark must be centered within the safe zone of the image

### Notification Icon (Android)

- **Format**: PNG with transparency
- **Color**: White (`#FFFFFF`) foreground on transparent background
- **Size**: 96×96px
- **Rule**: Android ignores color data on notification icons — only alpha channel is used

### Favicon

- **Format**: PNG
- **Size**: 48×48px (will be scaled by browser as needed)

---

## Typography in Assets

The "VAHA" wordmark on the splash screen uses:

- **Font**: Georgia (serif) — matches the classical stone-carved character of the brand
- **Case**: UPPERCASE only
- **Weight**: 400 (Regular)
- **Letter-spacing**: Generous (+12% of font size)
- **Color**: Deep Forest Green `#1B3629`

---

## Brand Restrictions

Do NOT:

- Add gradients or drop shadows
- Use the icon on dark backgrounds without switching to the dark variant (`logo-dark.svg`)
- Add rounded corners or container shapes to the icon (Expo and OS handle masking)
- Include text in the app icon PNG
- Use the copper dot without the basin vessel surrounding it
- Add AI sparkles, microphones, brain waves, or speech bubbles

---

## Changelog

| Version | Date | Change |
|---|---|---|
| 1.0.0 | 2026-07-20 | Initial production assets generated for Expo SDK 54 |
