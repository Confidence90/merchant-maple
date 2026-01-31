// src/hooks/useVendorOrders.ts
import { useState, useEffect } from 'react';
import { vendorApi } from '@/services/vendorApi';

export interface VendorOrderItem {
  id: number;
  listing_id: number;
  listing_title: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface VendorOrder {
  order_id: number;
  order_number: string;
  status: string;
  total_price: number;
  created_at: string;
  is_packaged: boolean;
  buyer: {
    id: number;
    name: string;  // Maintenant c'est "name" pas "first_name" et "last_name" séparés
    email: string;
    phone: string;
  };
  items: Array<{
    id: number;
    listing_id: number;
    listing_title: string;  // Maintenant c'est "listing_title" pas un objet "listing"
    quantity: number;
    price: number;
    subtotal: number;
  }>;
  shipping_info: {
    country: string;
    method: string;
  };
}

export interface VendorOrdersResponse {
  count: number;
  orders: VendorOrder[];
}

export interface OrderStats {
  total_orders: number;
  status_stats: {
    [key: string]: number;
  };
  total_revenue: number;
  monthly_orders: number;
}

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
      
      // Utiliser l'endpoint vendor/orders/ au lieu de seller-orders
      const response = await vendorApi.getVendorOrders(params);
      
      // Les données sont sous {count, orders: [...]} dans vendor/orders/
      const ordersData = response.orders || [];
      
      // Calculer les stats à partir des données
      const calculatedStats = calculateStatsFromOrders(ordersData);
      
      setOrders(ordersData);
      setStats(calculatedStats);
    } catch (err) {
      setError('Erreur lors du chargement des commandes');
      console.error('Error fetching vendor orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStatsFromOrders = (ordersData: VendorOrder[]): OrderStats => {
    const statusCount: { [key: string]: number } = {
      'En attente': 0,
      'Prêt à expédier': 0,
      'Expédié': 0,
      'Livré': 0,
      'Annulé': 0,
      'Échouée': 0,
      'Retourné': 0,
    };

    let totalRevenue = 0;
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    let monthlyOrders = 0;

    ordersData.forEach(order => {
      // Compter par statut
      const statusName = getStatusLabel(order.status) || order.status;
      statusCount[statusName] = (statusCount[statusName] || 0) + 1;
      
      // Calculer le revenu
      totalRevenue += order.total_price;
      
      // Compter les commandes du mois
      const orderDate = new Date(order.created_at);
      if (orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear) {
        monthlyOrders++;
      }
    });

    return {
      total_orders: ordersData.length,
      status_stats: statusCount,
      total_revenue: totalRevenue,
      monthly_orders: monthlyOrders,
    };
  };

  const getStatusLabel = (status: string): string => {
    const statusMap: { [key: string]: string } = {
      'pending': 'En attente',
      'ready_to_ship': 'Prêt à expédier',
      'shipped': 'Expédié',
      'delivered': 'Livré',
      'cancelled': 'Annulé',
      'failed': 'Échouée',
      'returned': 'Retourné',
    };
    return statusMap[status] || status;
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      // Mettre à jour localement d'abord
      setOrders(prev => prev.map(order => 
        order.order_id === orderId ? { ...order, status: newStatus } : order
      ));
      
      // Envoyer la mise à jour au serveur
      await vendorApi.updateOrderStatus(orderId, newStatus);
      return true;
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