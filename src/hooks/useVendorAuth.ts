import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

export interface VendorUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  location: string;
  is_seller: boolean;
  seller_profile?: {
    id: number;
    store_name: string;
    store_status: 'pending' | 'active' | 'suspended' | 'rejected';
    store_description?: string;
    store_logo?: string;
    store_banner?: string;
    commission_rate?: number;
    total_sales?: number;
    balance?: number;
    created_at: string;
  };
}

export const useVendorAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<VendorUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const checkVendorStatus = useCallback((userData: VendorUser): { isValid: boolean; message?: string; redirectTo?: string } => {
    // Vérifier que l'utilisateur est bien un vendeur
    if (!userData.is_seller) {
      return { 
        isValid: false, 
        message: "Vous n'êtes pas inscrit en tant que vendeur",
        redirectTo: "/"
      };
    }

    // Vérifier qu'il a un profil vendeur
    if (!userData.seller_profile) {
      return { 
        isValid: false, 
        message: "Profil vendeur incomplet. Veuillez configurer votre boutique.",
        redirectTo: "/vendor-setup"
      };
    }

    // Vérifier le statut de la boutique
    switch (userData.seller_profile.store_status) {
      case 'pending':
        return { 
          isValid: false, 
          message: "Votre demande de vendeur est en cours de validation",
          redirectTo: "/vendor-setup?status=pending"
        };
      case 'suspended':
        return { 
          isValid: false, 
          message: "Votre boutique a été suspendue. Contactez l'administration.",
          redirectTo: "/contact-support"
        };
      case 'rejected':
        return { 
          isValid: false, 
          message: "Votre demande de vendeur a été rejetée",
          redirectTo: "/contact-support"
        };
      case 'active':
        return { isValid: true };
      default:
        return { 
          isValid: false, 
          message: "Statut de boutique invalide",
          redirectTo: "/"
        };
    }
  }, []);

  const login = useCallback(async (token: string, refreshToken: string, userData: VendorUser): Promise<boolean> => {
    try {
      console.log('🔍 Vérification du statut vendeur:', userData);
      
      // Vérifier le statut vendeur
      const statusCheck = checkVendorStatus(userData);
      
      if (!statusCheck.isValid) {
        console.log('❌ Statut vendeur invalide:', statusCheck.message);
        toast({
          title: "Accès non autorisé",
          description: statusCheck.message || "Vous n'avez pas les droits d'accès à l'espace vendeur.",
          variant: "destructive",
        });
        
        // Rediriger vers la page appropriée
        if (statusCheck.redirectTo) {
          navigate(statusCheck.redirectTo);
        }
        return false;
      }

      // Stocker les tokens dans localStorage (persistant)
      localStorage.setItem('vendor_access_token', token);
      localStorage.setItem('vendor_refresh_token', refreshToken);
      localStorage.setItem('vendor_user', JSON.stringify(userData));

      setUser(userData);
      setIsAuthenticated(true);

      console.log('✅ Connexion vendeur réussie pour:', userData.email);
      return true;

    } catch (error) {
      console.error('❌ Erreur lors de la connexion vendeur:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la connexion",
        variant: "destructive",
      });
      return false;
    }
  }, [checkVendorStatus, toast, navigate]);

  const logout = useCallback(async (redirectToLogin: boolean = true) => {
    try {
      // Appel API pour déconnexion (optionnel)
      const token = localStorage.getItem('vendor_access_token');
      if (token) {
        await fetch('http://localhost:8000/api/users/logout/', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }).catch(err => console.error('Erreur lors de la déconnexion API:', err));
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      // Nettoyer le stockage
      localStorage.removeItem('vendor_access_token');
      localStorage.removeItem('vendor_refresh_token');
      localStorage.removeItem('vendor_user');
      sessionStorage.removeItem('vendor_access_token');
      sessionStorage.removeItem('vendor_refresh_token');
      sessionStorage.removeItem('vendor_user');
      
      setUser(null);
      setIsAuthenticated(false);
      
      // Rediriger vers la page de login si demandé
      if (redirectToLogin) {
        navigate('/login');
      }
      
      toast({
        title: "Déconnexion",
        description: "Vous avez été déconnecté avec succès",
      });
    }
  }, [navigate, toast]);

  const checkAuth = useCallback(async () => {
    setLoading(true);
    
    try {
      const token = localStorage.getItem('vendor_access_token');
      const storedUser = localStorage.getItem('vendor_user');

      if (!token || !storedUser) {
        console.log('❌ Pas de token ou d\'utilisateur stocké');
        setIsAuthenticated(false);
        setUser(null);
        return;
      }

      // Vérifier que le token est toujours valide en appelant l'API /me
      const response = await fetch('http://localhost:8000/api/users/me/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expiré, essayer de le rafraîchir
          const refreshToken = localStorage.getItem('vendor_refresh_token');
          if (refreshToken) {
            try {
              const refreshResponse = await fetch('http://localhost:8000/api/users/token/refresh/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh: refreshToken }),
              });

              if (refreshResponse.ok) {
                const { access: newToken } = await refreshResponse.json();
                localStorage.setItem('vendor_access_token', newToken);
                
                // Réessayer avec le nouveau token
                const retryResponse = await fetch('http://localhost:8000/api/users/me/', {
                  headers: { 'Authorization': `Bearer ${newToken}` },
                });
                
                if (retryResponse.ok) {
                  const userData = await retryResponse.json();
                  const statusCheck = checkVendorStatus(userData);
                  
                  if (statusCheck.isValid) {
                    setUser(userData);
                    setIsAuthenticated(true);
                    console.log('✅ Token rafraîchi et utilisateur vérifié');
                  } else {
                    await logout(false);
                  }
                } else {
                  await logout(false);
                }
              } else {
                await logout(false);
              }
            } catch (refreshError) {
              console.error('Erreur lors du rafraîchissement:', refreshError);
              await logout(false);
            }
          } else {
            await logout(false);
          }
        } else {
          await logout(false);
        }
      } else {
        // Token valide, vérifier les données utilisateur
        const userData = await response.json();
        const statusCheck = checkVendorStatus(userData);
        
        if (statusCheck.isValid) {
          setUser(userData);
          setIsAuthenticated(true);
          console.log('✅ Authentification vendeur vérifiée');
        } else {
          await logout(false);
          // Ne pas afficher de toast ici car nous allons rediriger
        }
      }
    } catch (error) {
      console.error('❌ Erreur lors de la vérification:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [checkVendorStatus, logout]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Écouter les changements d'authentification
  useEffect(() => {
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener('authChange', handleAuthChange);
    return () => window.removeEventListener('authChange', handleAuthChange);
  }, [checkAuth]);

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    checkAuth,
  };
};