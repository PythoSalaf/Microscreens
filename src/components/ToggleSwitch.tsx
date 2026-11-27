import { useEffect } from "react";
import { Pressable } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

type Props = { value: boolean; onChange: (v: boolean) => void };

export default function ToggleSwitch({ value, onChange }: Props) {
  const p = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    p.value = withSpring(value ? 1 : 0, { damping: 15, stiffness: 200 });
  }, [value]);

  const track = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(p.value, [0, 1], ["#1E293B", "#6366F1"]),
  }));

  const knob = useAnimatedStyle(() => ({
    transform: [{ translateX: p.value * 24 }],
  }));

  return (
    <Pressable onPress={() => onChange(!value)} hitSlop={8}>
      <Animated.View
        style={track}
        className="w-14 h-8 rounded-full justify-center px-1"
      >
        <Animated.View style={knob} className="w-6 h-6 rounded-full bg-white" />
      </Animated.View>
    </Pressable>
  );
}
