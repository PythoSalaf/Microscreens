import { ReactNode } from "react";
import { Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

type Props = { title: string; delay?: number; children: ReactNode };

export default function SettingsSection({ title, delay = 0, children }: Props) {
  return (
    <Animated.View
      entering={FadeInDown.delay(delay).springify().damping(15)}
      className="mb-6"
    >
      <Text className="text-xs font-semibold tracking-widest text-indigo-300 mb-3 ml-2">
        {title}
      </Text>
      <View className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
        {children}
      </View>
    </Animated.View>
  );
}
