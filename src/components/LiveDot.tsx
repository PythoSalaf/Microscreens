import { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

export default function LiveDot() {
  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(withTiming(1, { duration: 1200 }), -1, false);
  }, []);

  const ring = useAnimatedStyle(() => ({
    opacity: 1 - pulse.value,
    transform: [{ scale: 1 + pulse.value * 1.8 }],
  }));

  return (
    <View className="flex-row items-center bg-slate-900 border border-slate-800 rounded-full px-3 py-1.5">
      <View className="w-2.5 h-2.5 items-center justify-center mr-2">
        <Animated.View
          style={ring}
          className="absolute w-2.5 h-2.5 rounded-full bg-emerald-400"
        />
        <View className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
      </View>
      <Text className="text-xs font-semibold text-emerald-300">LIVE</Text>
    </View>
  );
}
