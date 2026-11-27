import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHaptics } from "../hooks/useHaptics";
import { useSaved } from "../store/useSaved";

const ICONS: Record<
  string,
  {
    on: keyof typeof Ionicons.glyphMap;
    off: keyof typeof Ionicons.glyphMap;
    label: string;
  }
> = {
  feed: { on: "newspaper", off: "newspaper-outline", label: "Feed" },
  saved: { on: "bookmark", off: "bookmark-outline", label: "Saved" },
  profile: { on: "person", off: "person-outline", label: "Profile" },
};

type TabBarProps = {
  state: { index: number; routes: { key: string; name: string }[] };
  emitter: { emit: (event: any) => any };
  navigateToTab: (routeKey: string) => void;
};

function Badge() {
  const count = useSaved((s) => s.saved.length);
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSequence(
      withTiming(1.5, { duration: 110 }),
      withSpring(1, { damping: 7 }),
    );
  }, [count]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (count === 0) return null;

  return (
    <Animated.View
      style={style}
      className="absolute -top-2 -right-3 min-w-[18px] h-[18px] px-1 rounded-full bg-orange-500 items-center justify-center"
    >
      <Text className="text-[10px] font-bold text-white">
        {count > 99 ? "99+" : count}
      </Text>
    </Animated.View>
  );
}

function TabItem({
  name,
  focused,
  onPress,
}: {
  name: string;
  focused: boolean;
  onPress: () => void;
}) {
  const icon = ICONS[name];
  const scale = useSharedValue(1);

  useEffect(() => {
    if (focused) {
      scale.value = withSequence(
        withTiming(1.3, { duration: 120 }),
        withSpring(1, { damping: 8 }),
      );
    }
  }, [focused]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const color = focused ? "#A5B4FC" : "#64748B";

  return (
    <Pressable onPress={onPress} className="items-center justify-center flex-1">
      <Animated.View style={style} className="items-center">
        <View>
          <Ionicons
            name={focused ? icon.on : icon.off}
            size={24}
            color={color}
          />
          {name === "saved" && <Badge />}
        </View>
        <Text style={{ color }} className="mt-1 text-xs font-semibold">
          {icon.label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

export default function TabBar({ state, emitter, navigateToTab }: TabBarProps) {
  const { tap } = useHaptics();
  const insets = useSafeAreaInsets();
  const tabW = useSharedValue(0);
  const pos = useSharedValue(state.index);

  useEffect(() => {
    pos.value = withSpring(state.index, { damping: 16, stiffness: 160 });
  }, [state.index]);

  const indicator = useAnimatedStyle(() => ({
    width: tabW.value,
    transform: [{ translateX: tabW.value * pos.value }],
  }));

  return (
    <View
      style={{ paddingBottom: Math.max(insets.bottom, 8) }}
      className="px-4 pt-2 border-t bg-slate-900 border-slate-800"
    >
      <View
        className="flex-row h-16"
        onLayout={(e) => {
          tabW.value = e.nativeEvent.layout.width / state.routes.length;
        }}
      >
        <Animated.View
          style={indicator}
          className="absolute top-0 bottom-0 left-0"
        >
          <View className="flex-1 mx-3 rounded-2xl bg-indigo-500/20" />
        </Animated.View>

        {state.routes.map((route, i) => {
          const focused = state.index === i;
          const onPress = () => {
            const event = emitter.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              tap();
              navigateToTab(route.key);
            }
          };
          return (
            <TabItem
              key={route.key}
              name={route.name}
              focused={focused}
              onPress={onPress}
            />
          );
        })}
      </View>
    </View>
  );
}
