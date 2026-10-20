import { useMemo } from "react";
import { View } from "react-native";
import Animated, { LayoutAnimationConfig, useReducedMotion } from "react-native-reanimated";

import { StayCard } from "@/components/ui";
import type { Stay } from "@/data/stays";

import { listEnter, listExit, listReflow, resultEnter } from "./list-motion";
import { stayLocation } from "./stay-location";

export type StayListProps = {
  stays: Stay[];
  /**
   * "browse": already there on first show; cards fade and reflow when the list changes (Home).
   * "results": new results rise in, a beat apart, as the guest asked for them (Search).
   */
  motion?: "browse" | "results";
  className?: string;
};

/** Big photo stay cards, as on Home. */
export function StayList({ stays, motion = "browse", className }: StayListProps) {
  const list = (
    <View className={`gap-5 ${className ?? ""}`}>
      {stays.map((stay, i) => (
        <Row key={stay.id} stay={stay} index={i} staggered={motion === "results"} />
      ))}
    </View>
  );

  return motion === "browse" ? <LayoutAnimationConfig skipEntering>{list}</LayoutAnimationConfig> : list;
}

function Row({ stay, index, staggered }: { stay: Stay; index: number; staggered: boolean }) {
  const reduced = useReducedMotion();
  // Memoized per row: an inline builder would be rebuilt on every keystroke.
  const entering = useMemo(
    () => (staggered ? resultEnter(index, reduced) : listEnter),
    [staggered, index, reduced],
  );

  return (
    <Animated.View entering={entering} exiting={listExit} layout={listReflow}>
      <StayCard title={stay.title} location={stayLocation(stay)} rating={stay.rating} imageUrl={stay.imageUrl} />
    </Animated.View>
  );
}
