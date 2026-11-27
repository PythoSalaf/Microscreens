import { Pressable, Text, View } from "react-native";

type Option<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  options: Option<T>[];
  value: T;
  onChange: (v: T) => void;
};

export default function PillSelect<T extends string>({
  options,
  value,
  onChange,
}: Props<T>) {
  return (
    <View className="flex-row flex-wrap gap-2">
      {options.map((o) => {
        const on = o.value === value;
        return (
          <Pressable
            key={o.value}
            onPress={() => onChange(o.value)}
            className={`px-4 py-2 rounded-full border ${
              on
                ? "bg-indigo-500 border-indigo-500"
                : "bg-slate-950 border-slate-800"
            }`}
          >
            <Text
              className={`text-sm font-semibold ${on ? "text-white" : "text-slate-400"}`}
            >
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
