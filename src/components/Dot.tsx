import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

type Props = { index: number; x: SharedValue<number>; width: number };

export default function Dot({ index, x, width }: Props) {
  const style = useAnimatedStyle(() => {
    const input = [(index - 1) * width, index * width, (index + 1) * width];
    return {
      width: interpolate(x.value, input, [8, 28, 8], Extrapolation.CLAMP),
      opacity: interpolate(x.value, input, [0.3, 1, 0.3], Extrapolation.CLAMP),
    };
  });

  return (
    <Animated.View
      style={style}
      className="h-2 mx-1 bg-indigo-500 rounded-full"
    />
  );
}
