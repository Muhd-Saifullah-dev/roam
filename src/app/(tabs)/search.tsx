import { useLocalSearchParams } from "expo-router";
import { SearchX } from "lucide-react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import { Keyboard, View, type TextInput } from "react-native";

import { TabScreen } from "@/components/layout/tab-screen";
import { CategoryChips, inCategory, type Category } from "@/components/stays/category-chips";
import { querySummary } from "@/components/stays/query-summary";
import { StayList } from "@/components/stays/stay-list";
import { Icon, SearchBar, Text } from "@/components/ui";
import { stays } from "@/data/stays";
import { parseQuery, searchStays } from "@/lib/search";

type Params = { q?: string; focus?: string; t?: string };

export default function SearchScreen() {
  const { q, focus, t } = useLocalSearchParams<Params>();
  const inputRef = useRef<TextInput>(null);
  const [text, setText] = useState(q ?? "");
  const [category, setCategory] = useState<Category>("all");
  const [request, setRequest] = useState(t);

  // Each request from Home carries a new `t`: its sentence replaces the field
  // and the chips start again from All Stays.
  if (t !== request) {
    setRequest(t);
    setText(q ?? "");
    setCategory("all");
  }

  useEffect(() => {
    if (!t || !focus) return;
    // Wait for the tab switch to settle, or the keyboard can miss the focus.
    const timer = setTimeout(() => inputRef.current?.focus(), 350);
    return () => clearTimeout(timer);
  }, [t, focus]);

  const hasQuery = text.trim().length > 0;
  const parsed = useMemo(() => parseQuery(text), [text]);
  // An empty sentence browses every stay; a sentence filters and ranks them.
  const matches = useMemo(
    () => (hasQuery ? searchStays(stays, parsed).map((m) => m.stay) : stays),
    [hasQuery, parsed],
  );
  const visible = matches.filter((s) => inCategory(s.type, category));
  const summary = [
    `${visible.length} ${visible.length === 1 ? "stay" : "stays"}`,
    ...(hasQuery ? querySummary(parsed) : []),
  ].join(" · ");

  return (
    <TabScreen>
      <Text variant="headline">Search</Text>
      <SearchBar
        ref={inputRef}
        className="mt-6"
        value={text}
        onChangeText={setText}
        placeholder="Describe your stay"
        onSubmit={() => Keyboard.dismiss()}
      />
      <CategoryChips className="mt-5" value={category} onChange={setCategory} />

      {/* What the sentence was understood as, so the guest sees why these stays match. */}
      <Text variant="caption" tone="secondary" weight="regular" className="mt-6">
        {summary}
      </Text>

      {visible.length > 0 ? (
        <StayList className="mt-4" stays={visible} motion="results" />
      ) : (
        <NoResults filtered={hasQuery || category !== "all"} />
      )}
    </TabScreen>
  );
}

function NoResults({ filtered }: { filtered: boolean }) {
  return (
    <View className="items-center gap-3 px-4 py-10">
      <View className="h-16 w-16 items-center justify-center rounded-full bg-surface-muted">
        <Icon as={SearchX} size={28} className="text-ink" />
      </View>
      <Text variant="title" className="text-center">
        No stays match
      </Text>
      <Text variant="body" tone="secondary" className="text-center">
        {filtered
          ? "Nothing fits all of that. Try All Stays, a higher budget or fewer amenities."
          : "Try naming a type of stay, a place, a budget or what you'd like nearby."}
      </Text>
    </View>
  );
}
