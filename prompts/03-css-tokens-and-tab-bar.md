# 03 · All tokens in global.css + reference-accurate tab bar

Status: done

## Goal
Every design token (colors as hex, font families, font sizes, line heights, spacing, sizes, radii, opacity, border widths) is a CSS variable in `global.css`. `tailwind.config.js` only maps class names to those variables. The section 10 tab bar in `/design-system` looks like the reference: a frosted pill with a periwinkle haze, a white glossy rim, and a glowing yellow active circle with a filled icon.

## Decisions
- Proven offline: NativeWind compiles `var(--x)` in colors, fontFamily, fontSize + lineHeight, spacing (padding, gap, height), and borderRadius to runtime lookups of `:root` values. A test stylesheet run through `react-native-css-interop`'s `cssToReactNativeRuntime` showed hex, font names and px values all resolving.
- Colors are hex (`#FFC629`), except `glass`, which is `rgba(255,255,255,0.7)` per the reference. Nothing uses slash-opacity classes (`bg-x/50`), so hex vars are safe.
- `tailwind.config.js` **replaces** the theme's colors, fontFamily, fontSize, spacing, borderRadius, opacity and borderWidth with var-backed maps. Only Roam tokens exist, and no raw values live there.
- Spacing keys are the ones `src/` uses (0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 9, 10, 12, 14, 16, 20, 28, 36, 40), plus `px`, `gutter` and two tab-bar sizes. `full` stays a built-in percentage.
- Exceptions that stay in TypeScript, because React Native needs them as JS values: `src/theme/shadows.ts` (`boxShadow` strings; NativeWind can't map multi-layer shadows) and `src/theme/motion.ts` (Reanimated durations). Icon pixel sizes stay as component props.
- Tab bar haze and glow use `react-native-svg` radial gradients (already installed; identical on iOS, Android and Expo Go). Gradient stop colors come from token classes via `cssInterop`, so there's no hex in components. `BlurView` stays as the bottom layer to blur app content behind the bar.

## Out of scope
- Tab navigation and screens (still component + preview only).
- Dark palette.

## Tokens (`global.css` `:root`)
- **Colors:**
  - primary `#FFC629`, primary-soft `#FFF5D6`
  - lavender `#C9B4FF`, lavender-soft `#F3EEFF`, lavender-muted `#E6DCFF`, lavender-strong `#7C5CFF`
  - ink `#0B0B1A`, ink-secondary `#6B7280`
  - surface `#FFFFFF`, surface-muted `#F4F5F7`, border `#E5E7EB`
  - glass `rgba(255,255,255,0.7)`
  - success `#1E8E3E` / `#E7F5EC`, danger `#E5383B` / `#FDECEE`, info `#3B5BDB` / `#E8EEFF`
  - **new:** glass-haze `#C6D0EB` and glass-haze-light `#DCE3F6`, sampled from the reference bar.
- **Fonts:** `--font-sans` … `--font-sans-extrabold` hold the five Plus Jakarta family names.
- **Type:** size + line height pairs for display 56/56, heading 28/34, title 20/24, subtitle 16/22, body 16/24, button 17/22, caption 14/20, small 13/18.
- **Spacing:** `--space-<key>` for the keys above (4px grid), `--space-gutter` 20px, `--size-tab-bar` 80px, `--size-tab-active` 72px.
- **Radii:** none 0, sm 8, md 12, lg 16, xl 20, 2xl 24, full 9999.
- **Opacity:** 40 (disabled), 60 (icon press), 85 (press).
- **Border width:** default 1px, 2px.

## Tab bar design (reference section 10, sampled from the image)
- **Pill:** h `size-tab-bar` (80), `rounded-full`, 2px white rim (`border-2 border-surface`), `shadows.raised`.
- **Layers, bottom to top:**
  1. `BlurView` (intensity 40, light).
  2. `bg-glass`.
  3. SVG haze: 3 soft radial blobs in glass-haze / glass-haze-light fading to transparent, spread across the pill.
  4. Items.
- **Active item:** a 72px `bg-primary` circle with an SVG radial glow in primary (≈1.6× the circle, fading out) behind it. The icon is filled ink (`fillClassName="text-ink"`) and the label is `small` medium ink.
- **Inactive items:** outline ink icon + `small` medium ink label.
- **Preview:** section 10 shows the bar directly on the white panel, matching the reference. The colored test strip is removed.

## Steps
### 1. Tokens to global.css
Rewrite `global.css` `:root` with every token above and rewrite `tailwind.config.js` to var-only maps. No component changes. Done when tsc and lint pass and a compile check shows every class used in `src/` resolves (no unknown classes).

### 2. Tab bar redesign
Update `src/components/ui/tab-bar.tsx` with the haze, glow and filled active icon. Remove the colored strip from section 10 in `src/app/design-system.tsx`. Done when tsc and lint pass.

## Verification
1. `npx tsc --noEmit` and `npx expo lint` pass.
2. Compile check: every className token in `src/` compiles through NativeWind to a style. Zero raw hex/px values remain in `tailwind.config.js`.
3. Drift greps over `src/` (no hex, arbitrary classes, `Touchable*` or legacy shadows) stay empty.
4. `npx expo export --platform ios` builds.
5. User check in Expo Go: every screen looks unchanged except section 10, which matches the reference (frosted periwinkle pill, glowing yellow Home circle with filled icon, tap to switch).

## AGENTS.md updates
In **Design system**, replace the first two bullets with:
- "All tokens are CSS variables in `global.css` `:root`: hex colors, font families, sizes and line heights, spacing, sizes, radii, opacity and border widths. `tailwind.config.js` only maps class names to `var(--…)`. Change values in `global.css`."
- "Only `src/theme/shadows.ts` (boxShadow strings) and `src/theme/motion.ts` (durations) hold tokens in TS, because RN needs JS values."

## Result
Built as planned.
- `global.css` holds 69 root variables. `tailwind.config.js` contains no raw hex or px values.
- A compile check through NativeWind's converter showed every class used in `src/` (106 of the 107 tokens found; the extra token is the `./text` import path) resolves to a `var(--…)` lookup.
- The tab bar now layers BlurView, glass tint, SVG periwinkle haze (stop colors via `cssInterop` on `Stop`), and a glowing yellow active circle with a filled icon. The colored test strip is gone.
- tsc, lint, the drift greps and the iOS bundle export pass. A static mock of the bar's layers matched the reference's haze and glow. The on-device visual check is left to the user.

**Fix after device check:** the haze and glow rendered as black blobs on the device, because `cssInterop` on react-native-svg's `Stop` didn't deliver `stopColor`, and an uncolored stop renders black. The stop colors are now read from the `global.css` variables with `useUnstableNativeVariable` (which returns the light-scheme string), and the haze and glow skip rendering if a color doesn't resolve.
