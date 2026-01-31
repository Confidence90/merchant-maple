// src/services/notificationsApi.ts - VERSION CORRIGÉE
import type { Notification } from '../types/notification';

const API_BASE_URL = 'http://localhost:8000/api';

const getAuthToken = (): string | null => {
  return localStorage.getItem('access_token') || 
         localStorage.getItem('admin_access_token') ||
         sessionStorage.getItem('access_token');
};

export interface NotificationStats {
  total_sent?: number;
  total_scheduled?: number;
  open_rate?: number;
  active_users?: number;
  // Ajout pour les vendeurs
  total?: number;
  unread?: number;
  out_of_stock_alerts?: number;
}

export interface CreateNotificationData {
  title: string;
  message: string;
  target: 'all' | 'buyers' | 'sellers';
  send_immediately: boolean;
  scheduled_at?: string;
}

export const notificationsApi = {
  // Pour les vendeurs (notifications personnelles) - VERSION CORRIGÉE
  async getVendorNotifications(params?: {
    page?: number;
    page_size?: number;
  }): Promise<{
    count: number;
    results: Notification[];
    next: string | null;
    previous: string | null;
  }> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Utilisateur non authentifié');
      }

      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
      
      const queryString = queryParams.toString();
      const url = `${API_BASE_URL}/users/vendor/notifications/${queryString ? `?${queryString}` : ''}`;
      
      console.log('🔄 Fetching vendor notifications from:', url);
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        console.error(`❌ Erreur HTTP ${response.status} sur ${url}`);
        throw new Error(`Erreur HTTP ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Vendor notifications data:', data);
      
      // 🔥 CORRECTION: Adapter le format de l'API
      if (data.notifications) {
        return {
          count: data.stats?.total || data.notifications.length,
          results: data.notifications,
          next: null,
          previous: null
        };
      }
      
      // Si l'API retourne déjà le bon format
      return data;
      
    } catch (error) {
      console.error('❌ Error fetching vendor notifications:', error);
      throw error;
    }
  },

  // Pour les vendeurs (alertes stock)
  async getOutOfStockAlerts(): Promise<{
    alerts: Notification[];
    out_of_stock_products: any[];
    total_alerts: number;
    total_out_of_stock: number;
  }> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Utilisateur non authentifié');
      }

      const url = `${API_BASE_URL}/users/vendor/out-of-stock-alerts/`;
      
      console.log('🔄 Fetching out of stock alerts from:', url);
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('❌ Error fetching out of stock alerts:', error);
      throw error;
    }
  },

  async getNotificationStats(): Promise<NotificationStats> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Utilisateur non authentifié');
      }

      console.log('🔄 Fetching notification stats...');
      
      // Essayer directement l'endpoint vendeur
      const url = `${API_BASE_URL}/users/vendor/notifications/`;
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        console.warn(`⚠️ Endpoint vendeur échoué (${response.status}), essayer admin...`);
        // Essayer l'endpoint admin comme fallback
        const adminUrl = `${API_BASE_URL}/notifications/admin/stats/`;
        const adminResponse = await fetch(adminUrl, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (!adminResponse.ok) {
          throw new Error(`Erreur HTTP ${adminResponse.status}`);
        }
        
        return await adminResponse.json();
      }
      
      // L'API vendeur retourne notifications + stats
      const data = await response.json();
      console.log('✅ Stats from vendor endpoint:', data.stats);
      
      return {
        total: data.stats?.total || 0,
        unread: data.stats?.unread || 0,
        out_of_stock_alerts: data.stats?.out_of_stock_alerts || 0
      };
      
    } catch (error) {
      console.error('❌ Error fetching notification stats:', error);
      // Retourner des stats par défaut en cas d'erreur
      return {
        total: 0,
        unread: 0,
        out_of_stock_alerts: 0
      };
    }
  },

  async createNotification(data: CreateNotificationData): Promise<Notification> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Utilisateur non authentifié');
      }

      const url = `${API_BASE_URL}/notifications/admin/send/`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('❌ Error creating notification:', error);
      throw error;
    }
  },

  async markAllAsRead(): Promise<{ message: string; count: number }> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Utilisateur non authentifié');
      }

      const url = `${API_BASE_URL}/users/mark-all-notifications-read/`;
      
      console.log('🔄 Marking all as read:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('❌ Error marking notifications as read:', error);
      throw error;
    }
  },

  async markAsRead(notificationId: number): Promise<Notification> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Utilisateur non authentifié');
      }

      const url = `${API_BASE_URL}/notifications/${notificationId}/`;
      
      console.log('🔄 Marking notification as read:', url);
      
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ is_read: true }),
      });
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('❌ Error marking notification as read:', error);
      throw error;
    }
  },

  async deleteNotification(notificationId: number): Promise<void> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Utilisateur non authentifié');
      }

      const url = `${API_BASE_URL}/notifications/admin/${notificationId}/`;
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Error deleting notification:', error);
      throw error;
    }
  },
};