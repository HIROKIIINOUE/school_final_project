import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";

type SpinnerProps = { message?: string };

export default function Spinner({
  message = "Preparing your journey...",
}: SpinnerProps) {
  const rotation = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spinAnimation = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1400,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    spinAnimation.start();
    pulseAnimation.start();

    return () => {
      spinAnimation.stop();
      pulseAnimation.stop();
    };
  }, [pulse, rotation]);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const glowScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1.15],
  });

  return (
    <View
      className="items-center justify-center gap-sm"
      accessibilityRole="progressbar"
      accessibilityLabel={message}
      accessibilityLiveRegion="polite"
    >
      <View style={styles.spinnerContainer}>
        <Animated.View
          pointerEvents="none"
          style={[
            styles.glow,
            {
              opacity: pulse.interpolate({
                inputRange: [0, 1],
                outputRange: [0.18, 0.4],
              }),
              transform: [{ scale: glowScale }],
            },
          ]}
        />

        <View style={styles.track} />

        <Animated.View
          style={[styles.spinningRing, { transform: [{ rotate: spin }] }]}
        />

        <View style={styles.iconContainer}>
          <MaterialIcons name="explore" size={32} color="#006a6a" />
        </View>
      </View>

      <Text className="font-headline-lg text-[28px] font-bold leading-[36px] tracking-tight text-on-surface text-center">
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  spinnerContainer: {
    width: 96,
    height: 96,
    alignItems: "center",
    justifyContent: "center",
  },
  glow: {
    position: "absolute",
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#4db6b6",
    shadowColor: "#4db6b6",
    shadowOpacity: 0.65,
    shadowRadius: 18,
    elevation: 8,
  },
  track: {
    position: "absolute",
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 2,
    borderColor: "rgba(115, 121, 121, 0.3)",
  },
  spinningRing: {
    position: "absolute",
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 6,
    borderColor: "#4db6b6",
    borderRightColor: "transparent",
    borderBottomColor: "transparent",
  },
  iconContainer: {
    position: "absolute",
    inset: 0,
    alignItems: "center",
    justifyContent: "center",
  },
});
