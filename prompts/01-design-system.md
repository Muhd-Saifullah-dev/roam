# 01 · Design system

Status: done

## Goal
Every screen draws from one set of Roam tokens (colors, Plus Jakarta Sans type scale, spacing, radii, shadows) and a shared component kit that matches the reference sheet's sections 01–09 and 11–15. A `/design-system` preview screen shows all of it so the user can compare it with the reference in Expo Go.

## Decisions
- Styling stays NativeWind v4 (already installed). Per the expo-design-system skill's "Adopt Before You Build" rule, there is no second theme system: colors live as CSS variables in `global.css`, and the rest of the scale lives in `tailwind.config.js`.
- Light only: `app.json` `userInterfaceStyle` becomes `"light"`. Colors are CSS variables, so a dark palette can be added later in `global.css` alone.
- Font: Plus Jakarta Sans from `@expo-google-fonts/plus-jakarta-sans`, loaded at runtime with `useFonts` in the root layout so it works in Expo Go. The splash screen stays up until fonts load.
- One font family per weight, because custom fonts on native ignore `fontWeight`: `font-sans` (400), `font-sans-medium` (500), `font-sans-semibold` (600), `font-sans-bold` (700), `font-sans-extrabold` (800, wordmark only). Never combine them with `font-bold` or other `fontWeight` utilities.
- Icons: `lucide-react-native` + `react-native-svg`, both Expo Go compatible. One `Icon` wrapper is registered with NativeWind `cssInterop` so icon color comes from a class (`text-ink`), never a hex prop.
- Components live in `src/components/ui/`. Screens use components; components use token classes only.
- No arbitrary-value classes (`p-[13px]`, `bg-[#fff]`) and no hex literals outside `global.css` and `tailwind.config.js`.
- Toggle (section 13) is a custom Pressable + Reanimated control, because the native `Switch` can't reproduce the reference's yellow pill.
- Tab bar (section 10) is out of scope (user's call).
- Sample photos use remote placeholder URLs. The brand wordmark and Google logo are missing from `assets/`, so they get marked placeholders (see Assets).
- New dependencies (user approved font + icon choice): `@expo-google-fonts/plus-jakarta-sans`, `lucide-react-native`, `react-native-svg`. Install with `npx expo install`.

## Out of scope
- Bottom tab bar, tab navigation, and any real app screens.
- Dark palette.
- Fixing the `babel-preset-expo@58` vs SDK 57 mismatch found in the project inspection (separate fix).
- Real Google sign-in. `Button` only renders the look.

## Tokens
Values marked * are estimated from the reference image. The rest are printed on the sheet.

### Colors (`global.css`, as RGB channels so `/opacity` modifiers work)
| Token (class) | Value | Use |
|---|---|---|
| `primary` | #FFC629 | primary actions, active states, rating star, toggle on |
| `primary-soft` * | #FFF5D6 | "Guest favorite" badge background |
| `lavender` | #C9B4FF | secondary actions, selected filter chip |
| `lavender-soft` * | #F3EEFF | policy card, focused input background |
| `lavender-muted` * | #E6DCFF | policy card icon tile |
| `lavender-strong` * | #7C5CFF | focused input border, policy icons |
| `ink` | #0B0B1A | headings, primary text, segmented active background |
| `ink-secondary` | #6B7280 | body, secondary text, placeholders |
| `surface` | #FFFFFF | cards, sheets, modals |
| `surface-muted` | #F4F5F7 | app background, input fields |
| `border` | #E5E7EB | dividers, borders |
| `glass` | rgba(255,255,255,0.7) | glass surfaces (token only. Its consumer, the tab bar, is out of scope) |
| `success` * / `success-soft` * | #1E8E3E / #E7F5EC | success alert, "New" badge |
| `danger` * / `danger-soft` * | #E5383B / #FDECEE | error alert, "20% off" badge text/bg |
| `info` * / `info-soft` * | #3B5BDB / #E8EEFF | "Superhost" badge |

### Typography (`tailwind.config.js` `fontSize` + `fontFamily`, used through `<Text variant>`)
| Variant | Family | Size / line height | Use |
|---|---|---|---|
| `display` | bold | 56 / 56 | hero ("Find your next stay") |
| `heading` | bold | 28 / 34 | screen and section headings |
| `title` * | bold | 20 / 24 | card titles ("Modern Cabin with Hot Tub"), price |
| `subtitle` * | semibold | 16 / 22 | policy card title, row emphasis |
| `body` | regular | 16 / 24 | body copy, input text |
| `caption` | medium | 14 / 20 | location, chip labels, meta |
| `small` * | regular | 13 / 18 | policy card description, badges |
| `button` | medium | 17 / 22 | button labels |
| `wordmark` * | extrabold | 64 / 64 | "roam" placeholder wordmark |

The sheet gives ranges (display 56–64, heading 28–32, button 17–18). The plan uses the low end for phone widths.

### Spacing
Keep Tailwind's default 4-point numeric scale (`1` = 4px). Allowed steps are 1, 2, 3, 4, 5, 6, 8, 10, 12 (4–48px). Add one named step, `gutter` = 20px *, for screen edge padding (`px-gutter`).

### Radii (replace Tailwind's `borderRadius`, not extend, so old names can't drift)
| Token | Value | Use |
|---|---|---|
| `rounded-sm` | 8 | small tiles |
| `rounded-md` * | 12 | alerts, policy icon tile, row icons |
| `rounded-lg` * | 16 | inputs, listing image, policy card |
| `rounded-xl` * | 20 | listing card, grouped list |
| `rounded-2xl` * | 24 | sheets, large surfaces |
| `rounded-full` | 9999 | buttons, chips, badges, icon buttons, segmented, stepper, toggle |

### Shadows (`tailwind.config.js` `boxShadow`)
- `shadow-card` *: `0 1px 2px rgba(11,11,26,0.04), 0 4px 16px rgba(11,11,26,0.06)`, for listing cards, icon buttons, segmented and stepper containers.
- `shadow-raised` *: `0 8px 24px rgba(11,11,26,0.10)`, for floating elements (heart on photo).
- Step 1 confirms these render on native in Expo Go. If NativeWind can't map them, `src/theme/shadows.ts` exports the same strings for the RN `boxShadow` style prop. This is the one allowed JS token file.

### Motion (`src/theme/motion.ts`)
`fast` 150ms (press, toggle), `base` 250ms (segmented indicator).

## Components (`src/components/ui/`)
Every interactive component follows the same contract: `Pressable` with visible pressed feedback (buttons and chips dim to 0.85 opacity, rows change background to `surface-muted`), a `disabled` state (opacity 0.4), the right `accessibilityRole` and `accessibilityState`, an `accessibilityLabel` on icon-only controls, and a `className` or `style` override merged last that affects layout only.

1. **`text.tsx`** `Text` with `variant` (table above, default `body`) and `tone` (`default` = ink, `secondary`, `inverse` = white, `primary`, `success`, `danger`, `info`, `lavender`).
2. **`icon.tsx`** `Icon` with `as` (lucide component), `size` (default 24), `strokeWidth` (default 2), and a `className` color via cssInterop. Section 11 shows: House, Search, Heart, Calendar, User, Settings, MapPin, SlidersHorizontal.
3. **`wordmark.tsx`** `Wordmark` placeholder: "roam" in `wordmark` type, marked `// PLACEHOLDER: replace with brand asset`.
4. **`button.tsx`** `Button` (section 04):
   - `primary`: yellow fill, ink label, optional trailing icon (ArrowRight).
   - `secondary`: white fill, 1px `border`, optional leading element (Google logo placeholder).
   - Sizes `md` (h 56 *, full pill) and `sm` (h 36 *, px-4).
   - Supports `loading` (spinner, label kept as accessibilityLabel).
5. **`icon-button.tsx`** `IconButton` (section 04): 56 * circle, white `surface`, `shadow-card`, centered 24px icon. Props: `icon`, `accessibilityLabel`, `selected` (fills Heart with primary when `selected`), size `md` 56 / `sm` 36 (for the heart on the listing photo).
6. **`text-field.tsx`** `TextField` (section 05): h 56 *, `rounded-lg`, `surface-muted` fill, no border, leading icon (`ink`), `body` text, placeholder `ink-secondary`.
   - Focused: `lavender-soft` fill with 1.5px `lavender-strong` border.
   - `secure`: shows `••••` and an Eye/EyeOff toggle on the right.
   - Optional `trailing` slot (search field puts a SlidersHorizontal IconButton-less icon there).
   - Variants by props only: search, default, focused, password.
7. **`chip.tsx`** `Chip` (section 06): pill, `caption`-size label, optional leading icon.
   - `tone="lavender"` selected: lavender fill, ink semibold label.
   - Unselected: white fill, 1px `border`.
   - `tone="primary"` selected: yellow fill (All Stays).
   - Sizes `md` (h 48 *) and `sm` (h 40 *, with icon).
   - `accessibilityState.selected`.
8. **`badge.tsx`** `Badge` (section 15): pill, `small` medium label, optional leading icon.
   - Tones: `favorite` (primary-soft bg, Star icon filled primary), `success` (success-soft / success, "New"), `danger` (danger-soft / danger, "20% off"), `info` (info-soft / info, "Superhost").
   - Also used for the listing card amenity tags as tone `neutral` (`surface-muted` bg, ink, icon).
9. **`alert-banner.tsx`** `AlertBanner` (section 14): `rounded-md`, full width, leading round status icon (CircleCheck on success, CircleAlert on danger), `caption` message, trailing X IconButton-less pressable with `accessibilityLabel="Dismiss"`. Tones `success` and `danger`. Has `accessibilityRole="alert"`.
10. **`listing-card.tsx`** `ListingCard` (section 07), horizontal layout:
    - (Changed after build: photo is a fixed 128 square inset by p-3, not 160 stretched, so it fits phone width.)
    - Left: 160 * square photo, `rounded-lg`, with a `sm` heart IconButton at top-right.
    - Right: `title` (2 lines max), MapPin + location `caption` secondary, filled Star + rating `caption` + `(count)` secondary, row of neutral Badges (amenities), and price as `title` "$280" plus `caption` secondary "/ night".
    - White `surface`, `rounded-xl`, `shadow-card`.
    - Props: `listing` `{ title, location, rating, reviewCount, pricePerNight, imageUrl, amenities: {label, icon}[] }`, `saved`, `onPress`, `onToggleSave`.
    - Price is formatted in code (`Intl.NumberFormat`, USD, no decimals).
11. **`policy-card.tsx`** `PolicyCard` (section 08): `lavender-soft` fill, `rounded-lg`, padding 4, a 48 * `lavender-muted` `rounded-md` icon tile with a `lavender-strong` icon, then `subtitle` title, `small` secondary description (2 lines), and a trailing ChevronRight in `lavender-strong`. Props: `icon`, `title`, `description`, `onPress`. Examples: MessageSquareText "Ask about policies", FileText "Free cancellation".
12. **`list-row.tsx`** `ListRow` + `ListGroup` (section 09):
    - `ListGroup`: white `rounded-xl` container, children separated by hairline `border` dividers (not one card per row).
    - `ListRow`: leading icon (`ink`), `caption`-size medium label, trailing ChevronRight, h 52 *.
    - Examples: User "Personal info", CreditCard "Payment methods", Briefcase "Trips".
13. **`segmented-control.tsx`** `SegmentedControl` (section 12): `surface` container pill with `shadow-card` and padding 1. The active segment is an `ink` pill with a white icon and label, and inactive segments show an ink icon and label. Reanimated slides the indicator (`motion.base`). Generic `options: {value, label, icon}[]`, `value`, `onChange`. Each segment has `accessibilityRole="tab"` + selected state. Example: List / Map.
14. **`toggle.tsx`** `Toggle` (section 13): 56×32 * pill track, `primary` when on and `border` when off, with a white 26 * thumb using `shadow-card`. The thumb slides with Reanimated (`motion.fast`). Has `accessibilityRole="switch"`, `accessibilityState.checked`, and `value` / `onValueChange` / `disabled`.
15. **`stepper.tsx`** `Stepper` (section 13): `surface` pill with 1px `border`, Minus button, `title` value, Plus button. Props: `value`, `onChange`, `min` (default 0), `max`. Buttons disable at the bounds and have labels "Decrease" / "Increase". Has `accessibilityRole="adjustable"` with increment/decrement actions.
16. **`index.ts`** re-exports all of the above.

## Assets
- **Missing**: Roam wordmark (use the `Wordmark` text placeholder), Google "G" logo (use a marked placeholder circle with "G"), and listing photo (use a remote placeholder URL, e.g. `https://images.unsplash.com/...` cabin photo, via `expo-image`).
- The user should provide `assets/images/roam-wordmark.png` (or .svg) and the official Google logo asset.

## Steps
### 1. Tokens, fonts, and dependencies
- Install `@expo-google-fonts/plus-jakarta-sans lucide-react-native react-native-svg` with `npx expo install`.
- `global.css`: add `:root` color variables (RGB channels).
- `tailwind.config.js`:
  - Fix `content` to `./src/**/*.{js,jsx,ts,tsx}`.
  - Map colors to `rgb(var(--…) / <alpha-value>)`, except `glass`, which is a literal rgba.
  - Add `fontFamily` per weight, the `fontSize` ramp with line heights, `spacing.gutter`, and `boxShadow`.
  - Replace `borderRadius`.
- `src/theme/motion.ts`.
- `src/app/_layout.tsx`: `SplashScreen.preventAutoHideAsync()`, `useFonts` with the five Jakarta weights, hide the splash when loaded or on error, and render null until then.
- `app.json`: `userInterfaceStyle: "light"`.
- Temporarily make the home text use `font-sans-bold text-heading text-ink` to confirm the font and tokens load.

Done when tsc and lint pass and the user sees Jakarta text in Expo Go. In the same check, confirm a `shadow-card` box shows a shadow. If it doesn't, switch to `src/theme/shadows.ts` (Tokens → Shadows).

### 2. Foundations: `Text`, `Icon`, `Wordmark`
Build components 1–3 and `index.ts`. Done when tsc and lint pass.

### 3. Actions and inputs: `Button`, `IconButton`, `TextField`, `Chip`, `Badge`, `AlertBanner`
Build components 4–9. Done when tsc and lint pass.

### 4. Composites: `ListingCard`, `PolicyCard`, `ListGroup`/`ListRow`, `SegmentedControl`, `Toggle`, `Stepper`
Build components 10–15. Done when tsc and lint pass.

### 5. Preview screen
- `src/app/design-system.tsx` (Stack title "Design system") is a ScrollView on `surface-muted` with `px-gutter`. It has one white `rounded-xl` panel per reference section, titled "01. Brand" through "15. Tags / Badges" (section 10 omitted), and uses the reference copy exactly:
  - "Find unforgettable stays for every kind of trip."
  - "Cabins in California", "Enter your name", "Joanna Smith"
  - "Modern Cabin with Hot Tub", "Lake Arrowhead, CA", "4.9 (342)", "$280 / night"
- Interactive pieces hold local state (toggle, stepper, chips, segmented, saved heart, dismissable alerts, password eye) so the user can try them.
- Section 02 renders swatches from the color tokens. Section 03 renders each type variant.
- Home screen (`src/app/index.tsx`) becomes a minimal placeholder with a `Button` linking to `/design-system`.

## Verification
1. `npx tsc --noEmit` and `npx expo lint` pass.
2. `npx expo-doctor` shows no new failures. The known `babel-preset-expo` mismatch is pre-existing and out of scope.
3. Run the drift greps from the skill's `references/audit.md` over `src/`. Expect no hex colors, no `fontSize:` / `borderRadius:` literals, no arbitrary-value classes, no `TouchableOpacity`, and no legacy shadow props. Every `Pressable` file has an accessibility role or label.
4. The user opens Expo Go → home → "Design system" and compares each section with the reference: fonts are Jakarta at every weight, colors match the swatches, chips and segmented control switch selection, the toggle animates, the stepper stops at its bounds, the password eye toggles, the focused input turns lavender, alerts dismiss, and the heart toggles. Any difference gets listed and fixed in the tokens or the component, not on the screen.

## AGENTS.md updates
Add a **Design system** section (replacing nothing):
- Styling is NativeWind. Colors are CSS variables in `global.css`, and the other tokens are in `tailwind.config.js`. Light only.
- No hex literals or arbitrary-value classes outside those two files.
- Font is Plus Jakarta Sans, one family per weight (`font-sans-*`), loaded with `useFonts` in the root layout. Never use `font-bold` or other weight utilities.
- Icons come from lucide-react-native through the `Icon` wrapper, colored by class.
- Shared components are in `src/components/ui/` (list them). Screens use them instead of restyling.
- `/design-system` is a preview route.

## Result
Built as planned, with three deviations:
- Shadows: NativeWind's source showed it converts `box-shadow` to legacy single-layer shadow props, so the plan's fallback `src/theme/shadows.ts` (RN `boxShadow` strings) is used and `tailwind.config.js` has no `boxShadow`.
- `Text` gained a `weight` prop. Overriding the font with a second `font-sans-*` class is unreliable, because NativeWind resolves conflicts by stylesheet order.
- Fonts are imported per weight (`@expo-google-fonts/plus-jakarta-sans/500Medium` etc.). The package root bundled all 14 files, and per-weight imports bundle 5.

The temporary home-text font check in step 1 was skipped, because step 5's home screen covers it. tsc, lint, drift greps and the iOS bundle export all pass. Visual comparison in Expo Go is left to the user.
