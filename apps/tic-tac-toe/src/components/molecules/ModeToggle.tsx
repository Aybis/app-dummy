import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { GameMode } from '../../hooks/useGame';
import { colors, spacing } from '../../theme';

interface ModeToggleProps {
  mode: GameMode;
  onChange: (mode: GameMode) => void;
}

export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => onChange('vs-ai')}
        style={[styles.option, mode === 'vs-ai' && styles.optionActive]}
        accessibilityRole="button"
        accessibilityLabel="Play against computer"
      >
        <Text style={[styles.label, mode === 'vs-ai' && styles.labelActive]}>vs CPU</Text>
      </Pressable>
      <Pressable
        onPress={() => onChange('two-player')}
        style={[styles.option, mode === 'two-player' && styles.optionActive]}
        accessibilityRole="button"
        accessibilityLabel="Two player mode"
      >
        <Text style={[styles.label, mode === 'two-player' && styles.labelActive]}>2 Player</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.boardBg,
    borderRadius: 12,
    padding: 4,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  option: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  optionActive: {
    backgroundColor: colors.accent,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.subtleText,
  },
  labelActive: {
    color: colors.accentText,
  },
});
