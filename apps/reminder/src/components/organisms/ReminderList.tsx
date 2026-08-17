import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Reminder } from '../../types';
import { ReminderCard } from '../molecules/ReminderCard';
import { colors, spacing } from '../../theme';

interface ReminderListProps {
  reminders: Reminder[];
  onToggle: (id: string) => void;
  onSelect: (reminder: Reminder) => void;
}

export function ReminderList({ reminders, onToggle, onSelect }: ReminderListProps) {
  if (reminders.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No reminders yet. Tap + to add one.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={reminders}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <ReminderCard
          reminder={item}
          onToggle={() => onToggle(item.id)}
          onPress={() => onSelect(item)}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingTop: spacing.sm,
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyText: {
    fontSize: 15,
    color: colors.subtleText,
    textAlign: 'center',
  },
});
