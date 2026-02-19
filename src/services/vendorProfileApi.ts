// src/services/vendorProfileApi.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Intercepteur pour ajouter le token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export interface VendorProfileData {
  // Informations boutique
  shop_name: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  customer_service_name?: string;
  customer_service_phone?: string;
  customer_service_email?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  region?: string;
  
  // Informations société
  account_type: 'individual' | 'company';
  company_name?: string;
  legal_representative?: string;
  id_type?: string;
  tax_id?: string;
  vat_number?: string;
  legal_address?: string;
  
  // Informations expédition
  shipping_zone?: string;
  use_business_address?: boolean;
  shipping_address_line1?: string;
  shipping_address_line2?: string;
  shipping_city?: string;
  shipping_state?: string;
  shipping_zip?: string;
  return_address_line1?: string;
  return_address_line2?: string;
  return_city?: string;
  return_state?: string;
  return_zip?: string;
  
  // Informations complémentaires
  has_existing_shop?: 'yes' | 'no';
  vendor_type?: 'retailer' | 'wholesaler' | 'manufacturer' | 'distributor' | 'individual';
  
  // Métadonnées (lecture seule)
  id?: number;
  is_completed?: boolean;
  created_at?: string;
  updated_at?: string;
  user_email?: string;
  user_phone?: string;
  user_country_code?: string;
  user_first_name?: string;
  user_last_name?: string;

  status?: 'pending' | 'approved' | 'rejected' | 'suspended';
  verification_status?: 'pending' | 'verified' | 'rejected';
  kyc_confidence_score?: number;
  kyc_submitted_at?: string;
  business_license?: string;
  verification_documents?: {
    id_front?: string;
    id_back?: string;
    proof_of_address?: string;
    business_registration?: string;
  };
}

export interface VendorStatus {
  is_seller: boolean;
  is_seller_pending: boolean;
  has_vendor_profile: boolean;
  vendor_profile_completed: boolean;
  requires_kyc: boolean;
  role: string;
}

export const vendorProfileApi = {
  // Vérifier le statut vendeur
  async checkVendorStatus(): Promise<VendorStatus> {
    const response = await api.get('/users/vendor/check-status/');
    return response.data;
  },

  // Récupérer le profil vendeur
  async getVendorProfile(): Promise<VendorProfileData> {
    try {
      const response = await api.get('/users/vendor/profile/');
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        // Retourner un objet vide si pas de profil
        return {
          shop_name: '',
          contact_name: '',
          contact_email: '',
          contact_phone: '',
          account_type: 'individual',
          shipping_zone: 'Bamako',
          has_existing_shop: 'no',
          vendor_type: 'retailer'
        };
      }
      throw error;
    }
  },

  // Créer un nouveau profil vendeur
  async createVendorProfile(data: Partial<VendorProfileData>): Promise<VendorProfileData> {
    const response = await api.post('/users/vendor/profile/', data);
    return response.data;
  },

  // Mettre à jour complètement le profil vendeur
  async updateVendorProfile(data: Partial<VendorProfileData>): Promise<VendorProfileData> {
    const response = await api.put('/users/vendor/profile/', data);
    return response.data;
  },

  // Mettre à jour partiellement le profil vendeur
  async patchVendorProfile(data: Partial<VendorProfileData>): Promise<VendorProfileData> {
    const response = await api.patch('/users/vendor/profile/', data);
    return response.data;
  },

  // Méthode intelligente qui choisit entre création et mise à jour
  async saveVendorProfile(data: Partial<VendorProfileData>): Promise<VendorProfileData> {
    try {
      // D'abord vérifier si un profil existe
      const existingProfile = await this.getVendorProfile();
      
      if (existingProfile.id) {
        // Profil existe, utiliser PATCH pour mise à jour partielle
        return await this.patchVendorProfile(data);
      } else {
        // Pas de profil, créer un nouveau
        return await this.createVendorProfile(data);
      }
    } catch (error: any) {
      // Si la vérification échoue, essayer de créer
      if (error.response?.status === 404) {
        return await this.createVendorProfile(data);
      }
      throw error;
    }
  },

  // Créer un profil vendeur initial (méthode simplifiée)
  async createBasicVendorProfile(shopName: string, accountType: string = 'individual'): Promise<any> {
    const response = await api.post('/users/vendor/create-profile/', {
      shop_name: shopName,
      account_type: accountType
    });
    return response.data;
  },

  // Activer le statut vendeur
  async activateVendorStatus(): Promise<any> {
    const response = await api.post('/users/vendor/activate/');
    return response.data;
  },

  // Vérifier si le setup est complété
  async checkSetup(): Promise<{has_profile: boolean; is_completed: boolean}> {
    const response = await api.get('/users/vendor/check-setup/');
    return response.data;
  },

  // Mettre à jour le profil utilisateur (pour l'avatar)
  async updateUserProfile(data: { avatar?: File }): Promise<any> {
    const formData = new FormData();
    if (data.avatar) {
      formData.append('avatar', data.avatar);
    }
    
    try {
      const response = await api.patch('/users/profile/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 405) {
        // Si PATCH n'est pas autorisé, utiliser PUT
        const response = await api.put('/users/profile/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      }
      throw error;
    }
  },

  // Récupérer le profil utilisateur
  async getUserProfile(): Promise<any> {
    const response = await api.get('/users/profile/');
    return response.data;
  }
};