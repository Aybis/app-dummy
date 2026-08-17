import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../../theme';

interface FabProps {
  onPress: () => void;
  label?: string;
}

/** Floating action button for creating a new note. */
export function Fab({ onPress, label = '+' }: FabProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Add note"
      style={({ pressed }) => [styles.fab, pressed && styles.pressed]}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 28,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.fabShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 6,
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    fontSize: 28,
    lineHeight: 30,
    color: colors.accentText,
    fontWeight: '600',
  },
});
