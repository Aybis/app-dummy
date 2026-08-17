import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { colors, spacing } from '../../theme';

interface SearchBarProps {
  value: string;
  onChange: (text: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder="Search notes"
        placeholderTextColor={colors.subtleText}
        accessibilityLabel="Search notes"
        returnKeyType="search"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  input: {
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 12,
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
  },
});
