import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TextInput,
  Dimensions,
  Image,
} from "react-native";
import React, { useLayoutEffect } from "react";
import Animated, {
  SensorType,
  useAnimatedProps,
  useAnimatedSensor,
  useAnimatedStyle,
  useFrameCallback,
  useSharedValue,
} from "react-native-reanimated";
import Slider from "@react-native-community/slider";
import { useNavigation } from "expo-router";

const primaryColor = "#FFD61E";
const secondaryColor = "#F5F5F5";
const backgroundColor = "#232736";
const secondaryBackgroundColor = "#1B2445";

const dogThumbImage = require("../../assets/images/doge.png");

const { width } = Dimensions.get("screen");
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
Animated.addWhitelistedNativeProps({ text: true });

const AnimatedSlider = Animated.createAnimatedComponent(Slider);
Animated.addWhitelistedNativeProps({ value: true });

const SensorScreen = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLargeTitle: true,
      headerTransparent: false,
      headerTitle: "Volume",
      headerStyle: {
        backgroundColor,
      },
      headerLargeTitleStyle: {
        color: "#f7f7ff",
        fontFamily: "Poppins-Bold",
      },
    });
  }, [navigation]);

  const x = useSharedValue(50);
  const vx = useSharedValue(0);

  const animatedSensor = useAnimatedSensor(SensorType.GRAVITY);

  useFrameCallback(({ timeSincePreviousFrame: dt }) => {
    //console.log("sensor", animatedSensor.sensor.value);
    //console.log("dt", dt);
    // dt: delta time
    if (dt === null) {
      return;
    }
    const ax = animatedSensor.sensor.value.x * 0.0001; // acceleration
    vx.value += ax * dt; // velocity
    x.value += vx.value * dt;

    //console.log("x", x.value);
    x.value = Math.min(100, Math.max(0, x.value));

    if (x.value === 0 || x.value === 100) {
      vx.value = 0;
    }
  });

  const animatedProps = useAnimatedProps(() => {
    //console.log("okk>>>", x.value);
    return {
      value: x.value,
    };
  });

  const animatedTextProps = useAnimatedProps(() => {
    return {
      text: String(Math.round(x.value)),
    } as any;
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${animatedSensor.sensor.value.x}deg` }],
    };
  });

  const animatedSliderStyle = useAnimatedStyle(() => {
    return {
      width: (width * 0.75 * x.value) / 100,
    };
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={[styles.valueContainer, styles.margin]}>
        <AnimatedTextInput
          style={styles.value}
          value={String(Math.round(x.value))}
          editable={false}
          animatedProps={animatedTextProps}
        />
      </View>
      <Animated.View
        style={[styles.row, styles.center, styles.margin, animatedStyle]}
      >
        <Text style={styles.text}>0</Text>
        <Animated.View
          style={{
            width: width * 0.75,
            backgroundColor: secondaryColor,
            height: 4,
            marginHorizontal: 10,
            borderRadius: 10,
            justifyContent: "center",
          }}
        >
          <Animated.View
            style={{
              position: "absolute",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Animated.View
              style={[
                {
                  height: 4,
                  backgroundColor: primaryColor,
                  borderRadius: 10,
                },
                animatedSliderStyle,
              ]}
            />
            <Image
              source={dogThumbImage}
              style={{ width: 20, height: 20, marginLeft: -10 }}
            />
          </Animated.View>
        </Animated.View>
        <Text style={styles.text}>100</Text>
      </Animated.View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    padding: 20,
    backgroundColor,
    paddingTop: 80,
  },
  text: {
    color: secondaryColor,
    fontSize: 16,
    padding: 4,
    //fontFamily: "Poppins-Regular",
  },
  valueContainer: {
    backgroundColor: secondaryColor,
    borderRadius: 16,
    borderWidth: 1,
    width: 170,
    height: 120,
    alignSelf: "center",
    justifyContent: "center",
  },
  value: {
    textAlign: "center",
    fontWeight: "bold",
    fontVariant: ["tabular-nums"],
    fontSize: 70,
    color: backgroundColor,
  },
  margin: {
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  slider: {
    height: 40,
    alignSelf: "center",
    flex: 1,
  },
});
export default SensorScreen;
