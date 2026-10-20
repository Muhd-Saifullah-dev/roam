import { Building2, House, TreePalm, TreePine, Waves, type LucideIcon } from "lucide-react-native";
import { View } from "react-native";

import { Chip } from "@/components/ui";
import { stayTypes, type StayType } from "@/data/stays";

export type Category = "all" | StayType;

const categories: { key: Category; label: string; icon: LucideIcon }[] = [
  { key: "all", label: "All Stays", icon: House },
  { key: "cabin", label: stayTypes.cabin.plural, icon: TreePine },
  { key: "beach", label: stayTypes.beach.plural, icon: Waves },
  { key: "city", label: stayTypes.city.plural, icon: Building2 },
  { key: "villa", label: stayTypes.villa.plural, icon: TreePalm },
];

export type CategoryChipsProps = {
  value: Category;
  onChange: (category: Category) => void;
  className?: string;
};

/** The design's category row (All Stays, Cabins, Beach, City, Villas), shared by Home and Search. */
export function CategoryChips({ value, onChange, className }: CategoryChipsProps) {
  return (
    <View className={`flex-row flex-wrap gap-2 ${className ?? ""}`}>
      {categories.map((c) => (
        <Chip
          key={c.key}
          label={c.label}
          icon={c.icon}
          variant="filled"
          tone="primary"
          selected={value === c.key}
          onPress={() => onChange(c.key)}
        />
      ))}
    </View>
  );
}

export function inCategory(type: StayType, category: Category) {
  return category === "all" || type === category;
}
