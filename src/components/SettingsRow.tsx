import { Ionicons } from "@expo/vector-icons";
import { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

type Icon = keyof typeof Ionicons.glyphMap;

type Props = {
  icon: Icon;
  title: string;
  subtitle?: string;
  stacked?: boolean;
  last?: boolean;
  danger?: boolean;
  onPress?: () => void;
  children?: ReactNode;
};

export default function SettingsRow({
  icon,
  title,
  subtitle,
  stacked,
  last,
  danger,
  onPress,
  children,
}: Props) {
  return (
    <Pressable
      disabled={!onPress}
      onPress={onPress}
      className={`px-4 py-4 active:bg-slate-800/50 ${last ? "" : "border-b border-slate-800"}`}
    >
      <View className="flex-row items-center">
        <View
          className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${
            danger ? "bg-red-500/15" : "bg-indigo-500/15"
          }`}
        >
          <Ionicons
            name={icon}
            size={18}
            color={danger ? "#F87171" : "#A5B4FC"}
          />
        </View>

        <View className="flex-1">
          <Text
            className={`text-base font-semibold ${danger ? "text-red-400" : "text-white"}`}
          >
            {title}
          </Text>
          {subtitle && (
            <Text className="text-xs text-slate-500 mt-0.5">{subtitle}</Text>
          )}
        </View>

        {!stacked && children}
        {!stacked && !children && onPress && (
          <Ionicons name="chevron-forward" size={18} color="#475569" />
        )}
      </View>

      {stacked && <View className="mt-4">{children}</View>}
    </Pressable>
  );
}
