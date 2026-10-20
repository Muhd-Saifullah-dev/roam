import { BlurTargetView } from "expo-blur";
import { router, usePathname } from "expo-router";
import { TabList, TabSlot, TabTrigger, Tabs } from "expo-router/ui";
import { Calendar, House, Search, User } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Keyboard, Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { TabBarInsetContext } from "@/components/layout/tab-bar-inset";
import { TabBar, type TabBarItem } from "@/components/ui";

type TabKey = "home" | "search" | "trips" | "profile";

const items: TabBarItem<TabKey>[] = [
  { key: "home", label: "Home", icon: House, filled: true },
  { key: "search", label: "Search", icon: Search },
  { key: "trips", label: "Trips", icon: Calendar },
  { key: "profile", label: "Profile", icon: User, filled: true },
];

/**
 * Signed-in app: headless expo-router/ui tabs under Roam's floating glass
 * TabBar, the same on iOS and Android. The hidden TabList declares the routes;
 * the bar shows the tab matching the URL and switches with router.navigate.
 * Tab switches don't animate.
 */
export default function TabsLayout() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const blurTarget = useRef<View>(null);
  const [barInset, setBarInset] = useState(0);
  const keyboardOpen = useKeyboardOpen();

  const active = items.find((i) => pathname.startsWith(`/${i.key}`))?.key ?? "home";
  // Android resizes the window for the keyboard, which would lift the bar onto it.
  const hideBar = Platform.OS === "android" && keyboardOpen;

  return (
    <TabBarInsetContext value={barInset}>
      <Tabs>
        {/* Android's blur reads what's drawn inside the target; on iOS this is a plain View. */}
        <BlurTargetView ref={blurTarget} style={styles.fill}>
          <TabSlot />
        </BlurTargetView>
        <TabList style={styles.hidden}>
          {items.map((i) => (
            <TabTrigger key={i.key} name={i.key} href={`/${i.key}`} />
          ))}
        </TabList>
        {!hideBar && (
          // Measured whole (bar, gap and safe area), so screens can pad for it.
          <View
            pointerEvents="box-none"
            onLayout={(e) => setBarInset(e.nativeEvent.layout.height)}
            className="absolute inset-x-0 bottom-0"
            style={{ paddingBottom: insets.bottom }}
          >
            <View pointerEvents="box-none" className={`px-gutter ${insets.bottom > 0 ? "pb-2" : "pb-4"}`}>
              <TabBar
                items={items}
                value={active}
                onChange={(key) => router.navigate(`/${key}`)}
                blurTarget={Platform.OS === "android" ? blurTarget : undefined}
              />
            </View>
          </View>
        )}
      </Tabs>
    </TabBarInsetContext>
  );
}

function useKeyboardOpen() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", () => setOpen(true));
    const hide = Keyboard.addListener("keyboardDidHide", () => setOpen(false));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);
  return open;
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  hidden: { display: "none" },
});
