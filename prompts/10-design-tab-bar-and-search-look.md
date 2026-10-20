# 10 · Design tab bar on both platforms + Search looks like Home

Status: done

## Goal
The tab bar matches the attached design on iOS and Android. The Search screen uses the same category chips and big photo stay cards as Home, instead of grey badges and small listing cards.

## Decisions
- **Tab bar = the design** *(user choice, replaces plan 09's ink pill)*:
  - **Bar:** a floating frosted glass pill (BlurView + `bg-glass`, 2px white rim, `shadows.raised`), height `--size-tab-bar` back to 80.
  - **Active tab:** a 72pt (`--size-tab-active`, restored) `bg-primary` yellow circle, with the icon and a `small` medium label inside it.
  - **Every other tab:** an ink icon with its label underneath, no circle.
  - **Icons:** `House`, `Search`, `Calendar`, `User`. The active icon is filled where Lucide's shape allows it (House, User). Search and Calendar stay outlined, because filling them makes solid blobs. A new `filled` flag on `TabBarItem` sets this per tab.
  - **No slide:** the circle snaps to the tapped tab, as the design implies and the animation skill prefers for tab switches. A light press dim shows the tap.
  - Removes `--size-tab-pill`. The custom `expo-router/ui` tabs layout, safe-area padding and Android keyboard hiding from plan 09 stay unchanged.
- **Search screen like Home** *(user choice)*:
  - **Layout:** "Search" headline, the lavender search bar, the same `filled` category chips as Home (All Stays, Cabins, Beach, City, Villas; yellow when selected), then results as `StayCard`s with gap 5.
  - **No badges:** the grey "Understood as" badges are removed. One caption line explains the parse, e.g. "4 stays · Cabin · Under $300 · Pets OK · Hot tub · Quiet" (`caption`, secondary), so the guest still sees why stays match.
  - **Chips filter the results** by type, on top of the sentence. A new sentence from Home resets the chip to All Stays.
  - **Empty sentence:** Search shows all stays (narrowed by the chip) as browse, with the caption "12 stays". The example-sentence suggestions go.
  - **No results** keeps the existing empty state.
- **Shared, not copied:**
  - `src/components/stays/category-chips.tsx` holds the categories and the chip row.
  - `src/components/stays/stay-list.tsx` holds the animated `StayCard` list: Home skips the entrance on first show; Search staggers new results.
  - Home and Search both use them.

## Out of scope
- Stay detail screen, sliding tab indicator, haptics.

## Steps
### 1. Tab bar to the design
- Tokens: `--size-tab-bar` back to 80; restore `--size-tab-active` 72; remove `--size-tab-pill`.
- Rewrite `src/components/ui/tab-bar.tsx`: no pill animation; per-item `filled`.
- Update the items in `src/app/(tabs)/_layout.tsx` and `/design-system` section 10.

### 2. Shared stay pieces and the Search look
- Add `category-chips.tsx` and `stay-list.tsx`, and refactor Home to use them.
- Rebuild `search.tsx` with chips, the summary caption and `StayList`.
- Turn `query-badges.ts` into `query-summary.ts`, which returns the caption parts.

### 3. Close out
- Run tsc, lint, the drift greps and the iOS and Android bundle exports.
- Update AGENTS.md (the `TabBar` bullet and the Search description) and add a Result here.

## Verification
1. tsc and lint pass; the drift greps stay empty.
2. The iOS and Android bundles build.
3. User check in Expo Go on both platforms:
   - The tab bar matches the design: yellow circle with a filled house on Home, labels under the other icons.
   - Type "quiet pet friendly cabin with hot tub under $300" → Search shows the chips and big cards, with the caption explaining the match.
   - Tap Beach → the results narrow.
   - Clear the field → all stays show as big cards.

## AGENTS.md updates
- **Design system:** replace the `TabBar` bullet with the design version (yellow active circle with a filled icon and label, ink icon + label inactive, no slide, per-item `filled`).
- **Routes:** Search shows the same chips and `StayCard`s as Home, with a one-line caption of what the sentence was understood as; empty search browses all stays.

## Result
Built as planned. Additions:
- `toListing` and the amenity icon map existed only for the old Search cards. Both are removed, and `stayLocation` moved to `src/components/stays/stay-location.ts`.
- The tab bar's inner padding is `px-1`, so four 72pt circles fit a 350pt bar with room around each.

Checks: tsc, lint, drift greps, and the iOS and Android bundle exports all pass. The on-device look is left to the user.
