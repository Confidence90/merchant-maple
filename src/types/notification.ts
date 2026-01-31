// src/types/notification.ts
export interface Notification {
  id: number;
  type: 'order' | 'message' | 'listing' | 'system' | 'event';
  content: string;
  is_read: boolean;
  created_at: string;
  time_ago?: string;
}

// Pour la compatibilité avec l'ancien type
export interface AdminNotification {
  id: number;
  title: string;
  message: string;
  target: 'all' | 'buyers' | 'sellers';
  sent_at: string | null;
  scheduled_at: string | null;
  status: 'sent' | 'scheduled' | 'failed';
  recipients_count: number;
  open_rate: number;
  click_rate: number;
  created_at: string;
}