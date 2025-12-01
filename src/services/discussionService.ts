import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export interface Discussion {
  id: number;
  title: string;
  participant1: number;
  participant2: number;
  discussion_type: string;
  other_participant: {
    id: number;
    username: string;
    email: string;
    is_staff: boolean;
    is_superuser: boolean;
    is_seller: boolean;
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
  messages: Message[];
  unread_count: number;
  last_message: {
    content: string;
    created_at: string;
    sender_username: string;
  };
}

export interface Message {
  id: number;
  sender: {
    id: number;
    username: string;
    is_staff: boolean;
    is_superuser: boolean;
    is_seller: boolean; // ✅ CORRECTION AJOUTÉE
  };
  content: string;
  created_at: string;
  is_read: boolean;
}

export interface SendMessageData {
  discussion_id?: number;
  recipient_id?: number;
  title?: string;
  content: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  is_staff: boolean;
  is_superuser: boolean;
  is_seller: boolean;
}

export const getCurrentUser = (): User | null => {
  try {
    const userData = localStorage.getItem('user');
    if (!userData) return null;

    const parsed = JSON.parse(userData);
    
    const normalizedUser: User = {
      id: parsed.id ?? parsed.user_id ?? 1,
      email: parsed.email || '',
      username: parsed.username || parsed.full_name || parsed.email?.split('@')[0] || 'user',
      is_staff: Boolean(parsed.is_staff),
      is_superuser: Boolean(parsed.is_superuser),
      is_seller: Boolean(parsed.is_seller)
    };

    return normalizedUser;
  } catch (error) {
    console.error('Erreur getCurrentUser:', error);
    return null;
  }
};

export const discussionService = {
  async getDiscussions(): Promise<{ results: Discussion[] }> {
    const response = await api.get('/discussion/discussions/');
    return response.data;
  },

  async getDiscussion(id: number): Promise<Discussion> {
    const response = await api.get(`/discussion/discussions/${id}/`);
    return response.data;
  },

  async sendMessage(data: SendMessageData): Promise<any> {
    const response = await api.post('/discussion/send-message/', data);
    return response.data;
  },

  async createDiscussion(data: {
    recipient_id: number;
    title?: string;
    content: string;
    discussion_type?: string;
  }): Promise<any> {
    const response = await api.post('/discussion/admin/discussions/', data);
    return response.data;
  },
};