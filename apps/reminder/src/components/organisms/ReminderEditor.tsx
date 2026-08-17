import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors, spacing } from '../../theme';

interface ReminderEditorProps {
  onSave: (title: string, notes: string, dueAt: number) => void;
  onClose: () => void;
}

function defaultDueDate(): Date {
  const d = new Date();
  d.setMinutes(d.getMinutes() + 30, 0, 0); // default: 30 minutes from now
  return d;
}

export function ReminderEditor({ onSave, onClose }: ReminderEditorProps) {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [dueDate, setDueDate] = useState<Date>(defaultDueDate());
  const [showPicker, setShowPicker] = useState(Platform.OS === 'ios');

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Title required', 'Please enter a title for this reminder.');
      return;
    }
    onSave(title, notes, dueDate.getTime());
    onClose();
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Cancel">
          <Text style={styles.headerAction}>Cancel</Text>
        </Pressable>
        <Text style={styles.headerTitle}>New Reminder</Text>
        <Pressable onPress={handleSave} accessibilityRole="button" accessibilityLabel="Save reminder">
          <Text style={[styles.headerAction, styles.saveAction]}>Save</Text>
        </Pressable>
      </View>

      <TextInput
        style={styles.titleInput}
        value={title}
        onChangeText={setTitle}
        placeholder="Reminder title"
        placeholderTextColor={colors.subtleText}
        autoFocus
        accessibilityLabel="Reminder title"
      />
      <TextInput
        style={styles.notesInput}
        value={notes}
        onChangeText={setNotes}
        placeholder="Notes (optional)"
        placeholderTextColor={colors.subtleText}
        multiline
        accessibilityLabel="Reminder notes"
      />

      <View style={styles.dateSection}>
        <Text style={styles.dateLabel}>Remind me at</Text>
        {Platform.OS === 'android' && !showPicker ? (
          <Pressable onPress={() => setShowPicker(true)} style={styles.dateButton}>
            <Text style={styles.dateButtonText}>
              {dueDate.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
            </Text>
          </Pressable>
        ) : null}
        {showPicker ? (
          <DateTimePicker
            value={dueDate}
            mode="datetime"
            minimumDate={new Date()}
            onChange={(_event, selected) => {
              if (Platform.OS === 'android') setShowPicker(false);
              if (selected) setDueDate(selected);
            }}
          />
        ) : null}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  headerAction: {
    fontSize: 16,
    color: colors.subtleText,
  },
  saveAction: {
    color: colors.accent,
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  titleInput: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.cardBg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  notesInput: {
    fontSize: 15,
    color: colors.text,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.cardBg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  dateSection: {
    paddingHorizontal: spacing.lg,
  },
  dateLabel: {
    fontSize: 13,
    color: colors.subtleText,
    marginBottom: spacing.sm,
    fontWeight: '600',
  },
  dateButton: {
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignSelf: 'flex-start',
  },
  dateButtonText: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '600',
  },
});
