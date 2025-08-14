import { Platform } from 'react-native';

export class StorageManager {
  private static readonly HIGH_SCORE_KEY = 'pandaFlap_highScore';
  private static readonly SETTINGS_KEY = 'pandaFlap_settings';

  static async getHighScore(): Promise<number> {
    try {
      if (Platform.OS !== 'web') {
        const AsyncStorage = await import('@react-native-async-storage/async-storage');
        const score = await AsyncStorage.default.getItem(this.HIGH_SCORE_KEY);
        return score ? parseInt(score, 10) : 0;
      }
      return 0;
    } catch (error) {
      console.log('Error loading high score:', error);
      return 0;
    }
  }

  static async saveHighScore(score: number): Promise<void> {
    try {
      if (Platform.OS !== 'web') {
        const AsyncStorage = await import('@react-native-async-storage/async-storage');
        await AsyncStorage.default.setItem(this.HIGH_SCORE_KEY, score.toString());
      }
    } catch (error) {
      console.log('Error saving high score:', error);
    }
  }

  static async getSettings(): Promise<{ isMuted: boolean }> {
    try {
      if (Platform.OS !== 'web') {
        const AsyncStorage = await import('@react-native-async-storage/async-storage');
        const settings = await AsyncStorage.default.getItem(this.SETTINGS_KEY);
        return settings ? JSON.parse(settings) : { isMuted: false };
      }
      return { isMuted: false };
    } catch (error) {
      console.log('Error loading settings:', error);
      return { isMuted: false };
    }
  }

  static async saveSettings(settings: { isMuted: boolean }): Promise<void> {
    try {
      if (Platform.OS !== 'web') {
        const AsyncStorage = await import('@react-native-async-storage/async-storage');
        await AsyncStorage.default.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
      }
    } catch (error) {
      console.log('Error saving settings:', error);
    }
  }
}