import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Note } from '../../types';
import { NoteCard } from '../molecules/NoteCard';
import { colors, spacing } from '../../theme';

interface NoteListProps {
  notes: Note[];
  onSelect: (note: Note) => void;
  emptyMessage: string;
}

export function NoteList({ notes, onSelect, emptyMessage }: NoteListProps) {
  if (notes.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={notes}
      keyExtractor={(item) => item.id}
      numColumns={2}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => <NoteCard note={item} onPress={() => onSelect(item)} />}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: spacing.md,
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
