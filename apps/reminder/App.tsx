import React, { useState } from 'react';
import { ActivityIndicator, Alert, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ReminderList } from './src/components/organisms/ReminderList';
import { ReminderEditor } from './src/components/organisms/ReminderEditor';
import { Fab } from './src/components/atoms/Fab';
import { useReminders } from './src/hooks/useReminders';
import { Reminder } from './src/types';
import { colors, spacing } from './src/theme';

export default function App() {
  const { reminders, pendingCount, isLoaded, addReminder, toggleDone, deleteReminder } = useReminders();
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (title: string, notes: string, dueAt: number) => {
    addReminder(title, notes, dueAt);
  };

  const handleSelect = (reminder: Reminder) => {
    Alert.alert(reminder.title, reminder.notes || 'No additional notes.', [
      { text: 'Close', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteReminder(reminder.id) },
    ]);
  };

  if (!isLoaded) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.loading}>
          <ActivityIndicator color={colors.accent} />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        {isEditing ? (
          <ReminderEditor onSave={handleSave} onClose={() => setIsEditing(false)} />
        ) : (
          <>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Reminders</Text>
              <Text style={styles.headerSubtitle}>
                {pendingCount} pending
              </Text>
            </View>
            <ReminderList reminders={reminders} onToggle={toggleDone} onSelect={handleSelect} />
            <Fab onPress={() => setIsEditing(true)} />
          </>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.subtleText,
    marginTop: 2,
  },
});
