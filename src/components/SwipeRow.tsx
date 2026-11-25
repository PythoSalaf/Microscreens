import { ReactNode } from "react";
import { Text, View, useWindowDimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const THRESHOLD = 110;

type Props = { children: ReactNode; onRemove: () => void };

export default function SwipeRow({ children, onRemove }: Props) {
  const { width } = useWindowDimensions();
  const x = useSharedValue(0);

  const pan = Gesture.Pan()
    .activeOffsetX([-12, 12])
    .failOffsetY([-12, 12])
    .onUpdate((e) => {
      x.value = Math.min(e.translationX, 0);
    })
    .onEnd(() => {
      if (x.value < -THRESHOLD) {
        x.value = withTiming(-width, { duration: 200 }, (finished) => {
          if (finished) runOnJS(onRemove)();
        });
      } else {
        x.value = withSpring(0);
      }
    });

  const row = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }],
  }));

  const hint = useAnimatedStyle(() => ({
    opacity: interpolate(x.value, [0, -THRESHOLD], [0, 1], Extrapolation.CLAMP),
    transform: [
      {
        scale: interpolate(
          x.value,
          [0, -THRESHOLD],
          [0.6, 1],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  return (
    <View>
      <Animated.View
        style={hint}
        className="absolute top-0 bottom-3 left-0 right-0 rounded-3xl bg-red-500/90 items-end justify-center pr-8"
      >
        <Text className="text-white font-bold">Remove</Text>
      </Animated.View>
      <GestureDetector gesture={pan}>
        <Animated.View style={row}>{children}</Animated.View>
      </GestureDetector>
    </View>
  );
}
