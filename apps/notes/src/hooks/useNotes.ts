import { useCallback, useEffect, useMemo, useState } from 'react';
import { loadNotes, saveNotes } from '../storage/notesStorage';
import { Note } from '../types';
import { NOTE_COLORS } from '../theme';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function pickColor(): string {
  return NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)];
}

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    loadNotes().then((loaded) => {
      setNotes(loaded);
      setIsLoaded(true);
    });
  }, []);

  // Persist whenever notes change, but only after the initial load completes
  // (otherwise we'd overwrite stored notes with an empty array on mount).
  useEffect(() => {
    if (!isLoaded) return;
    saveNotes(notes);
  }, [notes, isLoaded]);

  const addNote = useCallback((title: string, body: string) => {
    const now = Date.now();
    const note: Note = {
      id: generateId(),
      title: title.trim() || 'Untitled',
      body: body.trim(),
      color: pickColor(),
      createdAt: now,
      updatedAt: now,
    };
    setNotes((prev) => [note, ...prev]);
    return note;
  }, []);

  const updateNote = useCallback((id: string, title: string, body: string) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id
          ? { ...n, title: title.trim() || 'Untitled', body: body.trim(), updatedAt: Date.now() }
          : n
      )
    );
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const filteredNotes = useMemo(() => {
    const sorted = [...notes].sort((a, b) => b.updatedAt - a.updatedAt);
    if (!query.trim()) return sorted;
    const q = query.trim().toLowerCase();
    return sorted.filter(
      (n) => n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q)
    );
  }, [notes, query]);

  return {
    notes: filteredNotes,
    totalCount: notes.length,
    isLoaded,
    query,
    setQuery,
    addNote,
    updateNote,
    deleteNote,
  };
}
