import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Pressable, TextInput, TextInputProps, View } from "react-native";
import Animated, {
  FadeIn,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type Props = Pick<
  TextInputProps,
  "value" | "onChangeText" | "onBlur" | "autoCapitalize" | "keyboardType"
> & {
  label: string;
  error?: string;
  secure?: boolean;
};

export default function FloatingInput({
  label,
  error,
  secure,
  value,
  onBlur,
  ...rest
}: Props) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(!!secure);
  const p = useSharedValue(value ? 1 : 0);
  const active = focused || !!value;

  useEffect(() => {
    p.value = withTiming(active ? 1 : 0, { duration: 160 });
  }, [active]);

  const labelStyle = useAnimatedStyle(() => ({
    top: interpolate(p.value, [0, 1], [20, 8]),
    fontSize: interpolate(p.value, [0, 1], [16, 12]),
  }));

  const border = error
    ? "border-red-500"
    : focused
      ? "border-indigo-500"
      : "border-slate-800";

  const labelColor = error
    ? "text-red-400"
    : focused
      ? "text-indigo-300"
      : "text-slate-500";

  return (
    <View className="mb-4">
      <View className={`relative bg-slate-900 border rounded-2xl ${border}`}>
        <Animated.Text
          pointerEvents="none"
          style={labelStyle}
          className={`absolute left-4 font-medium ${labelColor}`}
        >
          {label}
        </Animated.Text>

        <TextInput
          value={value}
          onFocus={() => setFocused(true)}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          secureTextEntry={hidden}
          autoCorrect={false}
          selectionColor="#818CF8"
          className="h-16 px-4 pt-5 text-base text-white"
          {...rest}
        />

        {secure && (
          <Pressable
            onPress={() => setHidden(!hidden)}
            hitSlop={10}
            className="absolute right-4 top-5"
          >
            <Ionicons
              name={hidden ? "eye-outline" : "eye-off-outline"}
              size={22}
              color="#64748B"
            />
          </Pressable>
        )}
      </View>

      {error && (
        <Animated.Text
          entering={FadeIn.duration(200)}
          className="text-xs text-red-400 mt-1.5 ml-2"
        >
          {error}
        </Animated.Text>
      )}
    </View>
  );
}
