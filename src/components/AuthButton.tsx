import { ActivityIndicator, Pressable, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

type Props = { label: string; onPress: () => void; loading?: boolean };

export default function AuthButton({ label, onPress, loading }: Props) {
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      disabled={loading}
      onPress={onPress}
      onPressIn={() => (scale.value = withSpring(0.97))}
      onPressOut={() => (scale.value = withSpring(1))}
    >
      <Animated.View
        style={style}
        className="items-center justify-center bg-indigo-500 rounded-full h-14"
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text className="text-base font-semibold text-white">{label}</Text>
        )}
      </Animated.View>
    </Pressable>
  );
}
