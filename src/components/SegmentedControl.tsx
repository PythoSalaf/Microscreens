import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

type Option<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  options: Option<T>[];
  value: T;
  onChange: (v: T) => void;
};

export default function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: Props<T>) {
  const w = useSharedValue(0);
  const index = options.findIndex((o) => o.value === value);
  const pos = useSharedValue(index);

  useEffect(() => {
    pos.value = withSpring(index, { damping: 18, stiffness: 180 });
  }, [index]);

  const pill = useAnimatedStyle(() => ({
    width: w.value,
    transform: [{ translateX: w.value * pos.value }],
  }));

  return (
    <View
      className="flex-row bg-slate-950 border border-slate-800 rounded-full p-1"
      onLayout={(e) => {
        w.value = (e.nativeEvent.layout.width - 10) / options.length;
      }}
    >
      <Animated.View
        style={pill}
        className="absolute top-1 bottom-1 left-1 rounded-full bg-indigo-500"
      />
      {options.map((o) => (
        <Pressable
          key={o.value}
          onPress={() => onChange(o.value)}
          className="flex-1 h-9 items-center justify-center"
        >
          <Text
            className={`text-sm font-semibold ${
              o.value === value ? "text-white" : "text-slate-400"
            }`}
          >
            {o.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
