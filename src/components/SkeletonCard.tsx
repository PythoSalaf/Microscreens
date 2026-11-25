import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

export default function SkeletonCard() {
  const o = useSharedValue(0.4);

  useEffect(() => {
    o.value = withRepeat(withTiming(1, { duration: 800 }), -1, true);
  }, []);

  const style = useAnimatedStyle(() => ({ opacity: o.value }));

  return (
    <Animated.View
      style={style}
      className="bg-slate-900 border border-slate-800 rounded-3xl p-4 mb-3"
    >
      <View className="h-4 w-11/12 rounded bg-slate-800" />
      <View className="h-4 w-7/12 rounded bg-slate-800 mt-2" />
      <View className="flex-row mt-4 gap-3">
        <View className="h-5 w-14 rounded-full bg-slate-800" />
        <View className="h-5 w-10 rounded-full bg-slate-800" />
      </View>
    </Animated.View>
  );
}
