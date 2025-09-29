// types/notification.d.ts

export interface Notification {
  id: string;
  recipient_user_id: string;
  news_id: string | null;
  message: string;
  read: boolean;
  created_at: string;
}
