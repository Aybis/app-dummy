import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../../theme';

interface IconButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'default' | 'danger';
  accessibilityLabel?: string;
}

/** A small circular tap target used for header/back/delete actions. */
export function IconButton({ label, onPress, variant = 'default', accessibilityLabel }: IconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Text style={[styles.label, variant === 'danger' && styles.dangerLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.5,
  },
  label: {
    fontSize: 20,
    color: colors.text,
  },
  dangerLabel: {
    color: colors.danger,
  },
});
