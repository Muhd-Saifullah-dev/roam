# 05 · Auth screens (mocked)

Status: done

## Goal
Guests can sign up, verify their email with a code, and sign in, with mocked auth. Each screen validates its form, shows loading and errors, and they connect to each other, to onboarding, and to a placeholder home.

## Decisions
- **Mocked auth only** (user choice). `src/lib/auth/mock-auth.ts` is an in-memory module with async functions shaped like a Clerk email-code flow (`signUp`, `verifyEmail`, `resendCode`, `signIn`, `signOut`, `getSession`), so Clerk can replace it later without screen rewrites. About a 600ms fake delay per call. Nothing persists across reloads.
- **Mock rules:**
  - The verification code is **`123456`** (user choice). Any other code shows "That code isn't right. Try again."
  - Sign-in works for accounts verified this session plus a seeded demo account, **demo@roam.app / password123** (user choice).
  - Errors:
    - Unknown email: "No account found with this email."
    - Wrong password: "Incorrect password."
    - Unverified account: the screen sends you to verify.
    - Signing up with an already-verified email: "An account with this email already exists."
- **Dev hints:** an info `AlertBanner` on verify ("Demo code: 123456") and sign-in ("Demo: demo@roam.app / password123"). They're marked to be removed with Clerk.
- **After auth** (user choice): a placeholder `/home` showing "You're signed in" and the user's name, with a Sign out button that returns to onboarding. Successful auth calls `router.dismissAll()` then `router.replace("/home")`, so back doesn't return to auth.
- **Code input** (user choice): 6 boxes over one hidden `TextInput` (`number-pad`, `textContentType="oneTimeCode"`, `autoComplete="one-time-code"`, `maxLength={6}`), so paste and SMS/email autofill work. It auto-submits on the 6th digit. "Resend code" has a 30s cooldown.
- **Apple logo:** a marked placeholder (user's earlier choice): a dashed 20pt square, listed under "You need to".
- **Google / Apple buttons** on auth screens show an alert: "Coming soon".
- **"Forgot password?"** on sign-in shows a "Coming soon" alert.
- **Validation:** runs on submit, then re-checks a field as it's edited once its error shows. Rules:
  - Name is required ("Enter your full name").
  - Email must match `^[^\s@]+@[^\s@]+\.[^\s@]+$` ("Enter a valid email address").
  - The sign-up password needs at least 8 characters ("Use at least 8 characters"). The sign-in password just needs to be filled.
  - Mock errors show under the matching field.
- **Keyboard:** each field's return key is "next" and focuses the next field; the last one submits. Content scrolls inside a `KeyboardAvoidingView` (`padding` on iOS), with `keyboardShouldPersistTaps="handled"`. Autofill hints: `name`, `email`, `new-password` / `password`.
- **Routes:** a `src/app/(auth)/` group with its own `_layout.tsx` (Stack, `headerShown: false`) holds `sign-up`, `verify` (param `email`) and `sign-in`. URLs stay `/sign-up` etc., so onboarding's links keep working. The old placeholder `src/app/sign-up.tsx` is removed.
- **Moving between auth screens:**
  - Sign-up ⇄ sign-in links use `router.replace` (they swap instead of stacking).
  - Sign-up → verify uses `push`, so back returns to the form with values kept.
  - Signing in with an unverified account pushes verify.
  - The back button calls `router.back()`, or replaces `/` if there's no history.
- Copy for verify, sign-in and home is written here, since only sign-up is designed.

## Design: sign-up (attached image, 393pt screen; values estimated from the image)
- **Screen:** `bg-surface`, safe-area top and bottom, `px-gutter`.
- **Header** (row, `justify-between`, `items-center`, `pt-2`):
  - Back: `IconButton` new size `nav`, 44pt circle, `bg-surface`, `border border-border`, no shadow, `ChevronLeft` 22.
  - Right: `Wordmark` height 20.
- **Title:** `Text variant="hero"` "Create your account" (wraps to two lines like the design), `mt-8`.
- **Subtitle:** `Text variant="subtitle" weight="regular" tone="secondary"`, `mt-3`: "Join roam to save your stays, get personalized recommendations and access them across all your devices."
- **Fields** (`mt-6`, `gap-3`): `TextField` with the new `label` prop. Labeled look:
  - Box: `rounded-lg bg-surface-muted border-2 border-surface-muted px-5 py-2`, `gap-5` between icon and text, so it's 60pt tall.
  - Text column: label in `caption` medium ink (20) above the input in `text-body` (`h-6`), placeholder `ink-secondary`.
  - Focused: lavender border and soft fill, as today.
  - Error: `border-danger`, plus the message below the box in `small` danger with `mt-1.5 px-1`.
  - Rows:
    1. `User` icon, "Full name", placeholder "e.g. Adrian Hajdin"
    2. `Mail` icon, "Email address", placeholder "you@example.com"
    3. `Lock` icon, "Password", placeholder "At least 8 characters", `secure` (EyeOff/Eye toggle on the right, as today)
- **Primary button:** `Button` "Create account" with `trailingIcon={ArrowRight}`, `mt-6`, and `loading` while the mock runs.
- **Divider:** new `Divider` with label "or": a 1px `bg-border` line on each side and `caption` secondary text in the middle, `gap-4`, `my-5`.
- **Social buttons** (`gap-3`):
  - `Button` secondary "Continue with Google" with `leading={<GoogleLogo />}`
  - `Button` secondary "Continue with Apple" with `leading={<AppleLogoPlaceholder />}`
- **Footer** (pushed to the bottom with `mt-auto pt-6 pb-2`, centered row): `caption` regular secondary "Already have an account?" followed by a pressable `caption` semibold ink `underline` "Sign in".

## Design: verify and sign-in (derived from sign-up's style)
- **Verify:**
  - Same header.
  - Title "Check your email".
  - Subtitle "We sent a 6-digit code to " plus the email in semibold ink, then ". Enter it below to verify your account."
  - `AlertBanner` info "Demo code: 123456" (`mt-6`).
  - `CodeInput` (`mt-6`): six `h-14 flex-1 rounded-lg bg-surface-muted border-2 border-surface-muted` boxes, `gap-2`, digits in `title` bold. The active box has `border-lavender-strong bg-lavender-soft`; on error every box gets `border-danger`. The error text sits below in `small` danger.
  - Button "Verify" (disabled until 6 digits, loading while checking), `mt-6`.
  - Row: `caption` secondary "Didn't get a code?" plus "Resend code" in semibold underline, or "Resend in 0:24" in secondary while cooling down.
  - Footer: "Wrong email?" plus "Change it" (goes back).
- **Sign-in:**
  - Same header.
  - Title "Welcome back".
  - Subtitle "Sign in to see your saved stays and pick up where you left off."
  - `AlertBanner` info with the demo login.
  - Fields: Email (`Mail`, "you@example.com") and Password (`Lock`, "Your password", `secure`).
  - Right-aligned `caption` semibold ink "Forgot password?" (`mt-3`).
  - Button "Sign in" with `ArrowRight`, then the "or" divider, Google and Apple.
  - Footer: "New to roam?" plus "Sign up".
- **Home placeholder:** `Wordmark`, then `heading` "You're signed in", `body` secondary "Welcome, {name}.", and `Button` secondary "Sign out".

### New tokens
- `--space-11: 44px` (`11` in spacing) for the 44pt nav button.

### Component changes (`src/components/ui/`, exported and previewed in `/design-system`)
- `TextField`: new optional props `label` (the labeled two-line look above), `error` (danger border and message), and `ref` (React 19 ref prop, forwarded to the `TextInput`). Without `label` it looks unchanged.
- `IconButton`: new size `nav` (`h-11 w-11`, outlined, no shadow, icon 22).
- `Divider` (new): optional `label`.
- `CodeInput` (new): `value`, `onChangeText`, `length` (default 6), `error`, `autoFocus`, `onComplete`.

### Auth-only (`src/components/auth/`)
- `auth-screen.tsx`: safe area, keyboard avoiding, scroll view, and the header. Its `children` and `footer` props place the footer at the bottom.
- `auth-header.tsx`: the back button and wordmark.
- `footer-link.tsx`: prompt text plus an underlined link.
- `apple-logo-placeholder.tsx`: the marked placeholder.
- `validation.ts`: the email, name and password checks above.

## Out of scope
- Clerk, real OAuth, password reset, persisted sessions, redirecting signed-in users away from onboarding, PostHog events, and a real home screen.

## Steps
### 1. Shared components and token
Add `--space-11` and its tailwind mapping. Extend `TextField` and `IconButton`, add `Divider` and `CodeInput`, export them, and add preview rows in `/design-system` (a labeled field, a labeled field with an error, the nav button, the divider, the code input). Done when tsc and lint pass.

### 2. Mock auth and validation
Create `src/lib/auth/mock-auth.ts` and `src/components/auth/validation.ts` per the decisions. Done when tsc passes.

### 3. Screens and navigation
- Create the `src/components/auth/*` pieces, the `(auth)` group (`_layout.tsx`, `sign-up.tsx`, `verify.tsx`, `sign-in.tsx`) and `src/app/home.tsx`.
- Delete `src/app/sign-up.tsx`.

Done when tsc and lint pass and the drift greps are clean.

## Verification
1. `npx tsc --noEmit` and `npx expo lint` pass. The drift greps (hex, px, arbitrary classes, weight utilities) are clean. `npx expo export --platform ios` builds.
2. User check in Expo Go:
   - Onboarding → Get started (×3) or Skip → sign-up matches the design.
   - Tapping Create account with empty fields shows three errors. A bad email or a short password shows its own error, which clears as you type.
   - A valid sign-up → spinner → verify shows your email. Code `111111` shows an error. `123456` → home shows your name, and back doesn't return to auth.
   - Resend starts the 30s countdown. Pasting a code fills all boxes.
   - Sign out → onboarding → sign-up → "Sign in" swaps to sign-in. demo@roam.app with a wrong password shows "Incorrect password", and password123 → home.
   - The account you made earlier in the session signs in. An unknown email shows "No account found".
   - Google, Apple and Forgot password show "Coming soon". The keyboard never covers the focused field, and return moves to the next field.

## AGENTS.md updates
- **Who owns what → Auth:** "Until Clerk is wired, `src/lib/auth/mock-auth.ts` mocks auth with the same flow (sign up → email code → session). Screens call only that module, so Clerk replaces it."
- **Expo/Routes:** replace the routes line with: `index` is onboarding; `(auth)` holds `sign-up`, `verify`, `sign-in`; `/home` is a placeholder.
- **Design system:** add `Divider` and `CodeInput` to the component list. Note that `TextField` has `label`/`error` and that `IconButton` has a `nav` size.

## Result
Built as planned, with these deviations:
- **No `(auth)/_layout.tsx`.** The group has no layout of its own, so its screens sit in the root Stack and `dismissAll()` + `replace("/home")` clears auth and onboarding from history. A nested Stack would have limited `dismissAll` to the auth stack. Each auth screen hides the header through `AuthScreen`.
- `AlertBanner` gained an `info` tone for the demo hints.
- `TextField`'s `ref` needed a type cast: `cssInterop` forwards refs at runtime, but its types drop `ref`.
- RN 0.86's `Text` has no `hitSlop`, so text links are `Pressable` around `Text`.
- Form state is shared through `src/components/auth/use-auth-form.ts`.

Checks: tsc, lint, the drift greps and the iOS export pass. A Node run of `mock-auth.ts` covered:
- the demo account with a wrong password, then the right one
- an unknown email
- sign-up, then sign-in before verifying (needs verification)
- a wrong code, then the right code (session set)
- a duplicate sign-up
- signing in again with a different email case

The on-device visual check is left to the user (Expo Go).
