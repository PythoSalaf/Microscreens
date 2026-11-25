import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  last?: boolean;
};

export default function ProfileRow({ icon, label, value, last }: Props) {
  return (
    <View
      className={`flex-row items-center px-4 py-4 ${last ? "" : "border-b border-slate-800"}`}
    >
      <View className="items-center justify-center w-10 h-10 mr-4 rounded-full bg-indigo-500/15">
        <Ionicons name={icon} size={18} color="#A5B4FC" />
      </View>
      <View className="flex-1">
        <Text className="text-xs text-slate-500">{label}</Text>
        <Text
          className="text-base font-medium text-white mt-0.5"
          numberOfLines={1}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}
