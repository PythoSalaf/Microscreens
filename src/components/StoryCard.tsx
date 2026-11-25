import { Pressable, Text, View } from "react-native";
import { useOpenStory } from "../hooks/useOpenStory";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Story } from "../types/story";
import { usePrefetchComments } from "../hooks/usePrefetchComments";
import BookmarkButton from "./BookmarkButton";

type Props = { story: Story; index: number; showRank?: boolean };

export default function StoryCard({ story, index, showRank = true }: Props) {
  const prefetch = usePrefetchComments();
  const open = useOpenStory();
  const { title, url, domain, points, comments } = story;
  const scale = useSharedValue(1);
  const press = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(Math.min(index, 8) * 70)
        .springify()
        .damping(15)}
      className="mb-3"
    >
      <Animated.View style={press}>
        <Pressable
          onPress={() => open(story)}
          onPressIn={() => {
            scale.value = withSpring(0.97);
            prefetch(story.id);
          }}
          onPressOut={() => (scale.value = withSpring(1))}
          className="flex-row items-center bg-slate-900 border border-slate-800 rounded-3xl px-4 py-5 min-h-[104px]"
        >
          {showRank && (
            <Text className="text-4xl font-black text-slate-700 w-14">
              {String(index + 1).padStart(2, "0")}
            </Text>
          )}
          <View className="justify-center flex-1">
            <Text
              className="text-base font-semibold leading-6 text-white"
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {title}
            </Text>
            <View className="flex-row items-center gap-3 mt-3">
              <View className="bg-orange-500/15 rounded-full px-2.5 py-1">
                <Text className="text-xs font-bold text-orange-400">
                  ▲ {points}
                </Text>
              </View>
              <Text className="text-xs text-slate-400">💬 {comments}</Text>
              <Text
                className="flex-1 text-xs text-indigo-300"
                numberOfLines={1}
              >
                {domain}
              </Text>
            </View>
          </View>
          <BookmarkButton story={story} />
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}
