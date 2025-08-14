import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

const { height } = Dimensions.get('window');

interface BambooObstacleProps {
  x: Animated.SharedValue<number>;
  gapY: number;
  gapHeight: number;
}

export function BambooObstacle({ x, gapY, gapHeight }: BambooObstacleProps) {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }],
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {/* Top bamboo */}
      <View style={[styles.bamboo, { height: gapY }]} />
      
      {/* Bottom bamboo */}
      <View style={[
        styles.bamboo, 
        { 
          height: height - gapY - gapHeight - 50,
          top: gapY + gapHeight 
        }
      ]} />
      
      {/* Bamboo caps */}
      <View style={[styles.bambooCap, { top: gapY - 15 }]} />
      <View style={[styles.bambooCap, { top: gapY + gapHeight }]} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 60,
    height: '100%',
    zIndex: 5,
  },
  bamboo: {
    position: 'absolute',
    width: 60,
    backgroundColor: '#228B22',
    borderLeftWidth: 3,
    borderRightWidth: 3,
    borderColor: '#1F5F1F',
  },
  bambooCap: {
    position: 'absolute',
    width: 66,
    height: 15,
    backgroundColor: '#32CD32',
    left: -3,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#228B22',
  },
});