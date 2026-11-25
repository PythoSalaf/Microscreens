import { Ionicons } from "@expo/vector-icons";
import { onlineManager } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  cancelAnimation,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import HeroCard from "../components/HeroCard";
import ListFooter from "../components/ListFooter";
import LiveDot from "../components/LiveDot";
import OfflineBanner from "../components/OfflineBanner";
import RefreshIndicator from "../components/RefreshIndicator";
import SearchBar from "../components/SearchBar";
import SkeletonCard from "../components/SkeletonCard";
import StateView from "../components/StateView";
import StoryCard from "../components/StoryCard";
import TopicChips from "../components/TopicChips";
import { TOPICS } from "../data/topics";
import { useDebounce } from "../hooks/useDebounce";
import { useStories } from "../hooks/useStories";

const THRESHOLD = 90;
const MAX_PULL = 140;

export default function Feed() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [topicId, setTopicId] = useState("top");

  const debounced = useDebounce(search, 400);
  const topic = TOPICS.find((t) => t.id === topicId) ?? TOPICS[0];

  const {
    stories,
    status,
    reload,
    retry,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useStories(debounced, topic.query);

  const pull = useSharedValue(0);
  const spin = useSharedValue(0);
  const busy = useSharedValue(false);
  const scrollY = useSharedValue(0);
  const startY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });

  const finish = () => {
    cancelAnimation(spin);
    spin.value = 0;
    pull.value = withSpring(0);
    busy.value = false;
  };

  const refresh = async () => {
    const wait = new Promise((r) => setTimeout(r, 900));
    if (onlineManager.isOnline()) {
      await Promise.all([reload(), wait]);
    } else {
      await wait;
    }
    finish();
  };

  const toggleSearch = () => {
    if (searchOpen) setSearch("");
    setSearchOpen(!searchOpen);
  };

  const pan = Gesture.Pan()
    .manualActivation(true)
    .onTouchesDown((e) => {
      startY.value = e.allTouches[0].absoluteY;
    })
    .onTouchesMove((e, state) => {
      const dy = e.allTouches[0].absoluteY - startY.value;
      if (busy.value || scrollY.value > 0 || dy < -8) {
        state.fail();
      } else if (dy > 8) {
        state.activate();
      }
    })
    .onUpdate((e) => {
      pull.value = Math.min(Math.max(e.translationY * 0.5, 0), MAX_PULL);
    })
    .onEnd(() => {
      if (pull.value >= THRESHOLD) {
        busy.value = true;
        pull.value = withSpring(70);
        spin.value = withRepeat(
          withTiming(360, { duration: 700, easing: Easing.linear }),
          -1,
          false,
        );
        runOnJS(refresh)();
      } else {
        pull.value = withSpring(0);
      }
    });

  const list = useAnimatedStyle(() => ({
    transform: [{ translateY: pull.value }],
  }));

  const today = new Date()
    .toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    })
    .toUpperCase();

  const showHero = topic.id === "top" && !debounced.trim();

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-slate-950">
      <StatusBar style="light" />

      <View className="flex-row items-end justify-between px-6 pt-4 pb-3">
        <View>
          <Text className="text-xs font-semibold tracking-widest text-indigo-300">
            {today}
          </Text>
          <Text className="mt-1 text-4xl font-black text-white">Tech News</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <LiveDot />
          <Pressable
            onPress={toggleSearch}
            className="items-center justify-center w-10 h-10 border rounded-full bg-slate-900 border-slate-800 active:opacity-80"
          >
            <Ionicons
              name={searchOpen ? "close" : "search"}
              size={20}
              color="#E2E8F0"
            />
          </Pressable>
        </View>
      </View>

      <View className="px-6">
        <SearchBar open={searchOpen} value={search} onChange={setSearch} />
      </View>

      <TopicChips topics={TOPICS} active={topic.id} onChange={setTopicId} />

      <OfflineBanner />

      <View className="flex-1">
        <RefreshIndicator pull={pull} spin={spin} threshold={THRESHOLD} />
        <GestureDetector gesture={pan}>
          <Animated.View style={list} className="flex-1">
            {status === "loading" && (
              <View className="px-6 pt-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </View>
            )}

            {status === "error" && (
              <StateView
                emoji="📡"
                title="Couldn't load stories"
                body="Check your connection and try again."
                action="Retry"
                onAction={retry}
              />
            )}

            {status === "success" && stories.length === 0 && (
              <StateView
                emoji="🔎"
                title={
                  debounced.trim()
                    ? `No results for “${debounced.trim()}”`
                    : "Nothing here yet"
                }
                body={
                  debounced.trim()
                    ? "Try a different keyword or topic."
                    : "Pull down to refresh."
                }
              />
            )}

            {status === "success" && stories.length > 0 && (
              <Animated.FlatList
                data={stories}
                keyExtractor={(s) => s.id}
                renderItem={({ item, index }) =>
                  index === 0 && showHero ? (
                    <HeroCard story={item} />
                  ) : (
                    <StoryCard story={item} index={index} />
                  )
                }
                onScroll={onScroll}
                scrollEventThrottle={16}
                onEndReached={() => {
                  if (hasNextPage && !isFetchingNextPage) fetchNextPage();
                }}
                onEndReachedThreshold={0.6}
                ListFooterComponent={
                  <ListFooter
                    loading={isFetchingNextPage}
                    done={!hasNextPage}
                  />
                }
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{
                  paddingHorizontal: 24,
                  paddingTop: 16,
                  paddingBottom: 32,
                }}
              />
            )}
          </Animated.View>
        </GestureDetector>
      </View>
    </SafeAreaView>
  );
}
