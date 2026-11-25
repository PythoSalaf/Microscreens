import {
  ImageSourcePropType,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import FloatingImage from "./FloatingImage";

type Props = {
  image: ImageSourcePropType;
  title: string;
  body: string;
  index: number;
  x: SharedValue<number>;
};

export default function Slide({ image, title, body, index, x }: Props) {
  const { width } = useWindowDimensions();

  const glow = useAnimatedStyle(() => {
    const input = [(index - 1) * width, index * width, (index + 1) * width];
    return {
      opacity: interpolate(x.value, input, [0, 1, 0], Extrapolation.CLAMP),
      transform: [
        {
          scale: interpolate(
            x.value,
            input,
            [0.4, 1, 0.4],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });

  const text = useAnimatedStyle(() => {
    const input = [(index - 0.6) * width, index * width, (index + 0.6) * width];
    return {
      opacity: interpolate(x.value, input, [0, 1, 0], Extrapolation.CLAMP),
      transform: [
        {
          translateY: interpolate(
            x.value,
            input,
            [40, 0, 40],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });

  return (
    <View style={{ width }} className="flex-1 items-center justify-center px-8">
      <View className="items-center justify-center mb-12">
        <Animated.View
          style={glow}
          className="absolute w-80 h-80 rounded-full bg-indigo-500/20"
        />
        <Animated.View
          style={glow}
          className="absolute w-56 h-56 rounded-full bg-indigo-400/10"
        />
        <FloatingImage source={image} index={index} x={x} />
      </View>
      <Animated.View style={text} className="items-center">
        <Text className="text-4xl font-extrabold text-white text-center">
          {title}
        </Text>
        <Text className="text-base text-slate-400 text-center mt-3 leading-6">
          {body}
        </Text>
      </Animated.View>
    </View>
  );
}
