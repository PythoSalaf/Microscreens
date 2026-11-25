import { LinearGradient } from "expo-linear-gradient";
import { Pressable, Text, View } from "react-native";
import { useOpenStory } from "../hooks/useOpenStory";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Story } from "../types/story";
import BookmarkButton from "./BookmarkButton";

export default function HeroCard({ story }: { story: Story }) {
  const open = useOpenStory();
  const { title, url, domain, points, comments } = story;
  const scale = useSharedValue(1);
  const press = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      entering={FadeInDown.springify().damping(14)}
      className="mb-5"
    >
      <Animated.View style={press}>
        <Pressable
          onPress={() => open(story)}
          onPressIn={() => (scale.value = withSpring(0.97))}
          onPressOut={() => (scale.value = withSpring(1))}
        >
          <View className="rounded-[32px] overflow-hidden">
            <LinearGradient
              colors={["#6366F1", "#8B5CF6", "#EC4899"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                padding: 24,
                minHeight: 260,
                justifyContent: "space-between",
              }}
            >
              <View className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/10" />
              <View className="absolute -bottom-12 -left-8 w-36 h-36 rounded-full bg-white/10" />

              <View className="flex-row items-center justify-between">
                <View className="bg-white/20 rounded-full px-3 py-1.5">
                  <Text className="text-xs font-bold text-white tracking-widest">
                    🔥 #1 TRENDING
                  </Text>
                </View>
                <BookmarkButton story={story} light />
              </View>

              <Text
                className="text-3xl font-extrabold text-white leading-9 mt-6"
                numberOfLines={4}
              >
                {title}
              </Text>

              <View className="flex-row items-center mt-6 gap-3">
                <View className="bg-white rounded-full px-3 py-1.5">
                  <Text className="text-xs font-bold text-indigo-600">
                    ▲ {points}
                  </Text>
                </View>
                <Text className="text-sm text-white/80">💬 {comments}</Text>
                <Text
                  className="text-sm text-white/70 flex-1"
                  numberOfLines={1}
                >
                  {domain}
                </Text>
              </View>
            </LinearGradient>
          </View>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}
