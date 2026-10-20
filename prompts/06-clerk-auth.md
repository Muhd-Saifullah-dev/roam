# 06 · Clerk auth

Status: done

## Goal
Guests sign up and sign in with Clerk email verification codes on Roam's own screens. Sessions persist across app restarts, signed-out guests can't reach `/home`, signed-in guests can't reach onboarding or auth, and Sign out returns to onboarding. The mock auth module is gone.

## Decisions
- **Passwordless email code** (user choice). Sign-up: name + email → code. Sign-in: email → code. Password fields, password validators and "Forgot password?" are removed.
- **Name** (user choice): First and last name are turned on in the Clerk Dashboard. The single "Full name" field is trimmed and split at the first space: `firstName` = first word, `lastName` = the rest (omitted if empty). Home greets the guest with `user.firstName`.
- **Persistent sessions** (user choice): add `expo-secure-store` via `npx expo install`. It powers `tokenCache` from `@clerk/expo/token-cache`, which is already on `ClerkProvider`. Expo Go includes it.
- **SDK:** `@clerk/expo` 4.13.0 (installed). Use the method-based API, checked against `node_modules/@clerk/shared/dist/types/signInFuture.d.ts` and `signUpFuture.d.ts`:
  - `const { signUp } = useSignUp()`: `signUp.create({ emailAddress, firstName, lastName })`, `signUp.verifications.sendEmailCode()`, `signUp.verifications.verifyEmailCode({ code })`, `signUp.finalize()`.
  - `const { signIn } = useSignIn()`: `signIn.emailCode.sendCode({ emailAddress })`, `signIn.emailCode.sendCode()` to resend, `signIn.emailCode.verifyCode({ code })`, `signIn.finalize()`.
  - Every method resolves to `{ error }`, so check `error` instead of using try/catch. Never use `@clerk/expo/legacy`, `prepareFirstFactor` or `setActive`.
- **Error copy:** `src/lib/auth/clerk-errors.ts` maps `error.errors[0].code` to Roam's copy and the field it belongs on. Unknown codes fall back to Clerk's `longMessage`, then to "Something went wrong. Try again."
  - `form_identifier_exists` → email: "An account with this email already exists."
  - `form_identifier_not_found` → email: "No account found with this email."
  - `form_param_format_invalid` on email → email: "Enter a valid email address"
  - `form_code_incorrect` → code: "That code isn't right. Try again."
  - `verification_expired` → code: "This code expired. Tap Resend code."
  - `too_many_requests` / `verification_failed` (attempts exhausted) → code: "Too many attempts. Wait a moment and resend a code."
- **Verify screen** takes params `email` and `flow` (`"sign-up" | "sign-in"`) and calls the matching hook. Resend keeps the 30s cooldown. "Wrong email? Change it" goes back to the form, which keeps its values; submitting again starts a fresh attempt.
- **Protected routes** use Expo Router `Stack.Protected` in the root layout, with `useAuth()` from `@clerk/expo`:
  - `guard={!isSignedIn}`: `index` (onboarding), `(auth)/sign-up`, `(auth)/verify`, `(auth)/sign-in`
  - `guard={!!isSignedIn}`: `home`
  - `design-system` stays unguarded.
  - When the guard flips, Expo Router removes the screens that are now protected from history and redirects. So screens no longer call `dismissAll()` / `replace("/home")` after auth or `replace("/")` after sign-out. `finalize()` gets a `navigate` callback that only handles `session.currentTask`: it shows an alert, since no session tasks are enabled. If the redirect doesn't land on `/home` during the build, stop and report.
- **Startup:** the root layout keeps the splash screen up until both the fonts and Clerk (`isLoaded`) are ready, so onboarding never flashes for a signed-in guest.
- **Sign out:** `useClerk().signOut()` on Home, with `loading` on the button while it runs.
- **Bot protection:** sign-up renders `<View nativeID="clerk-captcha" />`. Captcha is off on this instance, but the mount point is required anyway.
- **Google / Apple buttons** stay "Coming soon". Google is enabled on the instance; SSO is a later feature.
- **Clerk MCP:** it needs authorization (`/mcp` in an interactive session), so this plan is built from the clerk-expo skill, the installed `.d.ts` files, and the live instance settings (`/v1/environment`).

## Out of scope
- Google / Apple sign-in, passwords, password reset, MFA.
- API routes and server-side session verification (no API routes exist yet).
- PostHog identify.
- Profile editing and account deletion.

## Steps
### 1. Dependency and root layout
- `npx expo install expo-secure-store`. Add `"expo-secure-store"` to `app.json` plugins only if the install doesn't. Check `@clerk/expo`'s plugin requirement for Expo Go: don't add it if it forces a dev build, and note it either way.
- In `src/app/_layout.tsx`, split out a `RootNavigator` rendered inside `ClerkProvider`. It reads `useAuth()`, waits for both `isLoaded` and the fonts before hiding the splash, and renders `<Stack screenOptions={{ headerShown: false }}>` with the two `Stack.Protected` groups described above.
- Done when signed-out launch shows onboarding exactly as today.

### 2. Error helper
- Create `src/lib/auth/clerk-errors.ts`, which exports `authError(error): { field?: "name" | "email" | "code"; message: string }` with the mapping above.

### 3. Sign-up
- Remove the password field and `passwordRef`. Name returns "next" to email, and email returns "go".
- Submit: validate, then `signUp.create(...)`, then `sendEmailCode()`. Map any error onto its field. On success, `router.push({ pathname: "/verify", params: { email, flow: "sign-up" } })`.
- Add `<View nativeID="clerk-captcha" />` below the primary button.

### 4. Sign-in
- Remove the password field, the demo `AlertBanner` and "Forgot password?". The subtitle stays. The button stays "Sign in" with `ArrowRight`, and the email field returns "go".
- Submit: `signIn.emailCode.sendCode({ emailAddress })`. Errors go on email. On success, push `/verify` with `flow: "sign-in"`.

### 5. Verify
- Remove the demo banner. Read `flow`. Verify with the matching method; if `status === "complete"`, call `finalize({ navigate })`. Any other status shows "We couldn't finish signing you in. Try again or contact support." Errors clear the code and show under it. Resend calls the matching send method and shows any error.

### 6. Home and cleanup
- `home.tsx`: `useUser()` → "Welcome, {firstName ?? primary email}." `useClerk().signOut()` with button loading.
- Delete `src/lib/auth/mock-auth.ts`. Remove `validatePassword` / `validateNewPassword` from `validation.ts`. Grep for leftover `mock-auth` imports.

## Verification
- `npx tsc --noEmit`, `npx expo lint`, `npx expo-doctor`.
- Manual in Expo Go (the user runs this; Clerk dev instances accept `+clerk_test` emails, e.g. `jane+clerk_test@example.com`, with code `424242`, and no real email is sent):
  1. Sign up with a new test email and name "Jane Doe", enter 424242 → Home shows "Welcome, Jane." and back gesture doesn't return to auth.
  2. Wrong code 111111 → "That code isn't right. Try again."
  3. Sign up again with the same email → "An account with this email already exists."
  4. Sign in with an unknown email → "No account found with this email."
  5. Kill and relaunch the app → lands on Home (session persisted, no onboarding flash).
  6. Sign out → onboarding; deep link `roam:///home` → redirected to onboarding.
  7. Sign in with the account from 1 + 424242 → Home.

## AGENTS.md updates
- **Routes:** replace the `(auth)` / `/home` line. Root `_layout.tsx` guards with `Stack.Protected` on Clerk's `useAuth()`: signed-out sees `index` + `(auth)`, signed-in sees `home`. Guards handle redirects, so screens don't navigate after sign-in or sign-out.
- **Auth (Who owns what):** replace the mock sentence with: Clerk custom flows, passwordless email code for sign-up and sign-in, `firstName` / `lastName` from the full name, `tokenCache` + `expo-secure-store`. Use the method-based `useSignIn` / `useSignUp` API (never `@clerk/expo/legacy`). Clerk error codes map to copy in `src/lib/auth/clerk-errors.ts`. Sign-up keeps the `clerk-captcha` mount point.

## Result
Built as planned. `Stack.Protected` guards in the root layout do every redirect; `finalize()`'s `navigate` only alerts on session tasks. Added `expo-secure-store` (its config plugin was added to `app.json`). The `@clerk/expo` config plugin was not added: it only wires native components, which Expo Go can't use. `.env.example` now lists the Clerk variable names. tsc, lint and an iOS bundle export pass. expo-doctor flags `babel-preset-expo` 58 vs SDK ~57, which predates this plan. The manual Expo Go flows are for the user to run.
