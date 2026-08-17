import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme';
import { AngleMode } from '../../logic/evaluator';

interface DisplayPanelProps {
  expression: string;
  preview: string;
  isError: boolean;
  angleMode: AngleMode;
  memoryActive: boolean;
}

/** Shows the current expression (large, primary) and the live preview result (small, secondary). */
export function DisplayPanel({ expression, preview, isError, angleMode, memoryActive }: DisplayPanelProps) {
  return (
    <View style={styles.container}>
      <View style={styles.badges}>
        {memoryActive && <Text style={styles.badge}>M</Text>}
        <Text style={styles.badge}>{angleMode.toUpperCase()}</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.exprScroll}>
        <Text
          style={[styles.expression, isError && styles.errorText]}
          numberOfLines={1}
          accessibilityLabel="Current expression"
        >
          {expression || '0'}
        </Text>
      </ScrollView>

      <Text style={styles.preview} numberOfLines={1} accessibilityLabel="Live preview result">
        {!isError && preview && preview !== expression ? `= ${preview}` : ' '}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 140,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  badges: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginBottom: 8,
  },
  badge: {
    color: colors.accentBg,
    fontSize: 12,
    fontWeight: '700',
    borderWidth: 1,
    borderColor: colors.accentBg,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  exprScroll: {
    flexGrow: 0,
  },
  expression: {
    color: colors.displayText,
    fontSize: 48,
    fontWeight: '300',
    textAlign: 'right',
  },
  errorText: {
    color: colors.errorText,
    fontSize: 28,
  },
  preview: {
    color: colors.expressionText,
    fontSize: 22,
    textAlign: 'right',
    marginTop: 6,
  },
});
