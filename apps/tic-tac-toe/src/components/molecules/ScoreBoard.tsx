import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScoreRecord } from '../../storage/scoreStorage';
import { GameMode } from '../../hooks/useGame';
import { colors, spacing } from '../../theme';

interface ScoreBoardProps {
  score: ScoreRecord;
  mode: GameMode;
}

export function ScoreBoard({ score, mode }: ScoreBoardProps) {
  const oLabel = mode === 'vs-ai' ? 'CPU' : 'O';

  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <Text style={[styles.value, { color: colors.xColor }]}>{score.xWins}</Text>
        <Text style={styles.label}>X</Text>
      </View>
      <View style={styles.item}>
        <Text style={styles.value}>{score.draws}</Text>
        <Text style={styles.label}>Draws</Text>
      </View>
      <View style={styles.item}>
        <Text style={[styles.value, { color: colors.oColor }]}>{score.oWins}</Text>
        <Text style={styles.label}>{oLabel}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  item: {
    alignItems: 'center',
  },
  value: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  label: {
    fontSize: 12,
    color: colors.subtleText,
    marginTop: 2,
  },
});
