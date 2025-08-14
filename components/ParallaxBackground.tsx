import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface ParallaxBackgroundProps {
  gameSpeed: Animated.SharedValue<number>;
}

export function ParallaxBackground({ gameSpeed }: ParallaxBackgroundProps) {
  const bg1X = useSharedValue(0);
  const bg2X = useSharedValue(0);
  const cloudsX = useSharedValue(0);

  useEffect(() => {
    const animateBackgrounds = () => {
      // Different layers move at different speeds for parallax effect
      bg1X.value = withRepeat(withTiming(-width, { duration: 8000 }), -1, false);
      bg2X.value = withRepeat(withTiming(-width, { duration: 12000 }), -1, false);
      cloudsX.value = withRepeat(withTiming(-width, { duration: 15000 }), -1, false);
    };

    animateBackgrounds();
  }, []);

  const bg1Style = useAnimatedStyle(() => ({
    transform: [{ translateX: bg1X.value }],
  }));

  const bg2Style = useAnimatedStyle(() => ({
    transform: [{ translateX: bg2X.value }],
  }));

  const cloudsStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: cloudsX.value }],
  }));

  return (
    <View style={styles.container}>
      {/* Sky gradient */}
      <LinearGradient
        colors={['#87CEEB', '#98FB98', '#90EE90']}
        style={styles.skyGradient}
      />
      
      {/* Clouds layer */}
      <Animated.View style={[styles.cloudsLayer, cloudsStyle]}>
        {[...Array(6)].map((_, index) => (
          <View
            key={index}
            style={[
              styles.cloud,
              {
                left: index * 200,
                top: 50 + (index % 3) * 60,
              }
            ]}
          />
        ))}
      </Animated.View>

      {/* Background bamboo layer 1 */}
      <Animated.View style={[styles.bambooLayer, bg1Style]}>
        {[...Array(20)].map((_, index) => (
          <View
            key={index}
            style={[
              styles.backgroundBamboo,
              {
                left: index * 80,
                height: 100 + (index % 4) * 50,
                opacity: 0.3,
              }
            ]}
          />
        ))}
      </Animated.View>

      {/* Background bamboo layer 2 */}
      <Animated.View style={[styles.bambooLayer, bg2Style]}>
        {[...Array(15)].map((_, index) => (
          <View
            key={index}
            style={[
              styles.backgroundBamboo,
              {
                left: index * 120,
                height: 80 + (index % 3) * 40,
                opacity: 0.2,
              }
            ]}
          />
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: width * 2,
    height: height,
  },
  skyGradient: {
    position: 'absolute',
    width: width,
    height: height,
  },
  cloudsLayer: {
    position: 'absolute',
    width: width * 2,
    height: height,
  },
  cloud: {
    position: 'absolute',
    width: 80,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 20,
  },
  bambooLayer: {
    position: 'absolute',
    width: width * 2,
    height: height,
  },
  backgroundBamboo: {
    position: 'absolute',
    width: 25,
    backgroundColor: '#228B22',
    bottom: 50,
    borderRadius: 12,
  },
});