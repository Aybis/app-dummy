import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Cell as CellValue } from '../../logic/gameLogic';
import { colors } from '../../theme';

interface CellProps {
  value: CellValue;
  onPress: () => void;
  isWinningCell: boolean;
  disabled: boolean;
}

export function Cell({ value, onPress, isWinningCell, disabled }: CellProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || value !== null}
      style={({ pressed }) => [
        styles.cell,
        isWinningCell && styles.winningCell,
        pressed && !disabled && value === null && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={value ? `Cell occupied by ${value}` : 'Empty cell'}
    >
      <Text style={[styles.label, value === 'X' ? styles.xLabel : styles.oLabel]}>{value ?? ''}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cell: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: colors.cellBg,
    borderRadius: 12,
    margin: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.cellBorder,
  },
  winningCell: {
    backgroundColor: colors.winHighlight,
    borderColor: colors.xColor,
  },
  pressed: {
    opacity: 0.7,
  },
  label: {
    fontSize: 48,
    fontWeight: '800',
  },
  xLabel: {
    color: colors.xColor,
  },
  oLabel: {
    color: colors.oColor,
  },
});
