import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Reminder } from '../../types';
import { Checkbox } from '../atoms/Checkbox';
import { colors, spacing } from '../../theme';

interface ReminderCardProps {
  reminder: Reminder;
  onToggle: () => void;
  onPress: () => void;
}

function formatDueDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function ReminderCard({ reminder, onToggle, onPress }: ReminderCardProps) {
  const isOverdue = !reminder.isDone && reminder.dueAt < Date.now();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={`Reminder: ${reminder.title}`}
    >
      <Checkbox checked={reminder.isDone} onToggle={onToggle} />
      <View style={styles.content}>
        <Text style={[styles.title, reminder.isDone && styles.doneText]} numberOfLines={1}>
          {reminder.title}
        </Text>
        {reminder.notes ? (
          <Text style={[styles.notes, reminder.isDone && styles.doneText]} numberOfLines={1}>
            {reminder.notes}
          </Text>
        ) : null}
        <Text style={[styles.due, isOverdue && styles.overdue]}>{formatDueDate(reminder.dueAt)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.cardBg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  pressed: {
    opacity: 0.7,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  notes: {
    fontSize: 13,
    color: colors.subtleText,
    marginTop: 2,
  },
  due: {
    fontSize: 12,
    color: colors.accent,
    marginTop: 6,
    fontWeight: '600',
  },
  overdue: {
    color: colors.overdue,
  },
  doneText: {
    textDecorationLine: 'line-through',
    color: colors.subtleText,
  },
});
