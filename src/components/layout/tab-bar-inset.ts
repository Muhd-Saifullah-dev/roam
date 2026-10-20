import { createContext, useContext } from "react";

/**
 * Space the floating tab bar covers at the bottom of the screen (bar, its gap
 * and the bottom safe area), measured by the tabs layout. 0 outside the tabs.
 */
export const TabBarInsetContext = createContext(0);

export function useTabBarInset() {
  return useContext(TabBarInsetContext);
}
