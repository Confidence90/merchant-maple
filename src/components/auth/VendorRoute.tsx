import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useVendorAuth } from '@/hooks/useVendorAuth';
import { Skeleton } from '@/components/ui/skeleton';

interface VendorRouteProps {
  children: ReactNode;
}

export default function VendorRoute({ children }: VendorRouteProps) {
  const { isAuthenticated, loading } = useVendorAuth();
  const location = useLocation();

  // Log pour le débogage
  useEffect(() => {
    console.log('🔐 VendorRoute - Auth status:', { isAuthenticated, loading, path: location.pathname });
  }, [isAuthenticated, loading, location]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="space-y-4 w-full max-w-md">
          <Skeleton className="h-8 w-64 mx-auto" />
          <Skeleton className="h-4 w-48 mx-auto" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('🔐 VendorRoute - Non authentifié, redirection vers /login');
    // Rediriger vers la page de login avec l'URL de retour
    return (
      <Navigate 
        to="/login" 
        state={{ from: location, intendedRoute: 'vendor' }} 
        replace 
      />
    );
  }

  console.log('🔐 VendorRoute - Authentifié, accès autorisé');
  return <>{children}</>;
}