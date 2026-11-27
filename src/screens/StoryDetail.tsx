import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as WebBrowser from "expo-web-browser";
import { FlatList, Pressable, Text, View, Platform, Share } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import BookmarkButton from "../components/BookmarkButton";
import CommentCard from "../components/CommentCard";
import SkeletonCard from "../components/SkeletonCard";
import StateView from "../components/StateView";
import { useComments } from "../hooks/useComments";
import { useHaptics } from "../hooks/useHaptics";
import { Story } from "../types/story";

type Params = {
  id: string;
  title: string;
  url: string;
  domain: string;
  author: string;
  points: string;
  comments: string;
};

export default function StoryDetail() {
  const p = useLocalSearchParams<Params>();
  const router = useRouter();
  const { tap } = useHaptics();

  const story: Story = {
    id: String(p.id),
    title: String(p.title),
    url: String(p.url),
    domain: String(p.domain),
    author: String(p.author),
    points: Number(p.points),
    comments: Number(p.comments),
  };

  const onShare = async () => {
    tap();
    try {
      await Share.share(
        Platform.OS === "ios"
          ? { message: story.title, url: story.url }
          : { message: `${story.title}\n${story.url}` },
      );
    } catch {
      // the person closed the share sheet
    }
  };
  const { comments, status, retry } = useComments(story.id);

  const header = (
    <View>
      <Animated.View entering={FadeInDown.springify().damping(14)}>
        <View className="rounded-[32px] overflow-hidden mb-4">
          <LinearGradient
            colors={["#6366F1", "#8B5CF6", "#EC4899"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ padding: 24 }}
          >
            <View className="self-start bg-white/20 rounded-full px-3 py-1.5">
              <Text className="text-xs font-bold text-white">
                {story.domain}
              </Text>
            </View>
            <Text className="text-2xl font-extrabold text-white leading-8 mt-4">
              {story.title}
            </Text>
            <View className="flex-row items-center mt-5 gap-3">
              <View className="bg-white rounded-full px-3 py-1.5">
                <Text className="text-xs font-bold text-indigo-600">
                  ▲ {story.points}
                </Text>
              </View>
              <Text className="text-sm text-white/80">💬 {story.comments}</Text>
              <Text className="text-sm text-white/70 flex-1" numberOfLines={1}>
                by {story.author}
              </Text>
            </View>
          </LinearGradient>
        </View>
      </Animated.View>

      <Pressable
        onPress={() => WebBrowser.openBrowserAsync(story.url)}
        className="h-14 rounded-full bg-indigo-500 flex-row items-center justify-center gap-2 active:opacity-80"
      >
        <Text className="text-white font-semibold text-base">Open article</Text>
        <Ionicons name="open-outline" size={18} color="#FFFFFF" />
      </Pressable>

      <Text className="text-xl font-bold text-white mt-8 mb-4">
        Top comments
      </Text>
    </View>
  );

  const empty =
    status === "loading" ? (
      <View>
        {[0, 1, 2].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </View>
    ) : status === "error" ? (
      <View className="-mt-10">
        <StateView
          emoji="📡"
          title="Couldn't load comments"
          body="Check your connection and try again."
          action="Retry"
          onAction={retry}
        />
      </View>
    ) : (
      <View className="-mt-10">
        <StateView
          emoji="💬"
          title="No comments yet"
          body="This story has no discussion yet."
        />
      </View>
    );

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <StatusBar style="light" />

      <View className="flex-row items-center justify-between px-6 pt-2 pb-4">
        <Pressable
          onPress={() => router.back()}
          className="w-11 h-11 rounded-full bg-slate-900 border border-slate-800 items-center justify-center active:opacity-80"
        >
          <Ionicons name="chevron-down" size={22} color="#E2E8F0" />
        </Pressable>
        <View className="flex-row items-center gap-3">
          <Pressable
            onPress={onShare}
            className="w-11 h-11 rounded-full bg-slate-900 border border-slate-800 items-center justify-center active:opacity-80"
          >
            <Ionicons name="share-outline" size={22} color="#E2E8F0" />
          </Pressable>
          <View className="w-11 h-11 rounded-full bg-slate-900 border border-slate-800 items-center justify-center">
            <BookmarkButton story={story} className="p-0" />
          </View>
        </View>
      </View>

      <FlatList
        data={status === "success" ? comments : []}
        keyExtractor={(c) => c.id}
        renderItem={({ item, index }) => (
          <CommentCard comment={item} index={index} />
        )}
        ListHeaderComponent={header}
        ListEmptyComponent={empty}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 32 }}
      />
    </SafeAreaView>
  );
}
