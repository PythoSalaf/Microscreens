import { ActivityIndicator, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

type Props = { loading: boolean; done: boolean };

export default function ListFooter({ loading, done }: Props) {
  if (loading) {
    return (
      <View className="items-center py-6">
        <ActivityIndicator color="#818CF8" />
      </View>
    );
  }

  if (done) {
    return (
      <Animated.View
        entering={FadeIn.duration(300)}
        className="items-center py-6"
      >
        <Text className="text-sm text-slate-500">You’re all caught up ✨</Text>
      </Animated.View>
    );
  }

  return <View className="h-6" />;
}
