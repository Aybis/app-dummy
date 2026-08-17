import { useCallback, useEffect, useMemo, useState } from 'react';
import { loadReminders, saveReminders } from '../storage/reminderStorage';
import { cancelReminderNotification, scheduleReminderNotification } from '../notifications';
import { Reminder } from '../types';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function useReminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadReminders().then((loaded) => {
      setReminders(loaded);
      setIsLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    saveReminders(reminders);
  }, [reminders, isLoaded]);

  const addReminder = useCallback(async (title: string, notes: string, dueAt: number) => {
    const notificationId = await scheduleReminderNotification(title.trim() || 'Reminder', notes.trim(), dueAt);
    const reminder: Reminder = {
      id: generateId(),
      title: title.trim() || 'Untitled reminder',
      notes: notes.trim(),
      dueAt,
      isDone: false,
      notificationId,
      createdAt: Date.now(),
    };
    setReminders((prev) => [reminder, ...prev]);
    return reminder;
  }, []);

  const toggleDone = useCallback((id: string) => {
    setReminders((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const nowDone = !r.isDone;
        if (nowDone) cancelReminderNotification(r.notificationId);
        return { ...r, isDone: nowDone };
      })
    );
  }, []);

  const deleteReminder = useCallback((id: string) => {
    setReminders((prev) => {
      const target = prev.find((r) => r.id === id);
      if (target) cancelReminderNotification(target.notificationId);
      return prev.filter((r) => r.id !== id);
    });
  }, []);

  const sorted = useMemo(() => {
    return [...reminders].sort((a, b) => {
      if (a.isDone !== b.isDone) return a.isDone ? 1 : -1;
      return a.dueAt - b.dueAt;
    });
  }, [reminders]);

  const pendingCount = useMemo(() => reminders.filter((r) => !r.isDone).length, [reminders]);

  return {
    reminders: sorted,
    pendingCount,
    isLoaded,
    addReminder,
    toggleDone,
    deleteReminder,
  };
}
