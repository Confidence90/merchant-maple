// src/types/users.ts
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  phone: string;
  country_code: string;
  shop_name?: string;
  location: string;
  role: 'buyer' | 'seller' | 'admin';
  is_staff: boolean;
  is_superuser: boolean;
  is_active: boolean;
  is_verified: boolean;
  is_seller: boolean;
  is_seller_pending: boolean;
  auth_provider: string;
  created_at: string;
  last_login: string;
  vendor_profile?: {
    shop_name: string;
    is_completed: boolean;
  };
}

export interface UsersResponse {
  count: number;
  results: User[];
}

export interface Stats {
  total_users: number;
  active_users: number;
  sellers_count: number;
  new_users_today: number;
  role_distribution: {
    buyer: number;
    seller: number;
    admin: number;
  };
}