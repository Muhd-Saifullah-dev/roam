# Roam

Expo React Native rental app. Guests describe a stay in one sentence ("quiet pet friendly cabin with a hot tub under $300 a night") and get ranked stays back. They can also ask booking and policy questions about a stay, answered with exact text from Roam's own content.

This file is the project's memory: it holds every decision that is still true. Plans in `prompts/` are history.

## Commands

~~~bash
npx expo install <package>  # ALWAYS use instead of npm install: resolves SDK-compatible versions
npx expo start              # dev server (press i for the iOS simulator)
npx expo lint               # lint
npx tsc --noEmit            # type check
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
npx eas-cli@latest <cmd>    # EAS builds, submits, and updates (use instead of bare `eas`)
~~~

## Expo

- Expo ships breaking changes every SDK release, so don't trust memory. Before touching an Expo, EAS, or React Native API, check the `expo` major version in `package.json` and read `https://docs.expo.dev/versions/v<major>.0.0/`. For anything else, start from https://docs.expo.dev/llms.txt and follow its links.
- Routes live in `src/app/`: every file is a screen and `_layout.tsx` files define navigators. API routes are `src/app/api/*+api.ts`. Keep components, hooks, and utils outside `src/app/`.
- `ios/` and `android/` are generated. Never create or edit them by hand; configure native behavior in `app.json` and config plugins.
- Routes so far: `index` is the onboarding carousel; `(auth)` holds `sign-up`, `verify` (params `email`, `flow`), `sign-in` (no group layout); signed-in routes are the `(tabs)` group (`home`, `search`, `trips`, `profile`). The root `_layout.tsx` guards them with `Stack.Protected` on Clerk's `useAuth()`: signed-out sees `index` + `(auth)`, signed-in sees `(tabs)`, and the splash stays up until Clerk loads, fails, or 3s pass (then the app opens signed out, logs why, and the guards switch screens if Clerk loads later). Guards do the redirects, so screens never navigate after sign-in or sign-out.
- Signed-in tabs use headless `expo-router/ui` (`Tabs`, `TabSlot`, a hidden `TabList` declaring the routes) with the shared floating `TabBar`, identical on iOS and Android. The layout maps `usePathname()` to the active tab and switches with `router.navigate`. The bar hides on Android while the keyboard is open. Each tab screen's root is `TabScreen` (`src/components/layout/`), which pads for the status bar and for the bar via `useTabBarInset()`. Home's search sends `/search?q=…&t=…` (`focus=1` focuses the field); a new `t` replaces Search's text and resets its chip. Search looks like Home: the same `CategoryChips` and `StayList` of `StayCard`s (`src/components/stays/`), with one caption line of what the sentence was understood as instead of badges. An empty search browses all stays. Sign out lives on Profile. Stays have no detail screen yet.
- Keep `babel-preset-expo` on the SDK's version (`npx expo install --check`). A newer preset drops Hermes workarounds the SDK's Hermes still needs: preset 58 on SDK 57 made Clerk's async arrows return `undefined` on Android, so Clerk never loaded.
- Expo Go only includes its bundled native modules. After adding a library with native code, switch to a development build (`npx expo run:ios`).

## Who owns what

Each tool has one job. Ask before moving a responsibility to a different tool.

- **Auth:** Clerk is the source of truth, through custom flows on the app's own screens. Passwordless email code for sign-up and sign-in; the full name is split at the first space into `firstName`/`lastName`. Use the method-based `useSignIn`/`useSignUp` API (`signIn.emailCode`, `signUp.verifications`, `finalize`), never `@clerk/expo/legacy` or `setActive` (except SSO, below). Sessions persist via `tokenCache` + `expo-secure-store`, and `resourceCache` (`@clerk/expo/resource-cache`, passed as `__experimental_resourceCache`) lets startup fall back to the saved session after one failed network try. If Clerk hangs on load in Expo Go, restart with `npx expo start --clear` first: stale Metro transforms from a wrong `babel-preset-expo` cause it. Clerk error codes map to copy in `src/lib/auth/clerk-errors.ts`. Sign-up keeps `<View nativeID="clerk-captcha" />`. Dev test emails: `name+clerk_test@…`, code `424242`. Google and Apple use browser SSO through the stable `useSSO()` in `src/components/auth/use-social-sign-in.ts` (the only place `setActive` is allowed); cancelling does nothing, and `src/app/+native-intent.tsx` keeps `sso-callback` links from hitting a missing route. Set Clerk up through the Clerk CLI and use the Clerk MCP for current Expo patterns.
- **Content:** Sanity (properties, hosts, policies, house rules). Studio is a standalone app in `studio/`. Schema deploys and content changes go through the Sanity MCP, and generated property copy uses Agent Actions. Until Sanity is wired, stays are local in `src/data/stays.ts` (shaped like the property doc) and `src/lib/search` stands in for search: `parseQuery` reads hard constraints in code (filters) and `searchStays` ranks by soft terms and vibes. Swap it for GROQ + embeddings without changing the screens. Both stay free of React so they run in Node.
- **Exact constraints** (price, guests, type, amenities, pets, place): GROQ filters, with values always passed as params.
- **Soft intent** (quiet, cozy, secluded): Dataset Embeddings via `text::semanticSimilarity()` inside `score()`.
- **Policy knowledge:** a Sanity Context endpoint in Knowledge Base mode. Context endpoints are created in the Dashboard's Context app and read with an organization token (Context Viewer), per https://www.sanity.io/docs/ai/context-migration-guide. One endpoint serves one mode. The Context skill still describes `sanity.agentContext` Studio documents with a project token; that route is deprecated, so don't use it.
- **Typed decisions** (which stay topics and policies answer a question): Jev, called from API routes through the AI SDK's `experimental_evaluate` with the `@ai-sdk/typesafe-ai` provider and `TYPESAFE_AI_API_KEY`. No Vercel AI Gateway. Keep `ai` and `@ai-sdk/typesafe-ai` pinned to exact versions, since the API is experimental.
- **Answer text:** none generated. Answers show the stay's own fields and policy text word for word, with their source. No LLM runs in the app.
- **Analytics:** PostHog, identified through Clerk.

## Rules

- Secret keys (Clerk secret key, TypeSafe key, Sanity organization token, Sanity write token) never reach the app bundle. Use them only in API routes and local scripts such as seeding. Never put them behind `EXPO_PUBLIC_`, which is bundled into the app. Never commit `.env`. Keep variable names, without values, in `.env.example`.
- Sanity Context needs a deployed Studio for the dataset. Redeploy Studio from `studio/` after schema changes.
- Jev is not an agent. It answers typed questions (Choice, Noul, Score) with probabilities. It never writes GROQ, calls tools, or generates text. Code builds queries from its answers.
- Prices, guest counts, and dates are parsed in code. Jev may choose between candidates code found, but never produces the value.
- Embeddings rank, they don't filter, and they only see the document itself (no references). Hard constraints are always GROQ filters, and text that should affect ranking lives on the property document.
- Policy answers show only text from the stay's data and Roam's policies, word for word. If nothing answers the question, say so and point to support.
- API routes verify the Clerk session before doing any work.
- PostHog failures never block the app. Never send what guests type, tokens, or personal data in events.
- Let Sanity generate document IDs. Model relationships as references.
- Ask before adding a dependency or service, changing the Sanity schema once content exists, or deleting data. Prefer Expo modules over third-party libraries.
- Whenever you need input from the user, ask through your tool's built-in question panel so they pick from options instead of typing. Give two to four clear options with the recommended one first. Fall back to plain text only if no such panel exists.

## Design system

- Styling is NativeWind. Every token is a CSS variable in `global.css` `:root`: hex colors, font families, font sizes and line heights, spacing and sizes (`gutter` = screen edge padding), radii, opacity and border widths. `tailwind.config.js` only maps class names to `var(--…)` and replaces Tailwind's scales, so change values in `global.css`. Light only (`userInterfaceStyle: "light"`); a dark palette goes in `global.css`.
- No hex literals, px values or arbitrary-value classes (`p-[13px]`) outside `global.css`. The only TS tokens are `src/theme/shadows.ts` (RN `boxShadow` strings; NativeWind turns `box-shadow` into legacy single-layer props) and `src/theme/motion.ts` (durations), because RN needs JS values there.
- Font is Plus Jakarta Sans, one family per weight (`font-sans`, `font-sans-medium`, `-semibold`, `-bold`, `-extrabold`). Load it with `useFonts` and per-weight imports (`@expo-google-fonts/plus-jakarta-sans/500Medium`) in the root layout. Never use `font-bold` or other weight utilities. Use `<Text variant weight tone>`.
- Motion uses Reanimated and the expo-animation skill. Press feedback is `PressableScale` (scale 0.97, 120ms). List changes use the shared builders in `src/components/stays/list-motion.ts`. With reduced motion, fades stay and movement goes. Durations live in `src/theme/motion.ts`.
- Icons come from lucide-react-native through `Icon` (`src/components/ui/icon.tsx`), colored by class (`className`, `fillClassName`), never by hex.
- Shared components are in `src/components/ui/` (`Text`, `Icon`, `Wordmark`, `Button`, `IconButton`, `TextField`, `Chip`, `Badge`, `AlertBanner`, `ListingCard`, `PolicyCard`, `ListGroup`/`ListRow`, `SegmentedControl`, `Toggle`, `Stepper`, `TabBar`, `GlassPill`, `PageIndicator`, `GoogleLogo`, `Divider`, `CodeInput`, `Avatar`, `SearchBar`, `StayCard`, `PressableScale`). Chip has `outline`/`filled` variants (filled = home categories); Text has a `headline` variant (44/44 extrabold). `TextField` takes `label`, `error` and `ref`; `IconButton` has a `nav` size (44pt outlined back button). Screens use them instead of restyling. A missing look is a new variant.
- The wordmark is `assets/images/roam-wordmark.svg`, a single vector path with no font, built from geometric shapes measured on the brand logo reference: a round-shouldered r with a flat arm and a rounded terminal, elliptical o and a bowls, m arches over semicircular counters, and ≈7px rounded stem ends. Transparent background, viewBox `0 -598 2715 618`. `Wordmark` draws the same path with react-native-svg (`height`, `tone`), so update both together. Don't rebuild it from a font.
- `TabBar` (`src/components/ui/tab-bar.tsx`) is the app's nav and matches the design on both platforms: a floating glass pill (BlurView, the `glass` tint, a white rim, `shadows.raised`). The active tab is a yellow circle (`bg-primary`, `tab-active` 72) holding its icon and label; the others show an ink icon over its label. The active icon is filled only for items with `filled` (solid shapes like House and User). It doesn't animate between tabs. The yellow circle is its own view mounted only for the active tab: on Android, adding a background to an existing rounded view can show a square, so don't toggle `bg-*` on a rounded view. It's controlled (`items`, `value`, `onChange`). Android blur needs a `BlurTargetView` passed as `blurTarget`.
- Brand logos with no Lucide icon (e.g. Google) are SVG files in `assets/images/`, rendered with `expo-image` so their colors stay out of TS. Write their paths without arc commands (iOS's SVG decoder misrenders compact arcs).
- `/design-system` previews every token and component.

## How we build features

For a new feature or a change across several files. Small fixes and questions skip this.

1. **Understand.** Read the code involved. Open an earlier plan only if this feature builds directly on it (pick by file name). Read the current docs pages for the APIs you'll use, and load a matching skill if one exists (e.g. the Expo, Clerk, Sanity, Sanity Context, or TypeSafe skills). Don't write version-specific APIs from memory.
2. **Ask.** If a real decision is unclear (scope, visible behavior, data shape), ask in the question panel, batching questions into one round and following up only if the answers raise new ones. Pick defaults for the rest and list them. If a decision in this file looks wrong, raise it instead of changing it.
3. **Plan.** Copy `prompts/TEMPLATE.md` to `prompts/NN-feature-name.md` (next number) and fill it in. The plan must be self-contained, so a fresh session can build it from this file plus the plan alone.
4. **IMPORTANT: stop and wait.** Write no app code until the user approves the plan. Ask for approval in the question panel (approve, or request changes). If they request changes, update the plan and ask again. On approval, set `Status: approved`.
5. **Build** step by step, checking each one. If a step turns out wrong, stop and explain instead of redesigning.
6. **Close out.**
   - Run the plan's Verification and give the report described under Reporting.
   - Add a short `## Result` to the plan and set `Status: done`.
   - Update this file: put each lasting decision in the section it belongs to. Replace or remove rules that are no longer true instead of appending. Keep this file under 150 lines.

## Building from designs

Designs are attached in the chat. Screens must match them exactly: layout, spacing, sizes, colors, type, radii, icons, and copy.

- Icons, fonts, and brand images come from `assets/` or the chosen icon library, never recreated from a screenshot. Sample property photos may be remote placeholder images. If an asset is missing, use a marked placeholder and list it.
- Map every color, font, spacing value, and radius to a design-system token. List values with no token in the plan as proposed new tokens instead of hardcoding them. When creating the design system itself, derive the tokens from the designs.
- UI plans describe the design (elements, states, tokens, assets) well enough to build without the image. If building in a new session, ask for the design to be attached again.
- After building, open the screen in the iOS simulator (deep link with `xcrun simctl openurl booted <url>` when it isn't the first screen; the scheme is in `app.json`), take a screenshot (`xcrun simctl io booted screenshot <path>`), and compare it with the design. List every difference, fix, and repeat. Report which values were estimated from an image.

## Reporting

End every piece of work that changes code (features and fixes, not answers to questions) with this report. Use these headings in this order, and leave out any section that would be empty.

- **Done:** one line on the outcome, then the files changed and what changed in each.
- **Verified:** each check with ✅ or ❌ and its evidence (command output, screenshot). List what wasn't checked as ❌ with the reason. Never mark something ✅ without running it.
- **You need to:** numbered actions only the user can take, such as keys, dashboard settings, manual steps in Sanity, or assets to provide.
- **Test it yourself:** numbered steps to reproduce the result from a fresh start, ending with `Expected:` and what the user should see.
- **Notes:** defaults picked, trade-offs, and anything left for later.

## Checks

- Lint and type check pass before any task is called done.
- Screens that load data handle loading, error, and empty states.
- AI features are tried against realistic inputs, and failures are explained by cause: missing data, the decision Jev made, the query, or the code.