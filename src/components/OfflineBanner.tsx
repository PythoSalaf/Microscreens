import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useOnline } from "../hooks/useOnline";

type Mode = "hidden" | "offline" | "back";

export default function OfflineBanner() {
  const online = useOnline();
  const [mode, setMode] = useState<Mode>("hidden");
  const p = useSharedValue(0);

  useEffect(() => {
    if (!online) {
      setMode("offline");
      return;
    }
    setMode((m) => (m === "offline" ? "back" : m));
  }, [online]);

  useEffect(() => {
    if (mode !== "back") return;
    const t = setTimeout(() => setMode("hidden"), 1800);
    return () => clearTimeout(t);
  }, [mode]);

  useEffect(() => {
    p.value = withSpring(mode === "hidden" ? 0 : 1, {
      damping: 18,
      stiffness: 180,
    });
  }, [mode]);

  const style = useAnimatedStyle(() => ({
    height: interpolate(p.value, [0, 1], [0, 44], Extrapolation.CLAMP),
    opacity: p.value,
  }));

  const isBack = mode === "back";

  return (
    <Animated.View style={[style, { overflow: "hidden" }]}>
      <View
        className={`h-9 mx-6 flex-row items-center justify-center rounded-full border ${
          isBack
            ? "bg-emerald-500/15 border-emerald-500/30"
            : "bg-amber-500/15 border-amber-500/30"
        }`}
      >
        <Ionicons
          name={isBack ? "checkmark-circle-outline" : "cloud-offline-outline"}
          size={16}
          color={isBack ? "#34D399" : "#FBBF24"}
        />
        <Text
          className={`text-xs font-semibold ml-2 ${isBack ? "text-emerald-300" : "text-amber-300"}`}
        >
          {isBack ? "Back online" : "You’re offline. Showing saved stories"}
        </Text>
      </View>
    </Animated.View>
  );
}
