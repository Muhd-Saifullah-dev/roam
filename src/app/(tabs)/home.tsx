import { useUser } from "@clerk/expo";
import { router } from "expo-router";
import { Search } from "lucide-react-native";
import { useState } from "react";
import { Keyboard, View } from "react-native";

import { TabScreen } from "@/components/layout/tab-screen";
import { CategoryChips, inCategory, type Category } from "@/components/stays/category-chips";
import { StayList } from "@/components/stays/stay-list";
import { Avatar, Icon, PressableScale, SearchBar, Text, Wordmark } from "@/components/ui";
import { stays } from "@/data/stays";

/** Opens the Search tab. `t` makes each request new, so Search reacts to repeats. */
function openSearch(params: { q?: string; focus?: "1" }) {
  router.navigate({ pathname: "/search", params: { ...params, t: String(Date.now()) } });
}

export default function HomeScreen() {
  const { user } = useUser();
  const [sentence, setSentence] = useState("");
  const [category, setCategory] = useState<Category>("all");

  const name = user?.fullName ?? user?.primaryEmailAddress?.emailAddress ?? "Guest";
  const visible = stays.filter((s) => inCategory(s.type, category));

  const submit = () => {
    const q = sentence.trim();
    Keyboard.dismiss();
    openSearch(q ? { q } : { focus: "1" });
  };

  return (
    <TabScreen>
      <View className="flex-row items-start justify-between">
        <View className="pt-6">
          <Wordmark height={32} />
        </View>
        <Avatar name={name} uri={user?.hasImage ? user.imageUrl : undefined} />
      </View>

      <View className="mt-3 flex-row items-center gap-4">
        <View className="flex-1 gap-1">
          <Text variant="subtitle" tone="secondary">
            {user?.firstName ? `Hey, ${user.firstName} 👋` : "Hey there 👋"}
          </Text>
          <Text variant="headline">Find your next stay</Text>
        </View>
        <PressableScale
          accessibilityLabel="Open search"
          onPress={() => openSearch({ focus: "1" })}
          className="h-search-tall w-16 items-center justify-center rounded-2xl bg-surface-muted"
        >
          <Icon as={Search} size={28} className="text-ink" />
        </PressableScale>
      </View>

      <SearchBar
        className="mt-6"
        value={sentence}
        onChangeText={setSentence}
        placeholder="quiet pet friendly cabin with hot tub"
        onSubmit={submit}
      />

      <CategoryChips className="mt-5" value={category} onChange={setCategory} />

      {/* Cards are already there when Home opens; they only fade and reflow when a chip changes them. */}
      <StayList className="mt-8" stays={visible} />
      {visible.length === 0 && (
        <Text variant="body" tone="secondary" className="py-10 text-center">
          No stays in this category yet.
        </Text>
      )}
    </TabScreen>
  );
}
