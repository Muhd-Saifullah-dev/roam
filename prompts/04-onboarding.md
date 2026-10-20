# 04 · Onboarding

Status: done

## Goal
On launch, guests see a three-slide onboarding carousel that matches the onboarding design. "Get started" moves through the slides and opens a placeholder sign-up screen from the last one. "Skip" and "Continue with Google" open sign-up from any slide.

## Decisions
- **Three swipeable slides** (user choice). They share one layout and differ only in photo, location chip, headline and body. Slide 1 copy comes from the design. Slides 2–3 copy is written here (below).
- **Sign-up is a placeholder** (user choice): `src/app/sign-up.tsx` shows a native back button and the title "Create your account". The real screen (from `assets/prompt-imgs/auth.png`) and Clerk come in a later feature.
- **Skip and Continue with Google both `router.push("/sign-up")`** (user choice). Google OAuth isn't wired.
- **Google logo:** Google's official 4-color "G" saved as `assets/images/google-g.svg` and drawn with `expo-image` (renders SVG on iOS and Android, and SVG is in Metro's default `assetExts`). Its brand hex colors stay in the asset, not in TS. Lucide 1.59 has no Google icon.
- **Onboarding is the `index` route.** It replaces the current launch screen, which only linked to `/design-system`. `/design-system` stays reachable via `roam:///design-system`.
- **No "seen onboarding" persistence.** That would need AsyncStorage (a new dependency). It shows on every launch until auth exists.
- **Photos from Unsplash** (remote, via `expo-image`, `?w=1080&q=80`; all three verified to return 200):
  1. `https://images.unsplash.com/photo-1542718610-a1d656d1884c`: cabin at sunset over a valley
  2. `https://images.unsplash.com/photo-1499793983690-e29da59ef1c2`: thatched beach bungalow
  3. `https://images.unsplash.com/photo-1510798831971-661eb04b3739`: snowy lakeside lodge
- **Everything on a slide swipes together**: photo, location chip, sheet, indicator, text and buttons. Only the header (wordmark and Skip) stays fixed. Each slide's indicator shows its own index, so no shared scroll state is needed.
- **Pager:** horizontal `FlatList` with `pagingEnabled` and `getItemLayout` sized to the window width. "Get started" calls `scrollToIndex(i + 1)`, and on the last slide it pushes `/sign-up`. "Get started" keeps the same label on every slide.
- **Button color** uses the existing `primary` (`#FFC629`). The design's button reads slightly more orange; the design system's primary wins.
- **Blur:** pills use `BlurView` on iOS and only the tint on Android (`blurMethod="none"`, same reasoning as `TabBar`).
- **Status bar** is dark (`expo-status-bar` `style="dark"`), matching the design's dark time and icons over the light sky.

### Slide copy
| # | Chip | Headline | Body |
|---|------|----------|------|
| 1 | Whistler, BC | Find a stay that fits your story | From mountain cabins to oceanfront villas, roam helps you find unforgettable stays for every kind of trip. |
| 2 | Tulum, Mexico | Describe it in one sentence | Type something like "quiet beach bungalow under $300 a night" and roam ranks the stays that fit. |
| 3 | Emerald Lake, BC | Ask anything about a stay | Check-in times, pets, cancellations. Get answers straight from the stay's own rules and policies. |

## Design (from the attached onboarding image, 393pt-wide screen; sizes estimated from the image)
- **Photo:** full bleed and full screen behind everything, `contentFit="cover"`.
- **Header** (fixed, absolute, `top = safe-area inset + space-2`, `px-gutter`, row, `justify-between`, `items-center`):
  - `Wordmark` height 32, tone default.
  - Skip: `GlassPill` tone light, label "Skip", about 62×42.
- **Location chip:** `GlassPill` tone dark with a filled `MapPin` icon (surface color) and the label in `caption` medium, inverse tone. It sits `px-gutter` from the left and `space-4` above the sheet's curve.
- **Sheet:** white (`bg-surface`), at the bottom of each slide.
  - Top edge (SVG `SheetCurve`, full width, about 56pt tall, filled `surface` via class): a rounded top-left corner (r≈32) begins high on the left, the edge dips gently to about 40pt lower toward the right, then a rounded corner (r≈40) runs into the right side.
  - Body: `px-gutter`, contents top to bottom:
    - `PageIndicator`: 3 segments, `w-8 h-1.5 rounded-full gap-2`, active `bg-lavender`, inactive `bg-border`.
    - `space-5` gap, then the headline: `Text variant="hero"` (new, 36/40, extrabold, ink).
    - `space-3` gap, then the body: `Text variant="subtitle" weight="regular" tone="secondary"` (16/22).
    - `space-6` gap, then buttons in a column with `gap-3`:
      - `Button` primary "Get started" with `trailingIcon={ArrowRight}`.
      - `Button` secondary "Continue with Google" with `leading={<GoogleLogo />}` (20×20).
    - Bottom padding: safe-area inset + `space-2`.

### New tokens (`global.css` + `tailwind.config.js`)
- `--text-hero: 36px; --leading-hero: 40px;` mapped to `text-hero`. New `Text` variant `hero` with default weight `extrabold`.
- `--color-scrim: rgba(11, 11, 26, 0.45);` (`bg-scrim`) for the dark location chip.
- `--color-rim: rgba(255, 255, 255, 0.5);` (`border-rim`) for the chip's white edge.

### New shared components (`src/components/ui/`, exported from `index.ts`, previewed in `/design-system`)
- `GlassPill`: `label`, optional `icon`, `tone: "light" | "dark"`, optional `onPress` (Pressable when set, View otherwise), `className`. Rounded full, `overflow-hidden`, `h-10 px-4`.
  - light: BlurView light + `bg-glass`, ink label.
  - dark: BlurView dark + `bg-scrim` + `border border-rim`, inverse label and icon.
- `PageIndicator`: `count`, `index`, `className`. Segments as above, with an accessibility label like "Slide 1 of 3".
- `GoogleLogo`: `size` (default 20). `expo-image` of `assets/images/google-g.svg`, decorative (`accessible={false}`).

### Non-shared (onboarding only, `src/components/onboarding/`)
- `sheet-curve.tsx`: the SVG top edge, scaled to `useWindowDimensions().width`, fill via `cssInterop` `className="text-surface"` (same pattern as `Wordmark`).
- `onboarding-slide.tsx`: one slide (photo, chip, curve, sheet body). Props: the slide data, `index`, `count`, `onNext`, `onGoogle`.
- `slides.ts`: the three slides' data (image URL, chip, headline, body).

## Out of scope
- The real sign-up screen, Clerk, and Google/Apple OAuth.
- Remembering that onboarding was seen, and redirecting signed-in users.
- Slide transition animations beyond native paging.
- PostHog events.

## Steps
### 1. Docs check
Read `https://docs.expo.dev/versions/v57.0.0/sdk/image/` (SVG support, `contentFit`, `transition`), `.../sdk/blur-view/` and the expo-router Stack/navigation pages. Confirm the APIs used here exist in SDK 57. Done when nothing conflicts with this plan (if something does, stop and explain).

### 2. Tokens and shared components
Add the new tokens to `global.css` and `tailwind.config.js`, the `hero` variant to `Text`, `assets/images/google-g.svg`, and `GlassPill`, `PageIndicator`, `GoogleLogo` (exported from `index.ts`). Add preview rows to `/design-system` (the hero type sample and the new components; the dark pill sits on an ink background). Done when tsc and lint pass.

### 3. Onboarding screen and sign-up placeholder
- Create `src/components/onboarding/*`.
- Rewrite `src/app/index.tsx` as the carousel: header hidden via `Stack.Screen options={{ headerShown: false }}`, `StatusBar style="dark"`.
- Create `src/app/sign-up.tsx`: a native header with title "Create account" and the default back button. The body shows `Text variant="heading"` "Create your account" and a secondary line "Sign-up is coming soon."

Done when tsc and lint pass and the drift greps are clean.

## Verification
1. `npx tsc --noEmit` and `npx expo lint` pass.
2. Drift greps over `src/` (hex literals, `px` values, arbitrary `[...]` classes, `font-bold`-style weight utilities) stay empty.
3. Each Unsplash URL returns 200 (`curl -o /dev/null -w '%{http_code}'`).
4. User check in Expo Go (no simulator on this Linux machine):
   - The app opens on slide 1, matching the design: photo, wordmark, Skip, Whistler chip, curved sheet, lavender first segment, headline, body, both buttons.
   - Swiping moves between slides 1–3, and the indicator follows.
   - "Get started" on slides 1–2 advances to the next slide. On slide 3 it opens sign-up.
   - Skip (any slide) and "Continue with Google" open sign-up. Back returns to the same slide.
   - `/design-system` shows the new components.

## AGENTS.md updates
- **Design system:** add `GlassPill`, `PageIndicator` and `GoogleLogo` to the shared components list. Note that brand logos without a Lucide icon live as SVG files in `assets/images/` and render through `expo-image`, so their colors stay out of TS.
- **Expo** or a new **Routes** line: `index` is onboarding, and `/sign-up` is a placeholder until the auth feature.

## Result
Built as planned.
- Tokens `hero` (36/40), `scrim` and `rim` were added. `Text` has a `hero` variant (extrabold).
- New shared `GlassPill`, `PageIndicator` and `GoogleLogo` components, previewed in `/design-system` section 16, plus the Hero type sample and the Scrim swatch. The design system's old "G" placeholder now uses `GoogleLogo`.
- `assets/images/google-g.svg` is the official G written without arc commands, because the expo-image docs warn that iOS's SVG decoder misrenders compact arcs.
- `index` is the three-slide carousel. `/sign-up` is a placeholder.
- The location pin is an outline `MapPin` (the design's is solid). A filled Lucide `MapPin` would also fill the inner dot.
- tsc, lint, the drift greps, the three Unsplash URLs (200) and the iOS bundle export all pass. The on-device visual check is left to the user (Expo Go).

**Change after review:** only the photos swipe. The footer (location chip, curved sheet, indicator, copy and buttons) is fixed over them. The chip and copy fade (`motion.base`) to the current slide, which is tracked from the scroll offset. `onboarding-slide.tsx` was replaced by `onboarding-sheet.tsx`.
