import React, { useState } from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NoteList } from './src/components/organisms/NoteList';
import { NoteEditor } from './src/components/organisms/NoteEditor';
import { Fab } from './src/components/atoms/Fab';
import { SearchBar } from './src/components/molecules/SearchBar';
import { useNotes } from './src/hooks/useNotes';
import { Note } from './src/types';
import { colors, spacing } from './src/theme';

type Screen = 'list' | 'editor';

export default function App() {
  const { notes, totalCount, isLoaded, query, setQuery, addNote, updateNote, deleteNote } = useNotes();
  const [screen, setScreen] = useState<Screen>('list');
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const openNewNote = () => {
    setActiveNote(null);
    setIsCreating(true);
    setScreen('editor');
  };

  const openExistingNote = (note: Note) => {
    setActiveNote(note);
    setIsCreating(false);
    setScreen('editor');
  };

  const handleSave = (title: string, body: string) => {
    const isBlank = !title.trim() && !body.trim();
    if (isCreating) {
      if (!isBlank) addNote(title, body);
    } else if (activeNote) {
      if (isBlank) {
        deleteNote(activeNote.id);
      } else {
        updateNote(activeNote.id, title, body);
      }
    }
  };

  const handleDelete = () => {
    if (activeNote) deleteNote(activeNote.id);
    setScreen('list');
  };

  const closeEditor = () => setScreen('list');

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
        {screen === 'editor' ? (
          <NoteEditor
            note={activeNote}
            onSave={handleSave}
            onDelete={activeNote ? handleDelete : undefined}
            onClose={closeEditor}
          />
        ) : (
          <>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Notes</Text>
              <Text style={styles.headerSubtitle}>{totalCount} note{totalCount === 1 ? '' : 's'}</Text>
            </View>
            <SearchBar value={query} onChange={setQuery} />
            <NoteList
              notes={notes}
              onSelect={openExistingNote}
              emptyMessage={totalCount === 0 ? 'No notes yet. Tap + to add one.' : 'No notes match your search.'}
            />
            <Fab onPress={openNewNote} />
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
