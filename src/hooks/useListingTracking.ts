// src/hooks/useListingTracking.ts - Version corrigée

import { useEffect, useRef } from 'react';
import { vendorApi } from '@/services/vendorApi';

export function useListingTracking(listingId: number): void {
  const hasTracked = useRef(false);
  useEffect(() => {
    if (listingId && !hasTracked.current) {
      console.log(`🔍 useListingTracking: Tracking view for listing ${listingId}`);
      // Track view when component mounts

      hasTracked.current = true;
      // Délai léger pour s'assurer que le composant est monté
      const timer = setTimeout(() => {
        vendorApi.trackListingView(listingId)
          .then((result) => {
            if (result) {
              console.log(`✅ View tracked: ${result.views_count} total views`);
            }
          })
          .catch((error) => {
            console.error('Hook tracking error:', error);
          });
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [listingId]);
}