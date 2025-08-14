import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameEngine } from '@/components/GameEngine';
import { GameOverModal } from '@/components/GameOverModal';
import { AudioManager } from '@/utils/AudioManager';

const { width, height } = Dimensions.get('window');

export default function GameScreen() {
  const router = useRouter();
  const [gameState, setGameState] = useState<'playing' | 'gameOver'>('playing');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const gameEngineRef = useRef<any>(null);

  // Audio manager
  const audioManager = useRef(new AudioManager()).current;

  useEffect(() => {
    loadHighScore();
    if (Platform.OS !== 'web') {
      audioManager.initialize().then(() => {
        audioManager.playBackgroundMusic();
      });
    }
    return () => {
      audioManager.stopAll();
    };
  }, []);

  const loadHighScore = async () => {
    try {
      if (Platform.OS !== 'web') {
        const savedScore = await AsyncStorage.getItem('highScore');
        if (savedScore) setHighScore(parseInt(savedScore));
      }
    } catch (error) {
      console.log('Error loading high score:', error);
    }
  };

  const saveHighScore = async (newScore: number) => {
    try {
      if (Platform.OS !== 'web' && newScore > highScore) {
        await AsyncStorage.setItem('highScore', newScore.toString());
        setHighScore(newScore);
      }
    } catch (error) {
      console.log('Error saving high score:', error);
    }
  };

  const handleGameOver = (finalScore: number) => {
    setGameState('gameOver');
    saveHighScore(finalScore);
    if (Platform.OS !== 'web') {
      audioManager.playGameOver();
    }
  };

  const handleScore = (newScore: number) => {
    setScore(newScore);
    if (Platform.OS !== 'web') {
      audioManager.playScore();
    }
  };

  const handleFlap = () => {
    if (!isMuted && Platform.OS !== 'web') {
      audioManager.playFlap();
    }
  };

  const restartGame = () => {
    setGameState('playing');
    setScore(0);
    gameEngineRef.current?.restart();
    if (Platform.OS !== 'web') {
      audioManager.playBackgroundMusic();
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (Platform.OS !== 'web') {
      audioManager.toggleMute();
    }
  };

  const goHome = () => {
    router.push('/');
  };

  return (
    <View style={styles.container}>
      <GameEngine
        ref={gameEngineRef}
        onGameOver={handleGameOver}
        onScore={handleScore}
        onFlap={handleFlap}
        gameState={gameState}
        onRestart={restartGame}
      />
      
      {/* UI Overlay */}
      <View style={styles.uiOverlay}>
        <View style={styles.topBar}>
          <Text style={styles.scoreText}>{score}</Text>
          <TouchableOpacity onPress={toggleMute} style={styles.muteButton}>
            <Text style={styles.muteIcon}>{isMuted ? '🔇' : '🔊'}</Text>
          </TouchableOpacity>
        </View>
        
        {gameState === 'playing' && (
          <View style={styles.instructions}>
            <Text style={styles.instructionText}>TAP TO FLAP</Text>
          </View>
        )}
      </View>

      {gameState === 'gameOver' && (
        <GameOverModal
          score={score}
          highScore={highScore}
          onRestart={restartGame}
          onHome={goHome}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87CEEB',
  },
  uiOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'box-none',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  scoreText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  muteButton: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    padding: 10,
    borderRadius: 25,
  },
  muteIcon: {
    fontSize: 24,
  },
  instructions: {
    position: 'absolute',
    top: '45%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
});