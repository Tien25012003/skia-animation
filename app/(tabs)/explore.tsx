import Ionicons from "@expo/vector-icons/Ionicons";
import {
  Blur,
  Circle,
  ColorMatrix,
  Group,
  Paint,
  SweepGradient,
  vec,
} from "@shopify/react-native-skia";
import { useMemo } from "react";
import { StyleSheet, useWindowDimensions, StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSharedValue, withSpring } from "react-native-reanimated";
import Touchable, { useGestureHandler } from "react-native-skia-gesture";

export default function TabTwoScreen() {
  const { width, height } = useWindowDimensions();
  const cx = useSharedValue(width / 2);
  const cy = useSharedValue(height / 2);

  const gestureHandler = useGestureHandler({
    onStart: (event) => {
      event.x = cx.value;
      event.y = cy.value;
    },
    onActive: (event) => {
      console.log("event", event);
      cx.value = event.translationX + width / 2;
      cy.value = event.translationY + height / 2;
    },
    onEnd: (event) => {
      cx.value = withSpring(width / 2);
      cy.value = withSpring(height / 2);
    },
  });
  const layer = useMemo(() => {
    return (
      <Paint>
        <Blur blur={30} />
        <ColorMatrix
          matrix={[
            // R, G, B, A, Bias (Offset)
            // prettier-ignore
            1, 0, 0, 0, 0,
            // prettier-ignore
            0, 1, 0, 0, 0,
            // prettier-ignore
            0, 0, 1, 0, 0,
            // prettier-ignore
            0, 0, 0, 60, -30,
          ]}
        />
      </Paint>
    );
  }, []);
  return (
    <>
      <StatusBar barStyle={"light-content"} />
      <GestureHandlerRootView>
        <Touchable.Canvas style={{ flex: 1, backgroundColor: "white" }}>
          <Group layer={layer}>
            <Touchable.Circle {...gestureHandler} cx={cx} cy={cy} r={80} />
            <Circle cx={width / 2} cy={height / 2} r={80} />
            <SweepGradient c={vec(0, 0)} colors={["cyan", "magenta", "cyan"]} />
          </Group>
        </Touchable.Canvas>
      </GestureHandlerRootView>
    </>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
