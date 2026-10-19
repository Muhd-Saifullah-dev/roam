# 02 · Glass tab bar (design system section 10)

Status: done

## Goal
A reusable `TabBar` component that matches section 10 of the design reference (a floating liquid-glass pill with a yellow active circle), shown working in `/design-system` section 10. It is not wired into navigation yet.

## Decisions
- Scope: component + preview only (user's choice). No tab routes, no changes to `_layout.tsx` navigation.
- Glass: `expo-blur` `BlurView` (user's choice, new dependency, included in Expo Go), with the `glass` token (`rgba(255,255,255,0.7)`) layered on top.
- Android blur needs a `BlurTargetView`. `TabBar` takes an optional `blurTarget` ref and passes it to `BlurView` with `blurMethod="dimezisBlurViewSdk31Plus"`. Without a target, Android shows the translucent glass tint only. Real tab navigation (later) will wrap screens in a `BlurTargetView`.
- Controlled API, not tied to Expo Router: `items: {key, label, icon}[]`, `value`, `onChange`. A later navigation plan adapts Router's tab bar props to it.
- Rounded corners use `overflow-hidden` + `rounded-full`, because BlurView ignores `borderRadius` alone (per SDK 57 docs).
- Tokens only. No hex values, no arbitrary classes. The shadow comes from `shadows.raised` in `src/theme/shadows.ts`.

## Out of scope
- Tab routes and screens, safe-area placement over a real screen, hide-on-scroll, badges on tabs.

## Design (reference section 10, values marked * are estimated)
- **Bar:** full-width pill, height 80 *, `rounded-full`, padding 2 (8px) *, glass background (blur intensity 40 * + `bg-glass`), 1px `border-surface` (white rim) *, `shadows.raised`.
- **Items:** 4 equal-width, each a vertical stack of a 24px icon above a `small` label, both `ink`. Home (House), Search (Search), Trips (Calendar), Profile (User).
- **Active item:** a 64 * `bg-primary` circle behind the active item's icon and label, same ink color. Inactive items have no background.
- **Press feedback:** `active:opacity-85`. Each item has `accessibilityRole="tab"` with `accessibilityState.selected`, and the bar has `accessibilityRole="tablist"`.
- **Motion:** the selection switches instantly (a sliding indicator is left out, keeping it simple).

## Steps
### 1. Dependency
`npx expo install expo-blur`. Done when it's in `package.json`.

### 2. `TabBar` component
`src/components/ui/tab-bar.tsx` as specified above, exported from `index.ts` with its types. Done when tsc and lint pass.

### 3. Preview
In `src/app/design-system.tsx`, add a "10. Bottom navigation" section between 09 and 11. Behind the bar, show a strip of content (the section's own colored swatch row) so the glass is visible. Local state switches the active tab. Remove the "Section 10 is intentionally not built yet" comment. Done when tsc and lint pass.

## Verification
1. `npx tsc --noEmit` and `npx expo lint` pass.
2. Drift greps over `src/` (no hex values, arbitrary classes, `Touchable*` or legacy shadows) stay empty.
3. `npx expo export --platform ios` builds.
4. User check in Expo Go: section 10 shows the glass pill with Home active in a yellow circle. Tapping Search, Trips or Profile moves the circle. On iOS the content behind is blurred. On Android, the tint shows without blur.

## AGENTS.md updates
In **Design system**, add `TabBar` to the component list and replace "The glass tab bar (reference section 10) isn't built yet." with: "`TabBar` (`src/components/ui/tab-bar.tsx`) is the glass bottom nav. Android blur needs a `BlurTargetView` passed as `blurTarget`. It is not wired to navigation yet."

## Result
Built as planned. `TabBar` is in `src/components/ui/tab-bar.tsx`: an outer view carries `shadows.raised` and an inner `overflow-hidden` pill clips the BlurView. Section 10 in `/design-system` shows it over a colored strip with working tab switching. tsc, lint, the drift greps and the iOS bundle export pass. Visual check in Expo Go is left to the user.
