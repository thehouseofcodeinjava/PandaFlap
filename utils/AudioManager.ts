import { Platform } from 'react-native';

export class AudioManager {
  private backgroundMusic: any = null;
  private soundEffects: { [key: string]: any } = {};
  private isMuted = false;

  async initialize() {
    if (Platform.OS === 'web') return;
    
    try {
      const { Audio } = await import('expo-av');
      if (Audio && Audio.setAudioModeAsync) {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
      }
    } catch (error) {
      console.log('Audio initialization error:', error);
    }
  }

  async playBackgroundMusic() {
    if (this.isMuted) return;
    if (Platform.OS === 'web') return;
    
    try {
      // For demo purposes, we'll use a placeholder
      // In a real app, you'd load actual music files
      console.log('Playing background music');
    } catch (error) {
      console.log('Background music error:', error);
    }
  }

  playFlap() {
    if (this.isMuted) return;
    if (Platform.OS === 'web') return;
    console.log('Playing flap sound');
  }

  playScore() {
    if (this.isMuted) return;
    if (Platform.OS === 'web') return;
    console.log('Playing score sound');
  }

  playGameOver() {
    if (this.isMuted) return;
    if (Platform.OS === 'web') return;
    console.log('Playing game over sound');
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopAll();
    } else {
      this.playBackgroundMusic();
    }
  }

  stopAll() {
    try {
      if (this.backgroundMusic) {
        this.backgroundMusic.stopAsync();
      }
    } catch (error) {
      console.log('Error stopping audio:', error);
    }
  }
}