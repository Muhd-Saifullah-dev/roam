# 07 · Social login

Status: done

## Goal
"Continue with Google" and "Continue with Apple" sign guests in or up through Clerk. This covers the sign-up and sign-in screens and onboarding's Google button. New and returning guests land on Home, and it works in Expo Go.

## Decisions
- **Browser SSO for both providers** (user choice). Clerk's `useSSO()` from `@clerk/expo` opens an auth browser sheet (`expo-web-browser`). There's no native Google/Apple sheet, no dev build, and no Google Cloud client IDs. Dev instances use Clerk's shared OAuth credentials.
- **Hook choice:** use the stable `useSSO` (`node_modules/@clerk/expo/dist/hooks/useSSO.d.ts`), never `useOAuth`. It resolves to `{ createdSessionId, setActive, signUp }`. When `createdSessionId` is set, call `setActive({ session: createdSessionId })`. This is the one place `setActive` is allowed. The `@clerk/expo/experimental` variant is skipped, since AGENTS.md avoids experimental APIs where a stable one exists.
- **Apple** (user choice): the user enables Apple under Social connections in the Clerk Dashboard. It uses the same browser flow (`oauth_apple`), on iOS and Android alike.
- **Dependencies** (user choice): `npx expo install expo-auth-session expo-crypto`. `expo-web-browser` is already installed. `@clerk/expo` loads both at runtime for SSO.
- **Shared hook** `src/components/auth/use-social-sign-in.ts` returns `{ start(provider), pending }`, where `provider` is `"google" | "apple"` and `pending` is the provider in flight or `null`:
  - Session created → `setActive`. The root layout's `Stack.Protected` guard then redirects to `/home`, so nothing navigates.
  - Cancelled (no `createdSessionId` and no `missing_requirements`) → nothing happens, with no error UI.
  - `signUp.status === "missing_requirements"` → alert "Couldn't finish sign-up": "Your Google/Apple account didn't share everything roam needs. Sign up with your email instead." This shouldn't happen, since names are optional.
  - Thrown error → alert "Sign-in failed" with `authError(err).message`.
- **Buttons:** the pressed provider's `Button` shows `loading`, and the other social button is `disabled` while one is pending. The email form stays usable.
- **Screens** (user choice):
  - `sign-up.tsx` and `sign-in.tsx`: both buttons call `start(...)`. The `comingSoon` alerts are removed.
  - `index.tsx` → `OnboardingSheet` (user request): its "Continue with Google" works exactly like the auth screens' button. Same hook and same `start("google")` call: it opens the Google sheet directly and lands on Home, with the same loading, cancel and error behavior. It no longer opens the sign-up screen. The sheet gets a `googleLoading` prop for the button. Skip, Next and the last slide still open sign-up.
- **Redirect URL:** Clerk's default, `AuthSession.makeRedirectUri({ path: "sso-callback" })`. That's `exp://…/--/sso-callback` in Expo Go and `roam://sso-callback` in builds. Clerk dev instances accept any native redirect.
- **Callback deep link:** on Android the redirect can also reach Expo Router as a link to `/sso-callback`, which has no route. A new `src/app/+native-intent.tsx` exports `redirectSystemPath` and rewrites any path containing `sso-callback` to `/`. The guards then show onboarding or Home, depending on the session.
- **Apple logo** stays the marked placeholder (`AppleLogoPlaceholder`) until the official asset is provided.

## Out of scope
- Native Google / Apple sheets (dev build), production OAuth credentials, and allowlisting redirect URLs for a production instance.
- Linking a social account to an existing email account from settings.
- Other providers.

## Steps
### 1. Dependencies
- `npx expo install expo-auth-session expo-crypto`. Done when `package.json` lists both at SDK 57 versions.

### 2. Hook
- Create `src/components/auth/use-social-sign-in.ts` as described in Decisions, using `useSSO` and `authError` from `src/lib/auth/clerk-errors.ts`.

### 3. Auth screens
- In `sign-up.tsx` and `sign-in.tsx`, wire both buttons with `loading={pending === p}` and `disabled={pending !== null && pending !== p}`. Remove `comingSoon` and the `Alert` import if it's no longer used.

### 4. Onboarding
- Add the `googleLoading?: boolean` prop to `OnboardingSheet` and pass it to its Google `Button`. In `index.tsx`, use the hook and pass `onGoogle={() => start("google")}`.

### 5. Callback rewrite
- Add `src/app/+native-intent.tsx` with `redirectSystemPath({ path })` that returns `"/"` for `sso-callback` paths and `path` otherwise. Check the export signature against `https://docs.expo.dev/versions/v57.0.0/sdk/router/`.

## Verification
- `npx tsc --noEmit`, `npx expo lint`, `npx expo export --platform ios`.
- Manual in Expo Go (the user runs this):
  1. Onboarding → Continue with Google → pick an account → Home shows "Welcome, {first name}."
  2. Sign out → Sign in → Continue with Google → the same account lands on Home (no duplicate user in the Clerk Dashboard).
  3. Sign up → Continue with Apple → Home.
  4. Start Google, then close the browser sheet → back on the screen, no alert, buttons enabled.
  5. Kill and relaunch → still on Home.

## AGENTS.md updates
- **Auth (Who owns what):** Google and Apple use browser SSO through the stable `useSSO()` in `src/components/auth/use-social-sign-in.ts`, which calls `setActive` (the only allowed use). Cancelling does nothing. `src/app/+native-intent.tsx` rewrites `sso-callback` links to `/`.

## Result
Built as planned, with one change: `+native-intent.tsx` returns `null` (stay on the current screen) for `sso-callback` links while the app is open, and `/` only on a cold start. The v57 docs say a falsy return means no redirect. tsc, lint and an iOS bundle export pass. The manual Expo Go flows are for the user to run.
