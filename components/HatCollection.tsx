import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface HatCollectionProps {
  score: number;
}

export function HatCollection({ score }: HatCollectionProps) {
  const hats = ['🎩', '👑', '🧢', '🎓', '👒', '🤠', '🎪'];
  const currentHatIndex = Math.floor(score / 10) % hats.length;
  
  if (score < 10) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.hatEmoji}>{hats[currentHatIndex]}</Text>
      <Text style={styles.hatText}>New Hat!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 140,
    alignSelf: 'center',
    backgroundColor: 'rgba(255,215,0,0.9)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
  },
  hatEmoji: {
    fontSize: 24,
  },
  hatText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#8B4513',
  },
});