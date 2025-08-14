export interface GameState {
  isPlaying: boolean;
  score: number;
  highScore: number;
  gameSpeed: number;
  pandaY: number;
  pandaVelocity: number;
}

export interface Obstacle {
  id: number;
  x: number;
  gapY: number;
  passed: boolean;
}

export interface GameSettings {
  isMuted: boolean;
  difficulty: 'easy' | 'normal' | 'hard';
}

export interface Hat {
  id: string;
  emoji: string;
  name: string;
  unlockScore: number;
}