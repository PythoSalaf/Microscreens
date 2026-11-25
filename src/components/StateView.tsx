import { Pressable, Text, View } from "react-native";

type Props = {
  emoji: string;
  title: string;
  body: string;
  action?: string;
  onAction?: () => void;
};

export default function StateView({
  emoji,
  title,
  body,
  action,
  onAction,
}: Props) {
  return (
    <View className="items-center justify-center px-10 pt-24">
      <Text className="text-6xl mb-4">{emoji}</Text>
      <Text className="text-xl font-bold text-white text-center">{title}</Text>
      <Text className="text-slate-400 text-center mt-2">{body}</Text>
      {action && (
        <Pressable
          onPress={onAction}
          className="mt-6 h-12 px-8 rounded-full bg-indigo-500 items-center justify-center active:opacity-80"
        >
          <Text className="text-white font-semibold">{action}</Text>
        </Pressable>
      )}
    </View>
  );
}
