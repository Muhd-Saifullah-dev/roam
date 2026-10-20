# 09 · Premium floating tab bar (iOS and Android)

Status: done

## Goal
Both platforms get the same premium tab bar: a rounded, frosted pill floating above the content. The active tab is a dark ink pill showing a white icon and label, and it slides to whichever tab the guest taps. This replaces the system NativeTabs bar.

## Decisions
- **Custom tabs instead of NativeTabs** *(user choice: "rounded premium look", ink pill)*. `src/app/(tabs)/_layout.tsx` uses headless `Tabs` / `TabSlot` / `TabList` / `TabTrigger` from `expo-router/ui` (SDK 57). The routes and URLs (`/home`, `/search`, `/trips`, `/profile`) and Home's `/search?q=` flow stay the same.
- **Wiring:**
  - A hidden `TabList` (`display: none`) declares the four `TabTrigger`s (name + href).
  - The visible bar is the shared `TabBar` component, kept controlled (`items`, `value`, `onChange`).
  - The layout passes it the active key from `usePathname()`, and `onChange` calls `router.navigate("/<key>")`.
- **Look (`TabBar`, rewritten):**
  - **Bar:** `rounded-full` with a 2px white rim (`border-surface`) and `shadows.raised`. It sits `gutter` from the screen edges, 8pt above the bottom safe-area inset (at least 16pt from the bottom edge).
  - **Glass:** a `BlurView` (intensity 40, light) under the `bg-glass` tint, as today. On Android the blur reads a `BlurTargetView` that wraps the `TabSlot`; if it doesn't resolve, the tint alone shows.
  - **Height:** `--size-tab-bar` changes from 80 to 64. Inner padding is 2 (8pt), and four equal slots fill the width.
  - **Inactive tab:** a 24pt Lucide icon (`House`, `Search`, `CalendarDays`, `User`) in `ink-secondary`, with no label.
  - **Active tab:**
    - A 48pt-tall (`--size-tab-pill`, new) `bg-ink` pill, centered on its slot.
    - Inside: the icon in `surface` (white) and the label in `small` semibold inverse, in a row with gap 1.5 and horizontal padding 4.
    - The pill may overhang its slot slightly. Neighbors are icon-only, so there's room ("Profile" is about 95pt wide in an 84pt slot).
  - `--size-tab-active` (72, used only by the old bar) is removed.
- **Motion** (expo-animation skill, "Tab / segmented indicator" recipe; purpose: spatial consistency):
  - The pill is an absolutely positioned view with no children. `translateX` and `width` animate together with `withTiming` over 250ms (`motion.base`) with ease-in-out `Easing.bezier(0.77, 0, 0.175, 1)`.
  - Widths come from `onLayout` on each tab's content (measured, not per frame). Animating `width` is the sanctioned exception here, since it keeps the round ends that `scaleX` would smear.
  - Screens themselves don't animate on a tab switch.
  - Press feedback is the 0.97 scale already used elsewhere.
  - With reduced motion, the pill jumps (no slide).
  - No haptics: `expo-haptics` isn't installed. Adding it is a separate ask.
- **Safe areas:** `TabScreen` stops relying on NativeTabs. It uses `contentInsetAdjustmentBehavior="never"` and pads on both platforms itself: top = `insets.top`, bottom = `insets.bottom` + bar height + 32. The pad comes from a `useTabBarInset()` hook exported next to the bar, so content always clears the floating bar.
- **Keyboard:** on Android the bar hides while the keyboard is open, using `Keyboard` show/hide listeners; otherwise it would ride up above the keyboard on Search. On iOS the keyboard simply covers it.
- **Accessibility:** the bar is a `tablist`; each item is a `tab` with `selected` state and its label as the accessibility label, even when the label isn't shown. Touch targets are the full 84×64 slots.

## Out of scope
- Scroll to top on re-tapping the active tab (NativeTabs did this for free). Possible later.
- iOS 26 Liquid Glass. A custom bar can't use the system material.
- Haptics, badges and dark mode.

## Steps
### 1. Tokens and `TabBar`
- `global.css` / `tailwind.config.js`: `--size-tab-bar` becomes 64px; add `--size-tab-pill` 48px; remove `--size-tab-active`.
- Rewrite `src/components/ui/tab-bar.tsx`: glass bar, measured sliding ink pill, `PressableScale` items. Export `TAB_BAR_GAP` and `useTabBarInset()`.
- Section 10 of `/design-system` keeps previewing it.
- Done when tsc and lint pass.

### 2. Custom tabs layout
- Rewrite `src/app/(tabs)/_layout.tsx` with `expo-router/ui`: `Tabs` > `BlurTargetView` (Android) > `TabSlot`, the hidden `TabList`, and the floating `TabBar` (absolute, hidden on Android while the keyboard is open).
- Update `src/components/layout/tab-screen.tsx` to the manual insets.
- Done when tsc and lint pass, the typed routes regenerate, and the iOS bundle export builds.

### 3. Close out
- Update AGENTS.md: replace the NativeTabs bullet and the `TabBar` bullet.
- Write the plan's Result.

## Verification
1. `npx tsc --noEmit` and `npx expo lint` pass.
2. Drift greps (hex, px, arbitrary classes) stay empty.
3. `npx expo export --platform ios` bundles.
4. User check in Expo Go, on iOS and on Android:
   - The bar floats as a frosted rounded pill.
   - The ink pill slides between tabs and resizes to fit each label.
   - Home's search still opens Search with results.
   - The last card and the Profile button clear the bar.
   - On Android, the bar hides while typing on Search.
   - With Reduce Motion on, the pill jumps instead of sliding.

## AGENTS.md updates
- **Expo / routes:** replace the NativeTabs bullet. Signed-in tabs now use `expo-router/ui` headless tabs with the shared floating `TabBar`; the layout maps `usePathname()` to the active tab and switches with `router.navigate`; `TabScreen` pads for the bar with `useTabBarInset()`; on Android the bar hides with the keyboard.
- **Design system:** replace the `TabBar` bullet. It's now a frosted rounded pill with a measured, sliding ink pill (white icon + label) on the active tab and muted icon-only inactive tabs, and it is the app's nav.

## Result
Built as planned, with these changes:
- **Pill geometry:** the pill and the tabs sit in their own unpadded, borderless row inside the glass. In Yoga, absolute children are placed from inside the border while `onLayout` x is measured from outside it, so sharing the bar's padded view would have put the pill 2pt off.
- **Bar inset:** `useTabBarInset()` reads a context that the layout fills by measuring the whole bar wrapper (bar + gap + safe area). No size is hardcoded in TS. `TabScreen` adds it as a spacer at the end and as the scroll indicator inset.
- **Content fade:** the active tab's icon and label fade in (250ms) as the pill slides, so the white icon never shows on bare glass.

Checks: tsc, lint, drift greps, and the iOS and Android bundle exports all pass. The on-device look and motion are left to the user.
