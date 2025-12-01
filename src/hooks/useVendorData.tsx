// src/hooks/useVendorData.ts
import { useState, useEffect } from 'react';
import { vendorApi, VendorStats, VendorOrder, OrdersResponse } from '@/services/vendorApi';

export function useVendorData() {
  const [stats, setStats] = useState<VendorStats | null>(null);
  const [orders, setOrders] = useState<VendorOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [statsData, ordersData] = await Promise.all([
        vendorApi.getQuickStats(),
        vendorApi.getOrders(),
      ]);
      
      setStats(statsData);
      // CORRECTION: Utiliser ordersData.results au lieu de ordersData
      setOrders(ordersData.results || []);
    } catch (err) {
      setError('Erreur lors du chargement des données');
      console.error('Error fetching vendor data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    stats,
    orders,
    loading,
    error,
    refetch: fetchData,
  };
}