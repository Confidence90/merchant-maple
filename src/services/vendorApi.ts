// src/services/vendorApi.ts
import axios from 'axios';
import { VendorProfile, VendorStatus, VendorKYCData } from "@/types/vendor";
const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Intercepteur pour ajouter le token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['Cache-Control'] = 'no-cache'
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export interface VendorStats {
  user_status: {
    is_seller: boolean;
    has_vendor_profile: boolean;
    role: string;
    shop_name: string;
  };
  orders: {
    total: number;
    pending: number;
    confirmed: number;
    completed: number;
    shipped: number;
    cancelled: number;
  };
  
  products: {
    total: number;
    active: number;
    out_of_stock: number;
    sold_out: number;
    draft: number;
  };
  financial: {
    total_revenue: number;
    currency: string;
  };
  reviews?: {
    average_rating: number;
    total_reviews: number;
  };
   visitors: {
    unique_visitors: {
      current: number;
      previous: number;
      change: number;
    };
    total_views: {
      current: number;
      previous: number;
      change: number;
    };
    views_today: number;
    avg_time_on_site: number;
  };
  popular_listings: Array<{
    id: number;
    title: string;
    price: number;
    total_views: number;
    unique_visitors: number;
    conversion_rate: number;
    status: string;
    image_url?: string;
  }>;
  category_analytics: {
    top_selling_categories: Array<any>;
    most_viewed_categories: Array<any>;
    category_performance: Array<any>;
  };
  overview: {
    revenue: {
      current: number;
      previous: number;
      change: number;
      currency: string;
    };
  };
}
export interface VendorOrderFromEndpoint {
  order_id: number;
  order_number: string;
  buyer: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
  items: Array<{
    id: number;
    listing_id: number;
    listing_title: string;
    quantity: number;
    price: number;
    subtotal: number;
  }>;
  total_price: number;
  status: string;
  created_at: string;
  is_packaged: boolean;
  shipping_info: {
    country: string;
    method: string;
  };
}
export interface VendorOrdersResponse {
  count: number;
  orders: VendorOrderFromEndpoint[];
}
export interface VendorOrder {
  id: number;
  order_number: string;
  status: string;
  total_price: number;
  created_at: string;
  updated_at: string;
  buyer: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  items: Array<{
    id: number;
    listing: {
      id: number;
      title: string;
      price: number;
    };
    quantity: number;
    price: number;
  }>;
  shipping_address?: string;
  customer_notes?: string;
  shipping_method?: string;
  shipping_country?: string;
}
export interface VendorProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  category_name: string;
  status: string;
  quantity: number;
  quantity_sold: number;
  available_quantity: number;
  is_out_of_stock: boolean;
  condition: string;
  type: string;
  location: string;
  is_featured: boolean;
  images: Array<{
    id: number;
    image: string;
  }>;
  created_at: string;
  updated_at: string;
}

export interface ProductsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: VendorProduct[];
}
export interface OrdersResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: VendorOrder[];
}
export interface OrderStats {
  total_orders: number;
  status_stats: {
    [key: string]: number;
  };
  total_revenue: number;
  monthly_orders: number;
}

export const vendorApi = {

    async getUserProfile() {
    const { data } = await api.get("profile/");
    return data;
  },

  async updateUserAvatar(file: File) {
    const form = new FormData();
    form.append("avatar", file);

    const { data } = await api.patch("profile/", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  /* =======================
        VENDOR STATUS
  ======================== */
  async checkStatus(): Promise<VendorStatus> {
    const { data } = await api.get("vendor/check-status/");
    return data;
  },

  async activateVendor() {
    const { data } = await api.post("vendor/activate/");
    return data;
  },

  /* =======================
        VENDOR PROFILE
  ======================== */
  async getVendorProfile(): Promise<VendorProfile | null> {
    try {
      const { data } = await api.get("vendor/profile/");
      return data;
    } catch (err: any) {
      if (err.response?.status === 404) return null;
      throw err;
    }
  },

  async createVendorProfile(payload: Partial<VendorProfile>): Promise<VendorProfile> {
    const { data } = await api.post("vendor/profile/", payload);
    return data;
  },

  async updateVendorProfile(payload: Partial<VendorProfile>): Promise<VendorProfile> {
    const { data } = await api.patch("vendor/profile/", payload);
    return data;
  },

  async saveVendorProfile(payload: Partial<VendorProfile>): Promise<VendorProfile> {
    const profile = await this.getVendorProfile();
    if (profile?.id) return this.updateVendorProfile(payload);
    return this.createVendorProfile(payload);
  },

  /* =======================
             KYC
  ======================== */
submitKYC: (data: {
  id_type: string;
  id_number: string;
  id_front: File;
  id_back?: File;
  selfie_with_id: File;
  proof_of_address?: File;
  business_registration?: File;
}) => {
  const formData = new FormData();
  formData.append("id_type", data.id_type);
  formData.append("id_number", data.id_number);
  formData.append("id_front_image", data.id_front);
  if (data.id_back) formData.append("id_back_image", data.id_back);
  formData.append("selfie_with_id", data.selfie_with_id);
  if (data.proof_of_address) formData.append("proof_of_address", data.proof_of_address);
    if (data.business_registration) formData.append("business_registration", data.business_registration);
  return api.post("/users/vendor/kyc/submit/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
},



  // Récupérer les statistiques rapides
  async getQuickStats(): Promise<VendorStats> {
    const response = await api.get('/users/vendor/quick-stats/');
    return response.data;
  },

  // Récupérer les statistiques détaillées
  async getDetailedStats() {
    const response = await api.get('/users/vendor/stats/');
    return response.data;
  },

  // Récupérer les commandes
  async getOrders(): Promise<OrdersResponse> {
    const response = await api.get('/commandes/seller-orders/'); 
    return response.data;
  },


  // Récupérer les produits
  async getVendorProducts(): Promise<ProductsResponse> {
    const response = await api.get('/listings/listings/?my_listings=true');
    return response.data;
  },

  // Récupérer un produit spécifique
  async getProduct(id: number): Promise<VendorProduct> {
    const response = await api.get(`/listings/listings/${id}/`);
    return response.data;
  },

  // Mettre à jour un produit
  async updateProduct(id: number, data: Partial<VendorProduct>): Promise<VendorProduct> {
    const response = await api.patch(`/listings/listings/${id}/`, data);
    return response.data;
  },

  // Supprimer un produit
  async deleteProduct(id: number): Promise<void> {
    await api.delete(`/listings/listings/${id}/`);
  },

  // Créer un nouveau produit
  async createProduct(data: FormData): Promise<VendorProduct> {
    const response = await api.post('/listings/listings/', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  async getVendorOrders(params?: {
    status?: string;
    search?: string;
    date_from?: string;
    date_to?: string;
  }): Promise<VendorOrdersResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.status) queryParams.append('status', params.status);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.date_from) queryParams.append('date_from', params.date_from);
    if (params?.date_to) queryParams.append('date_to', params.date_to);
    
    const queryString = queryParams.toString();
    const url = `/commandes/vendor/orders/${queryString ? `?${queryString}` : ''}`;
    
    const response = await api.get(url);
    return response.data;
  },
  async getOrderStats(): Promise<OrderStats> {
    const response = await api.get('/commandes/stats/');
    return response.data;
  },

  // Mettre à jour le statut d'une commande
  async updateOrderStatus(orderId: number, status: string): Promise<VendorOrder> {
    const response = await api.patch(`/commandes/${orderId}/`, { status });
    return response.data;
  },

  // Exporter les commandes
  async exportOrders(params?: {
    status?: string;
    date_from?: string;
    date_to?: string;
  }): Promise<Blob> {
    const queryParams = new URLSearchParams();
    
    if (params?.status) queryParams.append('status', params.status);
    if (params?.date_from) queryParams.append('date_from', params.date_from);
    if (params?.date_to) queryParams.append('date_to', params.date_to);
    
    const queryString = queryParams.toString();
    const url = `/commandes/export/${queryString ? `?${queryString}` : ''}`;
    
    const response = await api.get(url, { responseType: 'blob' });
    return response.data;
  },
   trackListingView: async (listingId: number): Promise<any> => {
    try {
        console.log(`📊 Tracking view for listing ${listingId}`);
        const response = await api.post(`/listings/listings/${listingId}/track-view/`);
        console.log('✅ View tracked successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error tracking listing view:', error);
        // Ne pas throw l'erreur pour ne pas bloquer l'UI
    }
},
async trackDashboardView(): Promise<any> {
    try {
      console.log('📊 Tracking dashboard view');
      const response = await api.post('/users/track-dashboard-view/');
      console.log('✅ Dashboard view tracked successfully');
      return response.data;
    } catch (error) {
      console.error('Error tracking dashboard view:', error);
    }
  },
};