import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

interface PandaProps {
  velocity?: number;
}

export function Panda({ velocity = 0 }: PandaProps) {
  const flapAnimation = useSharedValue(0);

  useEffect(() => {
    flapAnimation.value = withRepeat(
      withTiming(1, { duration: 300 }),
      -1,
      true
    );
  }, []);

  const pandaAnimatedStyle = useAnimatedStyle(() => {
    const rotation = Math.min(Math.max(velocity * 3, -30), 30);
    return {
      transform: [
        { scale: interpolate(flapAnimation.value, [0, 1], [1, 1.05]) },
        { rotate: `${rotation}deg` }
      ]
    };
  });

  return (
    <Animated.View style={[styles.container, pandaAnimatedStyle]}>
      <View style={styles.pandaBody}>
        <View style={styles.pandaHead}>
          <Text style={styles.pandaFace}>🐼</Text>
        </View>
        <View style={styles.pandaTorso}>
          <View style={styles.pandaBelly} />
        </View>
        <View style={styles.pandaArms}>
          <View style={styles.arm} />
          <View style={[styles.arm, styles.rightArm]} />
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pandaBody: {
    position: 'relative',
    width: 50,
    height: 50,
  },
  pandaHead: {
    position: 'absolute',
    top: 0,
    left: 10,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },
  pandaFace: {
    fontSize: 28,
  },
  pandaTorso: {
    position: 'absolute',
    top: 20,
    left: 12,
    width: 26,
    height: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#000000',
    zIndex: 1,
  },
  pandaBelly: {
    position: 'absolute',
    top: 3,
    left: 3,
    width: 18,
    height: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 9,
  },
  pandaArms: {
    position: 'absolute',
    top: 22,
    left: 0,
    width: 50,
    height: 16,
    zIndex: 2,
  },
  arm: {
    position: 'absolute',
    width: 12,
    height: 16,
    backgroundColor: '#000000',
    borderRadius: 6,
    left: 8,
  },
  rightArm: {
    right: 8,
    left: 'auto',
  },
});