export interface Reminder {
  id: string;
  title: string;
  notes: string;
  dueAt: number; // epoch ms
  isDone: boolean;
  notificationId: string | null;
  createdAt: number;
}
