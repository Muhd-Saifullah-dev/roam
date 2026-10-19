import { ChevronRight, type LucideIcon } from "lucide-react-native";
import { Children, Fragment, type ReactNode } from "react";
import { Pressable, StyleSheet, View, type PressableProps } from "react-native";

import { Icon } from "./icon";
import { Text } from "./text";

/** White grouped list: rows separated by hairlines, not one card per row. */
export function ListGroup({ children, className }: { children: ReactNode; className?: string }) {
  const rows = Children.toArray(children);

  return (
    <View className={`overflow-hidden rounded-xl bg-surface ${className ?? ""}`}>
      {rows.map((row, i) => (
        <Fragment key={i}>
          {i > 0 && (
            <View className="ml-14 bg-border" style={{ height: StyleSheet.hairlineWidth }} />
          )}
          {row}
        </Fragment>
      ))}
    </View>
  );
}

export type ListRowProps = Omit<PressableProps, "children" | "style"> & {
  icon: LucideIcon;
  label: string;
  className?: string;
};

export function ListRow({ icon, label, className, ...props }: ListRowProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      className={`min-h-14 flex-row items-center gap-4 px-4 active:bg-surface-muted ${className ?? ""}`}
      {...props}
    >
      <Icon as={icon} size={22} className="text-ink" />
      <Text variant="caption" className="flex-1">
        {label}
      </Text>
      <Icon as={ChevronRight} size={18} className="text-ink" />
    </Pressable>
  );
}
