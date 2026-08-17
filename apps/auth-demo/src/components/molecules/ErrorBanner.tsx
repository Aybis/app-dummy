import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../../theme';

interface ErrorBannerProps {
  message: string | null;
}

export function ErrorBanner({ message }: ErrorBannerProps) {
  if (!message) return null;
  return (
    <View style={styles.container} accessibilityLiveRegion="polite">
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(232, 93, 93, 0.12)',
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: 10,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  text: {
    color: colors.danger,
    fontSize: 13,
    textAlign: 'center',
  },
});
