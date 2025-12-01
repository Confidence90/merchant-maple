// src/hooks/useVendorOrders.ts
import { useState, useEffect } from 'react';
import { vendorApi, VendorOrder, OrderStats } from '@/services/vendorApi';

export function useVendorOrders() {
  const [orders, setOrders] = useState<VendorOrder[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async (params?: {
    status?: string;
    search?: string;
    date_from?: string;
    date_to?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      
      const [ordersResponse, statsData] = await Promise.all([
        vendorApi.getVendorOrders(params),
        vendorApi.getOrderStats(),
      ]);
      
      setOrders(ordersResponse.results || []);
      setStats(statsData);
    } catch (err) {
      setError('Erreur lors du chargement des commandes');
      console.error('Error fetching vendor orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const updatedOrder = await vendorApi.updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(order => 
        order.id === orderId ? updatedOrder : order
      ));
      return updatedOrder;
    } catch (err) {
      console.error('Error updating order status:', err);
      throw new Error('Erreur lors de la mise à jour du statut');
    }
  };

  const exportOrders = async (params?: {
    status?: string;
    date_from?: string;
    date_to?: string;
  }) => {
    try {
      const blob = await vendorApi.exportOrders(params);
      
      // Créer un lien de téléchargement
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `commandes-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      return true;
    } catch (err) {
      console.error('Error exporting orders:', err);
      throw new Error('Erreur lors de l\'export des commandes');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    orders,
    stats,
    loading,
    error,
    refetch: fetchOrders,
    updateOrderStatus,
    exportOrders,
  };
}