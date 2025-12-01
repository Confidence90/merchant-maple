// hooks/useVendorPermission.ts
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

interface VendorPermission {
  can_create_listings: boolean;
  user_role: string;
  is_seller: boolean;
  is_seller_pending: boolean;
  reasons: string[];
  next_actions: string[];
}

export const useVendorPermission = () => {
  const [permission, setPermission] = useState<VendorPermission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkPermission = async (showToast = false): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Utilisateur non connecté');
      }

      const response = await fetch('http://localhost:8000/api/users/check-listing-permission/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la vérification des permissions');
      }

      const data: VendorPermission = await response.json();
      setPermission(data);

      if (showToast && !data.can_create_listings) {
        toast({
          title: "Permission refusée",
          description: data.reasons.join(', '),
          variant: "destructive",
        });
      }

      return data.can_create_listings;
    } catch (err: any) {
      setError(err.message);
      if (showToast) {
        toast({
          title: "Erreur",
          description: err.message,
          variant: "destructive",
        });
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkPermission();
  }, []);

  return { permission, loading, error, checkPermission };
};