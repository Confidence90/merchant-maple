// src/services/vendorService.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/users';

// Configuration axios avec token
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Intercepteur pour ajouter le token
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

// Types TypeScript
export interface VendorStats {
  overview: {
    total_revenue: number;
    monthly_revenue: number;
    weekly_revenue: number;
    total_orders: number;
    pending_orders: number;
    completed_orders: number;
    cancelled_orders: number;
    total_products: number;
    active_products: number;
    out_of_stock_products: number;
    draft_products: number;
    average_rating: number;
    total_reviews: number;
  };
  charts: {
    revenue_chart: Array<{
      date: string;
      revenue: number;
      orders: number;
    }>;
  };
  performance: {
    satisfaction_rate: number;
    average_shipping_time: number;
    return_rate: number;
  };
  wallet: {
    available_balance: number;
    pending_balance: number;
  };
}

export interface VendorOrder {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  product_name: string;
  amount: number;
  quantity: number;
  status: string;
  date: string;
  created_at: string;
}

export interface VendorProduct {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: string;
  sales: number;
  image?: string;
  created_at: string;
}

export interface VendorReview {
  id: number;
  customer_name: string;
  rating: number;
  comment: string;
  product_name: string;
  date: string;
  created_at: string;
}

// Services
export const vendorService = {
  // Dashboard
  async getDashboardStats(): Promise<VendorStats> {
    const response = await api.get('/vendor/dashboard/');
    return response.data;
  },

  // Commandes
  async getOrders(): Promise<{ orders: VendorOrder[]; stats: any }> {
    const response = await api.get('/vendor/orders/');
    return response.data;
  },

  // Produits
  async getProducts(): Promise<{ products: VendorProduct[] }> {
    const response = await api.get('/vendor/products/');
    return response.data;
  },

  // Avis
  async getReviews(): Promise<{ reviews: VendorReview[]; stats: any }> {
    const response = await api.get('/vendor/reviews/');
    return response.data;
  },
};