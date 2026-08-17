import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Note } from '../../types';
import { colors, spacing } from '../../theme';

interface NoteCardProps {
  note: Note;
  onPress: () => void;
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function NoteCard({ note, onPress }: NoteCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: note.color },
        pressed && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Note: ${note.title}`}
    >
      <Text style={styles.title} numberOfLines={1}>
        {note.title}
      </Text>
      {note.body ? (
        <Text style={styles.body} numberOfLines={4}>
          {note.body}
        </Text>
      ) : null}
      <Text style={styles.date}>{formatDate(note.updatedAt)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 14,
    padding: spacing.md,
    margin: spacing.xs,
    minHeight: 120,
  },
  pressed: {
    opacity: 0.75,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  body: {
    fontSize: 13,
    color: colors.text,
    opacity: 0.8,
    flex: 1,
  },
  date: {
    fontSize: 11,
    color: colors.subtleText,
    marginTop: spacing.sm,
  },
});
