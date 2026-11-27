import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useHaptics } from "../hooks/useHaptics";
import { useSaved } from "../store/useSaved";
import { Story } from "../types/story";

type Props = { story: Story; light?: boolean; className?: string };

export default function BookmarkButton({ story, light, className }: Props) {
  const isSaved = useSaved((s) => s.saved.some((x) => x.id === story.id));
  const toggle = useSaved((s) => s.toggle);
  const { tap, success } = useHaptics();
  const scale = useSharedValue(1);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPress = () => {
    scale.value = withSequence(
      withTiming(1.45, { duration: 110 }),
      withSpring(1, { damping: 7 }),
    );
    if (isSaved) tap();
    else success();
    toggle(story);
  };

  return (
    <Pressable onPress={onPress} hitSlop={12} className={className ?? "pl-3"}>
      <Animated.View style={style}>
        <Ionicons
          name={isSaved ? "bookmark" : "bookmark-outline"}
          size={24}
          color={isSaved ? "#FB923C" : light ? "#FFFFFF" : "#64748B"}
        />
      </Animated.View>
    </Pressable>
  );
}
