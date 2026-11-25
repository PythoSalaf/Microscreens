import { Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import Animated, { LinearTransition } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import StateView from "../components/StateView";
import StoryCard from "../components/StoryCard";
import SwipeRow from "../components/SwipeRow";
import { useSaved } from "../store/useSaved";

export default function Saved() {
  const saved = useSaved((s) => s.saved);
  const remove = useSaved((s) => s.remove);

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-slate-950">
      <StatusBar style="light" />

      <View className="px-6 pt-4 pb-4">
        <Text className="text-xs font-semibold tracking-widest text-indigo-300">
          YOUR READING LIST
        </Text>
        <Text className="text-4xl font-black text-white mt-1">Saved</Text>
        {saved.length > 0 && (
          <Text className="text-slate-400 mt-1">Swipe left to remove</Text>
        )}
      </View>

      {saved.length === 0 ? (
        <StateView
          emoji="🔖"
          title="No saved stories"
          body="Tap the bookmark on any story to keep it here."
        />
      ) : (
        <Animated.FlatList
          data={saved}
          keyExtractor={(s) => s.id}
          itemLayoutAnimation={LinearTransition.springify().damping(16)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 32 }}
          renderItem={({ item, index }) => (
            <SwipeRow onRemove={() => remove(item.id)}>
              <StoryCard story={item} index={index} showRank={false} />
            </SwipeRow>
          )}
        />
      )}
    </SafeAreaView>
  );
}
