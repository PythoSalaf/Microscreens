import { useEffect } from "react";
import { ImageSourcePropType, useWindowDimensions } from "react-native";
import Animated, {
  Easing,
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

type Props = {
  source: ImageSourcePropType;
  index: number;
  x: SharedValue<number>;
};

export default function FloatingImage({ source, index, x }: Props) {
  const { width } = useWindowDimensions();
  const float = useSharedValue(0);

  useEffect(() => {
    float.value = withRepeat(
      withTiming(1, { duration: 2200, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, []);

  const style = useAnimatedStyle(() => {
    const input = [(index - 1) * width, index * width, (index + 1) * width];
    return {
      opacity: interpolate(x.value, input, [0, 1, 0], Extrapolation.CLAMP),
      transform: [
        {
          translateX: interpolate(
            x.value,
            input,
            [width * 0.5, 0, -width * 0.5],
            Extrapolation.CLAMP,
          ),
        },
        { translateY: interpolate(float.value, [0, 1], [-10, 10]) },
        {
          scale: interpolate(
            x.value,
            input,
            [0.6, 1, 0.6],
            Extrapolation.CLAMP,
          ),
        },
        {
          rotate: `${interpolate(x.value, input, [-25, 0, 25], Extrapolation.CLAMP)}deg`,
        },
      ],
    };
  });

  return (
    <Animated.Image
      source={source}
      resizeMode="contain"
      style={style}
      className="w-72 h-72"
    />
  );
}
