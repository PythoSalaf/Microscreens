import { Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Comment } from "../types/comment";

const COLORS = [
  "bg-indigo-500",
  "bg-pink-500",
  "bg-orange-500",
  "bg-emerald-500",
  "bg-sky-500",
];

type Props = { comment: Comment; index: number };

export default function CommentCard({ comment, index }: Props) {
  const color = COLORS[comment.author.charCodeAt(0) % COLORS.length];

  return (
    <Animated.View
      entering={FadeInDown.delay(Math.min(index, 8) * 60)
        .springify()
        .damping(15)}
      className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-3"
    >
      <View className="flex-row items-center mb-3">
        <View
          className={`w-8 h-8 rounded-full items-center justify-center ${color}`}
        >
          <Text className="text-white font-bold text-sm">
            {comment.author.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text
          className="text-sm font-semibold text-slate-200 ml-3 flex-1"
          numberOfLines={1}
        >
          {comment.author}
        </Text>
        {comment.replies > 0 && (
          <Text className="text-xs text-slate-500">↳ {comment.replies}</Text>
        )}
      </View>
      <Text className="text-sm text-slate-300 leading-5" numberOfLines={8}>
        {comment.text}
      </Text>
    </Animated.View>
  );
}
