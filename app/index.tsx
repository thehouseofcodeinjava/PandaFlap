import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming,
  interpolate
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function StartScreen() {
  const router = useRouter();
  const [highScore, setHighScore] = useState(0);
  const bounceAnim = useSharedValue(0);
  const floatAnim = useSharedValue(0);

  useEffect(() => {
    loadHighScore();
    // Start animations
    if (Platform.OS !== 'web') {
      bounceAnim.value = withRepeat(withTiming(1, { duration: 2000 }), -1, true);
      floatAnim.value = withRepeat(withTiming(1, { duration: 1500 }), -1, true);
    }
  }, []);

  const loadHighScore = async () => {
    try {
      if (Platform.OS !== 'web') {
        const AsyncStorage = await import('@react-native-async-storage/async-storage');
        const score = await AsyncStorage.default.getItem('highScore');
        if (score) setHighScore(parseInt(score));
      }
    } catch (error) {
      console.log('Error loading high score:', error);
    }
  };

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{
      scale: interpolate(bounceAnim.value, [0, 1], [1, 1.1])
    }]
  }));

  const pandaAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{
      translateY: interpolate(floatAnim.value, [0, 1], [-10, 10])
    }]
  }));

  return (
    <LinearGradient
      colors={['#87CEEB', '#98FB98', '#90EE90']}
      style={styles.container}
    >
      {/* Background Bamboo */}
      <View style={styles.backgroundBamboo}>
        {[...Array(8)].map((_, index) => (
          <View key={index} style={[styles.bamboo, { left: (index * 60) % width }]} />
        ))}
      </View>

      <View style={styles.content}>
        <Animated.View style={[styles.titleContainer, titleAnimatedStyle]}>
          <Text style={styles.title}>🐼 PANDA FLAP</Text>
          <Text style={styles.subtitle}>Bamboo Forest Adventure</Text>
        </Animated.View>

        <Animated.View style={[styles.pandaContainer, pandaAnimatedStyle]}>
          <Text style={styles.panda}>🐼</Text>
        </Animated.View>

        <View style={styles.gameInfo}>
          <Text style={styles.highScoreText}>High Score: {highScore}</Text>
          <Text style={styles.instructions}>Tap to flap your way through the bamboo forest!</Text>
        </View>

        <TouchableOpacity 
          style={styles.startButton}
          onPress={() => router.push('/game')}
        >
          <Text style={styles.startButtonText}>TAP TO START</Text>
        </TouchableOpacity>

        <View style={styles.features}>
          <Text style={styles.featureText}>🎯 Endless Adventure</Text>
          <Text style={styles.featureText}>🎩 Collect Hats</Text>
          <Text style={styles.featureText}>🏆 Beat Your Best</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundBamboo: {
    position: 'absolute',
    width: width,
    height: height,
    opacity: 0.3,
  },
  bamboo: {
    position: 'absolute',
    width: 20,
    height: '100%',
    backgroundColor: '#228B22',
    top: 0,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#2D5016',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: '#5D7C47',
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '600',
  },
  pandaContainer: {
    marginBottom: 50,
  },
  panda: {
    fontSize: 80,
  },
  gameInfo: {
    alignItems: 'center',
    marginBottom: 40,
  },
  highScoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D5016',
    marginBottom: 10,
  },
  instructions: {
    fontSize: 16,
    color: '#5D7C47',
    textAlign: 'center',
    lineHeight: 22,
  },
  startButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    marginBottom: 30,
  },
  startButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  features: {
    alignItems: 'center',
  },
  featureText: {
    fontSize: 16,
    color: '#5D7C47',
    marginVertical: 4,
    fontWeight: '500',
  },
});