import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Topic } from "../data/topics";

type Props = {
  topics: Topic[];
  active: string;
  onChange: (id: string) => void;
};
type Layout = { x: number; w: number };

export default function TopicChips({ topics, active, onChange }: Props) {
  const [layouts, setLayouts] = useState<Record<string, Layout>>({});
  const x = useSharedValue(0);
  const w = useSharedValue(0);

  useEffect(() => {
    const l = layouts[active];
    if (!l) return;
    if (w.value === 0) {
      x.value = l.x;
      w.value = l.w;
      return;
    }
    x.value = withSpring(l.x, { damping: 18, stiffness: 180 });
    w.value = withSpring(l.w, { damping: 18, stiffness: 180 });
  }, [active, layouts]);

  const pill = useAnimatedStyle(() => ({
    width: w.value,
    transform: [{ translateX: x.value }],
  }));

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ flexGrow: 0 }}
      contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 8 }}
    >
      <View className="flex-row gap-2">
        <Animated.View
          style={pill}
          className="absolute top-0 bottom-0 left-0 rounded-full bg-indigo-500"
        />
        {topics.map((t) => {
          const on = t.id === active;
          return (
            <Pressable
              key={t.id}
              onPress={() => onChange(t.id)}
              onLayout={(e) => {
                const { x: lx, width } = e.nativeEvent.layout;
                setLayouts((prev) => ({
                  ...prev,
                  [t.id]: { x: lx, w: width },
                }));
              }}
              className={`px-4 py-2 rounded-full border ${
                on ? "border-transparent" : "border-slate-800"
              }`}
            >
              <Text
                className={`text-sm font-semibold ${on ? "text-white" : "text-slate-400"}`}
              >
                {t.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}
