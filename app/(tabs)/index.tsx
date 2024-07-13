import { Image, StyleSheet, Platform, View, Text } from "react-native";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  PADDING,
  SQUARES_AMOUNT_HORIZONTAL,
  SQUARES_AMOUNT_VERTICAL,
  SQUARE_CONTAINER_SIZE,
  SQUARE_SIZE,
} from "@/constants/ShapeSize";
import { useSharedValue, withTiming } from "react-native-reanimated";
import {
  Canvas,
  Group,
  SweepGradient,
  useTouchHandler,
  vec,
} from "@shopify/react-native-skia";
import RoundedItem from "@/components/RoundedItem";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function HomeScreen() {
  const touchedPoint = useSharedValue<{ x: number; y: number } | null>(null);
  const progress = useSharedValue(0);
  const touchHandler = useTouchHandler({
    onStart: (event) => {
      progress.value = withTiming(1, { duration: 300 });
      touchedPoint.value = { x: event.x, y: event.y };
    },
    onActive: (event) => {
      console.log("event", event);
      touchedPoint.value = { x: event.x, y: event.y };
    },
    onEnd: (event) => {
      progress.value = withTiming(0, { duration: 300 });
      touchedPoint.value = null;
    },
  });
  return (
    <GestureHandlerRootView style={styles.container}>
      <Canvas
        style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
        onTouch={touchHandler}
      >
        <Group>
          {new Array(SQUARES_AMOUNT_HORIZONTAL).fill(0).map((_, i) => {
            return new Array(SQUARES_AMOUNT_VERTICAL).fill(0).map((_, j) => {
              return (
                <RoundedItem
                  progress={progress}
                  point={touchedPoint}
                  key={`i${i}-j${j}`}
                  x={i * SQUARE_CONTAINER_SIZE + PADDING / 2}
                  y={j * SQUARE_CONTAINER_SIZE + PADDING / 2}
                  width={SQUARE_SIZE}
                  height={SQUARE_SIZE}
                />
              );
            });
          })}
          <SweepGradient
            c={vec(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2)}
            colors={["cyan", "magenta", "yellow", "cyan"]}
          />
        </Group>
      </Canvas>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
});
