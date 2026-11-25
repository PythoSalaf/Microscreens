import { View } from "react-native";
import { SharedValue } from "react-native-reanimated";
import Dot from "./Dot";

type Props = { count: number; x: SharedValue<number>; width: number };

export default function Pagination({ count, x, width }: Props) {
  return (
    <View className="flex-row items-center justify-center">
      {Array.from({ length: count }).map((_, i) => (
        <Dot key={i} index={i} x={x} width={width} />
      ))}
    </View>
  );
}
