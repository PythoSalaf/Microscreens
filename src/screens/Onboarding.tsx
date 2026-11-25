import { useRef, useState } from "react";
import { Pressable, Text, View, useWindowDimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "../store/useAuth";
import { useRouter } from "expo-router";
import Animated, {
  interpolateColor,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import Slide from "../components/Slide";
import Pagination from "../components/Pagination";
import { slides } from "../data/slides";

export default function Onboarding() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const x = useSharedValue(0);
  const listRef = useRef<Animated.FlatList<(typeof slides)[number]>>(null);
  const [index, setIndex] = useState(0);
  const isLast = index === slides.length - 1;

  const inputRange = slides.map((_, i) => i * width);
  const colors = slides.map((s) => s.bg);
  const finishOnboarding = useAuth((s) => s.finishOnboarding);

  const onScroll = useAnimatedScrollHandler((e) => {
    x.value = e.contentOffset.x;
  });

  const bg = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(x.value, inputRange, colors),
  }));

  const next = () => {
    if (isLast) {
      finishOnboarding();
      router.replace("/login");
      return;
    }
    listRef.current?.scrollToIndex({ index: index + 1 });
  };

  const skip = () => {
    finishOnboarding();
    router.replace("/login");
  };

  return (
    <Animated.View style={bg} className="flex-1">
      <StatusBar style="light" />
      <SafeAreaView className="flex-1">
        <View className="items-end justify-center h-12 px-6">
          {!isLast && (
            <Pressable onPress={skip} hitSlop={12}>
              <Text className="font-medium text-slate-400">Skip</Text>
            </Pressable>
          )}
        </View>

        <Animated.FlatList
          ref={listRef}
          data={slides}
          keyExtractor={(s) => s.id}
          renderItem={({ item, index: i }) => (
            <Slide {...item} index={i} x={x} />
          )}
          horizontal
          pagingEnabled
          bounces={false}
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          getItemLayout={(_, i) => ({
            length: width,
            offset: width * i,
            index: i,
          })}
          onMomentumScrollEnd={(e) =>
            setIndex(Math.round(e.nativeEvent.contentOffset.x / width))
          }
        />

        <View className="gap-6 px-8 pb-8">
          <Pagination count={slides.length} x={x} width={width} />
          <Pressable
            onPress={next}
            className="items-center justify-center bg-indigo-500 rounded-full h-14 active:opacity-80"
          >
            <Text className="text-base font-semibold text-white">
              {isLast ? "Read the news" : "Next"}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
}
