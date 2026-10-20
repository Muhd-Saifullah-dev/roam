# 08 · Home screen, search screen, native tabs

Status: done

## Goal
A signed-in guest lands on Home (design attached in chat: wordmark, avatar, greeting, "Find your next stay", a lavender one-sentence search bar, category chips, large stay cards). Typing a sentence and submitting opens the Search tab with ranked results from realistic local stay data. Navigation is Expo Router NativeTabs: Home, Search, Trips, Profile.

## Decisions
- **Tabs:** `NativeTabs` from `expo-router/unstable-native-tabs` (SDK 57 component API: `NativeTabs.Trigger.Icon/Label`). It draws the platform bar (Liquid Glass on iOS 26, Material 3 on Android), so it can't copy the design's yellow-circle pill exactly. It's tinted to match: icons and labels in ink, and Android's active indicator in `primary`. The custom `TabBar` stays as a component previewed in `/design-system` only. *(user choice)*
- **Tab icons:** SF Symbols + Material Symbols, since NativeTabs can't render Lucide. Home `house`/`house.fill` · `home`; Search `magnifyingglass` · `search`; Trips `calendar` · `calendar_month`; Profile `person`/`person.fill` · `person`. No `role="search"`, because on iOS 26 that turns it into a detached search button and the design shows a normal tab.
- **Tab colors** come from `global.css` through NativeWind's `useUnstableNativeVariable("--color-ink")` etc., so there are no hex values in TS.
- **Scope:** Home and Search are fully built. Trips is an empty state. Profile shows the avatar, name, email and **Sign out** (moved from the current `/home` placeholder). *(user choice)*
- **Routes:** a `(tabs)` group with `home`, `search`, `trips` and `profile`. URLs stay `/home`, `/search`, `/trips` and `/profile`. The root `Stack.Protected` signed-in guard shows `(tabs)` instead of `home`. `src/app/home.tsx` moves to `src/app/(tabs)/home.tsx`.
- **Local data:** `src/data/stays.ts` holds 12 realistic US stays (3 cabins, 3 beach, 3 city, 3 villas), each with an id, title, type, city, region, price per night, rating, review count, max guests, bedrooms, pets allowed, amenity keys, vibe tags (quiet, cozy, secluded, romantic, family, lively, walkable, views, modern, rustic, luxury) and a short description. Photos are remote Unsplash placeholders. It's shaped like the future Sanity property doc so the swap is mechanical. `src/data/amenities.ts` maps each amenity key to a label, a Lucide icon and synonyms ("hot tub" | "jacuzzi" | "spa").
- **Search = parse + rank in code** *(user choice)*, which mirrors the planned GROQ-filter / embeddings-rank split:
  - `parseQuery(text)` reads hard constraints: max/min price ("under $300", "below 250", "$200–$400", "less than 300 a night"), guests ("for 4", "6 guests", "sleeps 8"), types (cabin/beach/city/villa + synonyms such as "lake house", "condo", "apartment", "loft", "oceanfront"), amenities (via synonyms), pets ("pet friendly", "dog", "pets"), and place (matches a city or region found in the data). Leftover words become soft terms, with stop words dropped.
  - `searchStays(stays, parsed)` **filters** on every hard constraint, then **ranks** by soft-term matches against vibe tags (weight 3), title (2) and description (1), with rating as the tie-break. An empty query returns nothing, and the screen shows suggestions instead.
  - Search runs live as the guest types on the Search screen. It's local and synchronous, so there's no loading or error state.
- **Home behavior:**
  - The search bar is a real input with the design's sentence as its placeholder. Submitting with the keyboard's return key or the ↗ button navigates to `/search?q=…`. With an empty input it opens Search with the field focused.
  - The tall search button next to the heading opens Search with the field focused.
  - Chips (All Stays, Cabins, Beach, City, Villas) filter Home's card list by type, with an empty state if a type has no stays.
  - Stay cards show the photo, rating, location and title. There's no detail screen yet, so cards aren't pressable and the chevron is decoration (see Out of scope).
- **Greeting:** "Hey, {firstName} 👋" from Clerk's `useUser()`, or "Hey there 👋" without a first name.
- **Avatar:** Clerk `user.imageUrl` when `user.hasImage`, otherwise initials on `primary-soft`.
- **Search screen layout:**
  - "Search" heading and the same lavender search bar, prefilled from `q`. A new `q` from Home replaces the text.
  - A row of **"Understood as"** badges for parsed constraints ("Under $300", "Cabin", "Pets OK", "Hot tub"), so a guest sees why results match.
  - A result count, then results as the existing `ListingCard` (horizontal card with amenity badges and price).
  - Empty query: example sentences as chips; tapping one runs it.
  - No results: a `SearchX` empty state that names the constraints and suggests removing one.
- **Animation** (per the expo-animation skill, Reanimated 4.5.1, all on the UI thread):
  - Tab switches: none (native).
  - **Press feedback** on the search bar's ↗ button and the tall search button: a new `PressableScale` component, scale 0.97 with a 120ms CSS transition and `cubicBezier(0.23, 1, 0.32, 1)`.
  - **Home list on chip change** (prevents a jarring change): cards use `entering={FadeIn.duration(200)}`, `exiting={FadeOut.duration(150)}` and `layout={LinearTransition.duration(200)}`. The list is a plain `.map` inside a ScrollView (12 items, not virtualized), so this is safe.
  - **Search results** (state indication): the same layout transition. Entering rows use `FadeInDown.duration(250)` with a 40ms stagger capped at 5 rows. With reduced motion (`useReducedMotion`) it's `FadeIn` only.
  - Chip color snaps on select (a color transition would need an Animated wrapper around a NativeWind class, which isn't worth the risk at <150ms).
  - No haptics, because `expo-haptics` isn't installed and the rules say don't add a dependency for this.
- **Safe area:** each tab screen's first child is a `ScrollView` with `contentInsetAdjustmentBehavior="automatic"` (iOS handles top and bottom). On Android, NativeTabs adds the bottom inset and the screen adds `paddingTop` from `useSafeAreaInsets()`.

## Design (measured from the attached image: frame 680px ≈ 390pt, scale ≈ 0.574; all values estimated from the image)
- **Screen:** `bg-surface`, horizontal padding `gutter` (20).
- **Top row:** `Wordmark` height 32, left. Avatar 84pt circle, right, top-aligned.
- **Greeting:** "Hey, Joanna 👋" in `subtitle` semibold, tone secondary, about 12pt below the top row.
- **Heading:** "Find your next stay" on two lines in a **new `headline` text variant** (44/44, extrabold), ink. To its right, a tall search button 64×80, `rounded-2xl`, `bg-surface-muted`, with a 28pt `Search` icon in ink.
- **Search bar:** full width, height 60, `rounded-full`, `bg-lavender`, padding-left 5.
  - Left: a 22pt `Sparkles` icon in ink.
  - Input: `body` regular ink, with the placeholder "quiet pet friendly cabin with hot tub" in ink so it reads like the design.
  - Right: a 44pt white circle with an `ArrowUpRight` icon, inset 2 (8pt).
  - Gap of 6 (24) above the bar and 5 (20) below it.
- **Chips:** wrap with gap 2, height 12 (48), `rounded-full`, padding 5.
  - New **`filled`** Chip variant: unselected is `bg-surface-muted` with no border; selected is `bg-primary` with a filled icon.
  - Icons: `House` (All Stays), `TreePine` (Cabins), `Waves` (Beach), `Building2` (City), `TreePalm` (Villas). Labels in `body` medium.
- **Stay card (new `StayCard`):** full width, height 268, `rounded-2xl`, photo `cover`, and a gap of 5 (20) between cards.
  - Bottom scrim: an SVG linear gradient from transparent to `--color-ink` at 0.7, over the bottom 60%.
  - Rating pill: top-right inset 3, h-10 px-3, `rounded-full`, `bg-surface`, a filled ink `Star` (18) and the rating in `title` bold.
  - Bottom-left, inset 5: a `MapPin` (18) in surface and the location in `caption` regular inverse, then the title in `heading` bold inverse, 2 lines max, up to 70% wide.
  - Bottom-right, inset 5: a 56pt white circle with a `ChevronRight` (decorative, `IconButton md` look, non-interactive).
- **Bottom padding:** content gets padding-bottom 28 so the last card clears the tab bar.
- **New tokens (`global.css`):**
  - `--text-headline: 44px`, `--leading-headline: 44px`
  - `--size-avatar: 84px`
  - `--size-search-bar: 60px`
  - `--size-stay-card: 268px`
  - `--size-search-tall: 80px` (64 wide uses the existing `space-16`)
- **Missing assets:** none. The avatar is the guest's Clerk photo or initials. Photos are remote placeholders.

## Out of scope
- Stay detail screen (cards and results aren't navigable yet).
- Sanity content, GROQ, embeddings, Jev and API routes. Local data and code search stand in for them.
- Booking or policy questions, saving stays, Trips content, profile editing.
- Dark palette and haptics.

## Steps
### 1. Tokens and shared UI
- Add the tokens above to `global.css` and map them in `tailwind.config.js` (`fontSize.headline`; spacing keys `avatar`, `search-bar`, `stay-card`, `search-tall`).
- `Text`: add a `headline` variant (extrabold).
- `Chip`: add `variant: "outline" | "filled"` (default `outline`, so current uses don't change).
- New components in `src/components/ui/`:
  - `pressable-scale.tsx`: the press-scale recipe; Reanimated CSS transition 120ms.
  - `avatar.tsx`: `uri?`, `name`, `size: "lg" | "md"`, with an initials fallback.
  - `search-bar.tsx`: lavender bar; `value`, `onChangeText`, `onSubmit`, `placeholder`, `ref`, `autoFocus`; returnKeyType `search`.
  - `stay-card.tsx`: large photo card with the gradient scrim (react-native-svg, stop color via `useUnstableNativeVariable`).
- Export everything from `index.ts`. Add previews to `/design-system`.
- Done when tsc and lint pass.

### 2. Stay data and search logic
- `src/data/amenities.ts` and `src/data/stays.ts` as described in Decisions. `Stay` type plus a `toListing(stay)` helper for `ListingCard`.
- `src/lib/search/parse-query.ts` and `src/lib/search/search-stays.ts`, pure TS with no React.
- Done when tsc passes and a scratchpad script (`node --experimental-strip-types`) runs the queries in Verification with the expected results.

### 3. Native tabs and routes
- `src/app/(tabs)/_layout.tsx` with NativeTabs, the four triggers, and colors from tokens (`tintColor` ink, `labelStyle.color` ink, `iconColor` ink, Android `indicatorColor` primary, `backgroundColor` surface).
- Move `home.tsx` into `(tabs)/`. Add `search.tsx`, `trips.tsx` and `profile.tsx`.
- Root `_layout.tsx`: the signed-in guard shows `(tabs)`.
- Trips: empty state ("No trips yet" + a "Find a stay" Button → `/home`).
- Profile: Avatar md, name, email, and the Sign out button with its loading state.
- Done when tsc and lint pass and sign-in still lands on Home.

### 4. Home screen
- Build `(tabs)/home.tsx` from the design using step 1's components and the step 2 data.
- Chip filter, with layout animations on the card list and an empty state.
- Search bar submit → `router.navigate({ pathname: "/search", params: { q } })`; the tall button → `/search` with `focus=1`.
- Done when tsc and lint pass.

### 5. Search screen
- `(tabs)/search.tsx`: reads `q` and `focus` with `useLocalSearchParams` and syncs them into the input when they change. Live `parseQuery` and `searchStays` through `useMemo`.
- "Understood as" badges, result count, `ListingCard` results with staggered entering, the empty-query suggestions, and the no-results state.
- Done when tsc and lint pass.

## Verification
1. `npx tsc --noEmit` and `npx expo lint` pass.
2. Drift greps over `src/` find no hex literals, px values or arbitrary-value classes outside `global.css` and `src/theme/`.
3. Search script with the real data:
   - "quiet pet friendly cabin with a hot tub under $300 a night" → only cabins under $300 that allow pets and have a hot tub, quiet ones first.
   - "beach house for 6" → beach stays sleeping ≥6.
   - "loft in Chicago" → the Chicago city stay.
   - "villa under $100" → none, with the parsed constraints shown as "Villa" and "Under $100".
   - "cozy" → stays tagged cozy first.
   - "" → nothing.
4. `npx expo export --platform ios` bundles (catches route and import errors without a simulator).
5. User check in Expo Go:
   - Sign in → Home matches the design apart from the native tab bar.
   - Tap the chips → cards fade and reflow.
   - Type a sentence → submit → Search shows badges and ranked results.
   - Tap the tall search button → Search with the keyboard up.
   - Trips empty state.
   - Profile → Sign out → onboarding.

## AGENTS.md updates
- **Expo / routes:** replace "`/home` is a placeholder" with: signed-in routes are a `(tabs)` group using `NativeTabs` (`home`, `search`, `trips`, `profile`); tab colors come from `global.css` via `useUnstableNativeVariable`; Home's search submits to `/search?q=`.
- **Who owns what / Content:** until Sanity is wired, stays are local in `src/data/stays.ts` and `src/lib/search` parses hard constraints in code (filter) and ranks by soft terms. Replace it with GROQ + embeddings without changing the screens.
- **Design system:**
  - Add `Avatar`, `SearchBar`, `StayCard` and `PressableScale` to the component list, plus the Chip `filled` variant and the `headline` text variant.
  - `TabBar` is no longer the app's nav; native tabs are.
  - Motion: press scale 0.97/120ms through `PressableScale`; list reflow through Reanimated layout animations.

## Result
Built as planned, with these deviations:
- **Chip icons stay outlined when selected.** Filling open-stroke icons (`Waves`, `Building2`) turns them into solid blobs, so only the yellow fill marks the active chip. The design's filled house is the one visual difference.
- **Tab colors:** every tab is ink (`iconColor` and `labelStyle` included), as in the design. The active tab shows a filled SF Symbol on iOS and the yellow indicator on Android.
- **Extra pieces:**
  - `TabScreen` (`src/components/layout/tab-screen.tsx`) is the shared ScrollView root for tab screens.
  - `StyledTextInput` was pulled out of `TextField` so `SearchBar` shares it.
  - `src/components/stays/` holds the amenity icons, `toListing`, the query badges and the list motion builders.
- **Photos:** checked on a contact sheet and swapped where they didn't fit. The Modern Cabin is now a modern glass house at dusk, close to the design's hero.
- **Data fix:** the A-Frame's data now mentions mountain views. Without that, "peaceful with mountain views under 250" ranked the Austin skyline high-rise first.
- **Typed routes:** regenerated with `@expo/router-server`'s `regenerateDeclarations`, since `expo export` doesn't refresh `.expo/types`.

Checks: tsc, lint, drift greps, the search script (all six plan queries, plus five more) and the iOS bundle export all pass. Visual and motion checks in Expo Go are left to the user.
