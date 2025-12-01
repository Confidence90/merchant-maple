// components/VendorPermissionGuard.tsx
import { ReactNode } from 'react';
import { useVendorPermission } from '@/hooks/useVendorPermission';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Store, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface VendorPermissionGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function VendorPermissionGuard({ 
  children, 
  fallback 
}: VendorPermissionGuardProps) {
  const { permission, loading, error, checkPermission } = useVendorPermission();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Vérification des permissions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            Erreur
          </CardTitle>
          <CardDescription>
            Impossible de vérifier vos permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <Button onClick={() => checkPermission(true)}>
            Réessayer
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!permission?.can_create_listings) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <Store className="h-6 w-6 text-yellow-600" />
            </div>
            <CardTitle>Accès réservé aux vendeurs</CardTitle>
            <CardDescription>
              Vous devez être un vendeur vérifié pour publier des annonces
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Affichage des raisons du refus */}
            {permission?.reasons.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-medium text-red-800 mb-2">Raisons :</h4>
                <ul className="text-sm text-red-700 space-y-1">
                  {permission.reasons.map((reason, index) => (
                    <li key={index}>• {reason}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions suggérées */}
            {permission?.next_actions.filter(Boolean).length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">Actions recommandées :</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  {permission.next_actions.filter(Boolean).map((action, index) => (
                    <li key={index}>• {action}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-col gap-2 pt-4">
              <Button 
                onClick={() => navigate('/vendor/setup')}
                className="w-full"
              >
                <UserCheck className="h-4 w-4 mr-2" />
                Devenir vendeur
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => navigate('/products')}
                className="w-full"
              >
                Retour aux annonces
              </Button>

              <Button 
                variant="ghost" 
                onClick={() => checkPermission(true)}
                className="w-full"
              >
                Vérifier à nouveau
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}