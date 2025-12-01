// src/hooks/useUsersManagement.tsx - VERSION CORRIGÉE
import { useState, useEffect } from 'react';
import { usersApi } from '@/services/usersApi';
import type { User, Stats } from '@/types/users';

export function useUsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async (params?: {
    role?: string;
    search?: string;
    is_active?: boolean;
  }) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Fetching users with params:', params);
      
      const [usersResponse, statsData] = await Promise.all([
        usersApi.getUsers(params),
        usersApi.getUserStats(),
      ]);
      
      console.log('✅ Users data loaded:', usersResponse);
      console.log('✅ Stats data loaded:', statsData);
      
      // 🔥 CORRECTION: S'assurer que les données sont cohérentes
      const usersData = usersResponse.results || [];
      
      // Ajouter des valeurs par défaut pour les champs manquants
      const enrichedUsers = usersData.map(user => ({
        ...user,
        role: user.role || (user.is_seller ? 'seller' : 'buyer'),
        is_active: user.is_active !== undefined ? user.is_active : true,
        is_verified: user.is_verified !== undefined ? user.is_verified : true,
      }));
      
      setUsers(enrichedUsers);
      setStats(statsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des utilisateurs';
      setError(errorMessage);
      console.error('❌ Error fetching users:', err);
      
      // Mettre des données vides en cas d'erreur
      setUsers([]);
      setStats(getDefaultStats());
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userId: number, data: Partial<User>) => {
    try {
      console.log('🔄 Updating user:', userId, data);
      const updatedUser = await usersApi.updateUser(userId, data);
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, ...updatedUser } : user
      ));
      return updatedUser;
    } catch (err) {
      console.error('❌ Error updating user:', err);
      throw new Error('Erreur lors de la mise à jour');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    stats,
    loading,
    error,
    refetch: fetchUsers,
    updateUser,
  };
}

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