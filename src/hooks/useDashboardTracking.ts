// src/hooks/useDashboardTracking.ts
import { useEffect, useRef } from 'react';
import { vendorApi } from '@/services/vendorApi';

export function useDashboardTracking(): void {
  const hasTracked = useRef(false);
  
  useEffect(() => {
    if (!hasTracked.current) {
      console.log('🔍 Tracking dashboard view');
      hasTracked.current = true;
      
      // Track dashboard view
      const timer = setTimeout(() => {
        vendorApi.trackDashboardView()
          .then((result) => {
            console.log('✅ Dashboard view tracked');
          })
          .catch((error) => {
            console.error('Dashboard tracking error:', error);
          });
      }, 500);

      return () => clearTimeout(timer);
    }
  }, []);
}