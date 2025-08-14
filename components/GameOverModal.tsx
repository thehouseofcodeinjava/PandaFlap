import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Share } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface GameOverModalProps {
  score: number;
  highScore: number;
  onRestart: () => void;
  onHome: () => void;
}

export function GameOverModal({ score, highScore, onRestart, onHome }: GameOverModalProps) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 15 });
    opacity.value = withTiming(1, { duration: 300 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const shareScore = async () => {
    try {
      await Share.share({
        message: `🐼 I just scored ${score} points in Panda Flap! Can you beat my score? 🎯`,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const isNewHighScore = score > 0 && score === highScore;

  return (
    <View style={styles.overlay}>
      <Animated.View style={[styles.modal, animatedStyle]}>
        <Text style={styles.gameOverText}>Game Over!</Text>
        
        {isNewHighScore && (
          <Text style={styles.newRecordText}>🏆 NEW HIGH SCORE! 🏆</Text>
        )}
        
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>Score</Text>
          <Text style={styles.scoreValue}>{score}</Text>
        </View>
        
        <View style={styles.scoreContainer}>
          <Text style={styles.highScoreLabel}>Best</Text>
          <Text style={styles.highScoreValue}>{highScore}</Text>
        </View>

        {score >= 10 && (
          <View style={styles.hatReward}>
            <Text style={styles.hatText}>🎩 Hat Unlocked!</Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.restartButton} onPress={onRestart}>
            <Text style={styles.buttonText}>🔄 Play Again</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.shareButton} onPress={shareScore}>
            <Text style={styles.buttonText}>📤 Share Score</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.homeButton} onPress={onHome}>
            <Text style={styles.buttonText}>🏠 Home</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    width: width * 0.85,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  gameOverText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#D32F2F',
    marginBottom: 20,
  },
  newRecordText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 15,
    textAlign: 'center',
  },
  scoreContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  scoreLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2D5016',
  },
  highScoreLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  highScoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  hatReward: {
    backgroundColor: '#FFF8DC',
    padding: 15,
    borderRadius: 15,
    marginVertical: 15,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  hatText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#B8860B',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
  },
  restartButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 15,
    marginVertical: 8,
    alignItems: 'center',
  },
  shareButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 15,
    marginVertical: 8,
    alignItems: 'center',
  },
  homeButton: {
    backgroundColor: '#FF6B35',
    padding: 15,
    borderRadius: 15,
    marginVertical: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});