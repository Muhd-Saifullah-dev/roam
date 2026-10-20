// Clerk's SSO redirect (…/sso-callback) can reach Expo Router as a deep link,
// mostly on Android. The browser session already handled it, so stay put; on a
// cold start go to "/" and let the root layout's guards pick the screen.
export function redirectSystemPath({ path, initial }: { path: string; initial: boolean }) {
  try {
    if (path.includes("sso-callback")) return initial ? "/" : null;
    return path;
  } catch {
    return "/";
  }
}
