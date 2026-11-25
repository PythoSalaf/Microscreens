import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  Easing,
  FadeInDown,
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

type Props = { onDone: () => void };

export default function BrandSplash({ onDone }: Props) {
  const logo = useSharedValue(0);
  const ring = useSharedValue(0);
  const out = useSharedValue(1);

  useEffect(() => {
    logo.value = withSpring(1, { damping: 10, stiffness: 120 });
    ring.value = withDelay(
      250,
      withTiming(1, { duration: 900, easing: Easing.out(Easing.quad) }),
    );
    out.value = withDelay(
      1700,
      withTiming(0, { duration: 350 }, (finished) => {
        if (finished) runOnJS(onDone)();
      }),
    );
  }, []);

  const container = useAnimatedStyle(() => ({ opacity: out.value }));

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logo.value,
    transform: [
      { scale: interpolate(logo.value, [0, 1], [0.5, 1], Extrapolation.CLAMP) },
      {
        rotate: `${interpolate(logo.value, [0, 1], [-12, 0], Extrapolation.CLAMP)}deg`,
      },
    ],
  }));

  const ringStyle = useAnimatedStyle(() => ({
    opacity: interpolate(ring.value, [0, 1], [0.5, 0], Extrapolation.CLAMP),
    transform: [
      { scale: interpolate(ring.value, [0, 1], [1, 2.4], Extrapolation.CLAMP) },
    ],
  }));

  return (
    <Animated.View
      style={container}
      className="absolute inset-0 z-50 bg-slate-950 items-center justify-center"
    >
      <View className="items-center justify-center">
        <Animated.View
          style={ringStyle}
          className="absolute w-28 h-28 rounded-[32px] bg-indigo-500"
        />
        <Animated.View
          style={logoStyle}
          className="w-28 h-28 rounded-[32px] overflow-hidden"
        >
          <LinearGradient
            colors={["#4F46E5", "#8B5CF6"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Ionicons name="newspaper" size={52} color="#FFFFFF" />
          </LinearGradient>
        </Animated.View>
      </View>

      <Animated.View
        entering={FadeInDown.delay(500).springify().damping(14)}
        className="items-center mt-8"
      >
        <Text className="text-3xl font-black text-white">Microscreens</Text>
        <Text className="text-sm text-slate-400 mt-2">50 days. 50 builds.</Text>
      </Animated.View>
    </Animated.View>
  );
}
