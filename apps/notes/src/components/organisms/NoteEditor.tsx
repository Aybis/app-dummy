import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, TextInput, View } from 'react-native';
import { Note } from '../../types';
import { IconButton } from '../atoms/IconButton';
import { colors, spacing } from '../../theme';

interface NoteEditorProps {
  note: Note | null; // null means creating a new note
  onSave: (title: string, body: string) => void;
  onDelete?: () => void;
  onClose: () => void;
}

export function NoteEditor({ note, onSave, onDelete, onClose }: NoteEditorProps) {
  const [title, setTitle] = useState(note?.title ?? '');
  const [body, setBody] = useState(note?.body ?? '');

  const handleClose = () => {
    onSave(title, body);
    onClose();
  };

  const handleDelete = () => {
    Alert.alert('Delete note?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: onDelete },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: note?.color ?? colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <IconButton label="←" onPress={handleClose} accessibilityLabel="Back and save" />
        {note && onDelete ? (
          <IconButton label="🗑" onPress={handleDelete} variant="danger" accessibilityLabel="Delete note" />
        ) : null}
      </View>

      <TextInput
        style={styles.titleInput}
        value={title}
        onChangeText={setTitle}
        placeholder="Title"
        placeholderTextColor={colors.subtleText}
        autoFocus={!note}
        accessibilityLabel="Note title"
      />
      <TextInput
        style={styles.bodyInput}
        value={body}
        onChangeText={setBody}
        placeholder="Start writing..."
        placeholderTextColor={colors.subtleText}
        multiline
        textAlignVertical="top"
        accessibilityLabel="Note body"
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  bodyInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
});
