// src/services/usersApi.ts - VERSION AVEC TOKEN
import type { User, UsersResponse, Stats } from '@/types/users';

const API_BASE_URL = 'http://localhost:8000/api';

// Fonction pour récupérer le token
const getAuthToken = (): string | null => {
  // Essayez d'abord localStorage, puis sessionStorage
  return localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
};

// Service API pour les utilisateurs avec authentification
export const usersApi = {
  async getUsers(params?: {
    role?: string;
    search?: string;
    is_active?: boolean;
  }): Promise<UsersResponse> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Utilisateur non authentifié - Veuillez vous reconnecter');
      }

      const queryParams = new URLSearchParams();
      
      if (params?.role) queryParams.append('role', params.role);
      if (params?.search) queryParams.append('search', params.search);
      if (params?.is_active !== undefined) queryParams.append('is_active', params.is_active.toString());
      
      const queryString = queryParams.toString();
      const url = `${API_BASE_URL}/users/admin/users/${queryString ? `?${queryString}` : ''}`;
      
      console.log('🔄 Fetching users from:', url);
      console.log('🔑 Using token:', token.substring(0, 20) + '...');
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // 🔥 CORRECTION: Ajout du token
        },
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Non authentifié - Token invalide ou expiré');
        }
        if (response.status === 403) {
          throw new Error('Accès interdit - Vous n\'avez pas les permissions administrateur');
        }
        throw new Error(`Erreur HTTP ${response.status} lors du chargement des utilisateurs`);
      }
      
      const data = await response.json();
      console.log('✅ Users data received:', data);
      
      return data;
    } catch (error) {
      console.error('❌ Error in getUsers:', error);
      throw error;
    }
  },

  async getUserStats(): Promise<Stats> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Utilisateur non authentifié - Veuillez vous reconnecter');
      }

      const url = `${API_BASE_URL}/users/admin/stats/`;
      console.log('🔄 Fetching stats from:', url);
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // 🔥 CORRECTION: Ajout du token
        },
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Non authentifié - Token invalide ou expiré');
        }
        if (response.status === 403) {
          throw new Error('Accès interdit - Vous n\'avez pas les permissions administrateur');
        }
        throw new Error(`Erreur HTTP ${response.status} lors du chargement des statistiques`);
      }
      
      const data = await response.json();
      console.log('✅ Stats data received:', data);
      
      return data;
    } catch (error) {
      console.error('❌ Error in getUserStats:', error);
      return getDefaultStats();
    }
  },

  async updateUser(userId: number, data: Partial<User>): Promise<User> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Utilisateur non authentifié - Veuillez vous reconnecter');
      }

      const url = `${API_BASE_URL}/users/admin/users/${userId}/`;
      console.log('🔄 Updating user at:', url, data);
      
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`, // 🔥 CORRECTION: Ajout du token
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status} lors de la mise à jour`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('❌ Error in updateUser:', error);
      throw error;
    }
  },
};

function getDefaultStats(): Stats {
  return {
    total_users: 0,
    active_users: 0,
    sellers_count: 0,
    new_users_today: 0,
    role_distribution: {
      buyer: 0,
      seller: 0,
      admin: 0,
    },
  };
}