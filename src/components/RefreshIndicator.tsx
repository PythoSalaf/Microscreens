import { Text } from "react-native";
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

type Props = {
  pull: SharedValue<number>;
  spin: SharedValue<number>;
  threshold: number;
};

export default function RefreshIndicator({ pull, spin, threshold }: Props) {
  const style = useAnimatedStyle(() => ({
    opacity: interpolate(
      pull.value,
      [0, threshold * 0.5],
      [0, 1],
      Extrapolation.CLAMP,
    ),
    transform: [
      {
        translateY: interpolate(
          pull.value,
          [0, threshold],
          [-40, 0],
          Extrapolation.CLAMP,
        ),
      },
      {
        scale: interpolate(
          pull.value,
          [0, threshold],
          [0.4, 1],
          Extrapolation.CLAMP,
        ),
      },
      {
        rotate: `${
          interpolate(
            pull.value,
            [0, threshold],
            [0, 180],
            Extrapolation.CLAMP,
          ) + spin.value
        }deg`,
      },
    ],
  }));

  return (
    <Animated.View
      style={style}
      className="absolute top-4 self-center w-12 h-12 rounded-full bg-orange-500 items-center justify-center"
    >
      <Text className="text-white text-xl font-bold">↓</Text>
    </Animated.View>
  );
}
