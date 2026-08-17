import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors } from '../../theme';

export type CalcButtonVariant = 'number' | 'operator' | 'function' | 'accent' | 'toggle';

interface CalcButtonProps {
  label: string;
  onPress: () => void;
  variant?: CalcButtonVariant;
  flex?: number;
  active?: boolean;
  fontSize?: number;
  accessibilityLabel?: string;
}

const VARIANT_STYLES: Record<CalcButtonVariant, { bg: string; text: string }> = {
  number: { bg: colors.numberBg, text: colors.numberText },
  operator: { bg: colors.operatorBg, text: colors.operatorText },
  function: { bg: colors.functionBg, text: colors.functionText },
  accent: { bg: colors.accentBg, text: colors.accentText },
  toggle: { bg: colors.toggleInactive, text: colors.operatorText },
};

/** A single calculator key. Atomic building block reused across all keypad layouts. */
export function CalcButton({
  label,
  onPress,
  variant = 'number',
  flex = 1,
  active = false,
  fontSize = 22,
  accessibilityLabel,
}: CalcButtonProps) {
  const style = VARIANT_STYLES[variant];
  const backgroundColor = active ? colors.toggleActive : style.bg;

  const containerStyle: ViewStyle = {
    flex,
    backgroundColor,
  };

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      style={({ pressed }) => [
        styles.button,
        containerStyle,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.label, { color: style.text, fontSize }]} numberOfLines={1} adjustsFontSizeToFit>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 62,
    marginHorizontal: 4,
    marginVertical: 4,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.6,
  },
  label: {
    fontWeight: '500',
  },
});
