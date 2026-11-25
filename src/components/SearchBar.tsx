import { Ionicons } from "@expo/vector-icons";
import { ComponentRef, useEffect, useRef } from "react";
import { Pressable, TextInput, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

type Props = { open: boolean; value: string; onChange: (t: string) => void };

export default function SearchBar({ open, value, onChange }: Props) {
  const inputRef = useRef<ComponentRef<typeof TextInput>>(null);
  const p = useSharedValue(0);

  useEffect(() => {
    p.value = withSpring(open ? 1 : 0, { damping: 18, stiffness: 180 });
  }, [open]);

  useEffect(() => {
    if (!open) {
      inputRef.current?.blur();
      return;
    }
    const t = setTimeout(() => inputRef.current?.focus(), 150);
    return () => clearTimeout(t);
  }, [open]);

  const style = useAnimatedStyle(() => ({
    height: interpolate(p.value, [0, 1], [0, 60], Extrapolation.CLAMP),
    opacity: p.value,
  }));

  return (
    <Animated.View
      style={[style, { overflow: "hidden" }]}
      pointerEvents={open ? "auto" : "none"}
    >
      <View className="h-[52px] flex-row items-center bg-slate-900 border border-slate-800 rounded-2xl px-4">
        <Ionicons name="search" size={18} color="#64748B" />
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChange}
          placeholder="Search stories"
          placeholderTextColor="#64748B"
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
          className="flex-1 text-base text-white mx-3"
        />
        {value.length > 0 && (
          <Pressable onPress={() => onChange("")} hitSlop={10}>
            <Ionicons name="close-circle" size={18} color="#64748B" />
          </Pressable>
        )}
      </View>
    </Animated.View>
  );
}
