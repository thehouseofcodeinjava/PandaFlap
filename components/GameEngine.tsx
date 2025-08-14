import React, { useImperativeHandle, forwardRef, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useFrameCallback,
  useDerivedValue,
} from 'react-native-reanimated';
import { runOnJS } from 'react-native-worklets';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Panda } from './Panda';
import { BambooObstacle } from './BambooObstacle';
import { ParallaxBackground } from './ParallaxBackground';

const { width, height } = Dimensions.get('window');

interface GameEngineProps {
  onGameOver: (score: number) => void;
  onScore: (score: number) => void;
  onFlap: () => void;
  gameState: 'playing' | 'gameOver';
  onRestart: () => void;
}

export const GameEngine = forwardRef<any, GameEngineProps>(
  ({ onGameOver, onScore, onFlap, gameState, onRestart }, ref) => {
    // Game physics constants
    const GRAVITY = 0.6;
    const FLAP_STRENGTH = -12;
    const PANDA_SIZE = 50;
    const OBSTACLE_WIDTH = 60;
    const GAP_HEIGHT = 180;
    const GAME_SPEED = 3;

  // Game state
  // Center the panda in the gap and place obstacles farther away
  // Add extra margin so panda starts well within the gap
  const GAP_MARGIN = 40;
  const GAP_HEIGHT_SAFE = GAP_HEIGHT - GAP_MARGIN * 2;
  const centeredGapY = (height - GAP_HEIGHT_SAFE) / 2;
  const pandaY = useSharedValue(centeredGapY + GAP_HEIGHT_SAFE / 2);
  const pandaVelocity = useSharedValue(0);
  // Game only runs after first tap
  const gameRunning = useSharedValue(false);
  const currentScore = useRef(0);
  const gameSpeed = useSharedValue(GAME_SPEED);

  // Obstacles
  const obstacle1X = useSharedValue(width);
  const obstacle2X = useSharedValue(width + 400);
  const obstacle3X = useSharedValue(width + 800);

  // Center the panda and the first obstacle gap
  const obstacle1GapY = useSharedValue(centeredGapY);
  const obstacle2GapY = useSharedValue(Math.random() * (height - 400) + 150);
  const obstacle3GapY = useSharedValue(Math.random() * (height - 400) + 150);
    
    const obstacle1Passed = useRef(false);
    const obstacle2Passed = useRef(false);
    const obstacle3Passed = useRef(false);

    useImperativeHandle(ref, () => ({
      restart: () => {
        restartGame();
      }
    }));

    const restartGame = () => {
  // Pause game until first tap
  gameRunning.value = false;
  // Reset panda to center of gap
  pandaY.value = centeredGapY + GAP_HEIGHT_SAFE / 2;
  pandaVelocity.value = 0;
  currentScore.current = 0;
  gameSpeed.value = GAME_SPEED;

  // Reset obstacles farther away
  obstacle1X.value = width;
  obstacle2X.value = width + 400;
  obstacle3X.value = width + 800;

  // On restart, center the gap for the first obstacle
  obstacle1GapY.value = centeredGapY;
  obstacle2GapY.value = Math.random() * (height - 400) + 150;
  obstacle3GapY.value = Math.random() * (height - 400) + 150;

  obstacle1Passed.current = false;
  obstacle2Passed.current = false;
  obstacle3Passed.current = false;
    };

    const tap = Gesture.Tap().onEnd(() => {
      'worklet';
      if (gameState === 'gameOver') {
        runOnJS(onRestart)();
      } else {
        if (!gameRunning.value) {
          gameRunning.value = true;
          pandaVelocity.value = 0;
        }
        pandaVelocity.value = FLAP_STRENGTH;
        runOnJS(onFlap)();
      }
    });

    const checkCollisions = () => {
      const pandaX = 100;
      const pandaTop = pandaY.value - PANDA_SIZE / 2;
      const pandaBottom = pandaY.value + PANDA_SIZE / 2;
      const pandaLeft = pandaX - PANDA_SIZE / 2;
      const pandaRight = pandaX + PANDA_SIZE / 2;

      // Ground and ceiling collision
      if (pandaBottom >= height - 50 || pandaTop <= 0) {
        gameRunning.value = false;
        runOnJS(onGameOver)(currentScore.current);
        return;
      }

      // Check collisions with all obstacles
      const obstacles = [
        { x: obstacle1X.value, gapY: obstacle1GapY.value, gapHeight: GAP_HEIGHT_SAFE, passed: obstacle1Passed },
        { x: obstacle2X.value, gapY: obstacle2GapY.value, gapHeight: GAP_HEIGHT, passed: obstacle2Passed },
        { x: obstacle3X.value, gapY: obstacle3GapY.value, gapHeight: GAP_HEIGHT, passed: obstacle3Passed },
      ];
      obstacles.forEach((obstacle) => {
        const obstacleLeft = obstacle.x;
        const obstacleRight = obstacle.x + OBSTACLE_WIDTH;
        const gapTop = obstacle.gapY;
        const gapBottom = obstacle.gapY + obstacle.gapHeight;

        // Check if panda is horizontally aligned with obstacle
        if (pandaRight > obstacleLeft && pandaLeft < obstacleRight) {
          // Check if panda is not in the gap (collision)
          if (pandaTop < gapTop || pandaBottom > gapBottom) {
            gameRunning.value = false;
            runOnJS(onGameOver)(currentScore.current);
            return;
          }
        }

        // Check for scoring (panda passed through gap)
        if (!obstacle.passed.current && pandaX > obstacleRight) {
          obstacle.passed.current = true;
          currentScore.current += 1;
          runOnJS(onScore)(currentScore.current);
          
          // Increase difficulty every 5 points
          if (currentScore.current % 5 === 0) {
            gameSpeed.value = Math.min(gameSpeed.value + 0.5, 8);
          }
        }
      });
    };

    const resetObstacle = (obstacleX: Animated.SharedValue<number>, obstacleGapY: Animated.SharedValue<number>, passed: React.MutableRefObject<boolean>) => {
      if (obstacleX.value < -OBSTACLE_WIDTH) {
        obstacleX.value = width + 100;
        obstacleGapY.value = Math.random() * (height - 400) + 150;
        passed.current = false;
      }
    };

    // Game loop using frame callback
    useFrameCallback(() => {
      if (!gameRunning.value) return;

      // Only run physics and collision if gameRunning is true
      pandaVelocity.value += GRAVITY;
      pandaY.value += pandaVelocity.value;

      obstacle1X.value -= gameSpeed.value;
      obstacle2X.value -= gameSpeed.value;
      obstacle3X.value -= gameSpeed.value;

      resetObstacle(obstacle1X, obstacle1GapY, obstacle1Passed);
      resetObstacle(obstacle2X, obstacle2GapY, obstacle2Passed);
      resetObstacle(obstacle3X, obstacle3GapY, obstacle3Passed);

      runOnJS(checkCollisions)();
    });

    const pandaAnimatedStyle = useAnimatedStyle(() => ({
      transform: [
        { translateX: 100 },
        { translateY: pandaY.value - height / 2 },
      ],
    }));

    return (
      <GestureDetector gesture={tap}>
        <View style={styles.gameContainer}>
          <ParallaxBackground gameSpeed={gameSpeed} />
          {/* Obstacles */}
          <BambooObstacle
            x={obstacle1X}
            gapY={obstacle1GapY.value}
            gapHeight={GAP_HEIGHT_SAFE}
          />
          <BambooObstacle
            x={obstacle2X}
            gapY={obstacle2GapY.value}
            gapHeight={GAP_HEIGHT}
          />
          <BambooObstacle
            x={obstacle3X}
            gapY={obstacle3GapY.value}
            gapHeight={GAP_HEIGHT}
          />

          {/* Panda */}
          <Animated.View style={[styles.pandaContainer, pandaAnimatedStyle]}>
            <Panda velocity={pandaVelocity.value} />
          </Animated.View>

          {/* Ground */}
          <View style={styles.ground} />
        </View>
      </GestureDetector>
    );
  }
);

const styles = StyleSheet.create({
  gameContainer: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#87CEEB',
  },
  pandaContainer: {
    position: 'absolute',
    width: 50,
    height: 50,
    zIndex: 10,
  },
  ground: {
    position: 'absolute',
    bottom: 0,
    width: width,
    height: 50,
    backgroundColor: '#8B4513',
  },
});