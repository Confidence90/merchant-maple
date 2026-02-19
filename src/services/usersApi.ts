// src/services/usersApi.ts
import axios from "axios";
import type { User, UsersResponse, Stats } from "@/types/users";

const API_BASE_URL = "http://localhost:8000/api";

// --------------------
// Axios instance
// --------------------
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// --------------------
// Token helpers
// --------------------
const getAuthToken = (): string | null =>
  localStorage.getItem("access_token") || sessionStorage.getItem("access_token");

const setAuthStorage = (
  data: { access: string; refresh?: string; user: any },
  rememberMe: boolean
) => {
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem("access_token", data.access);
  if (data.refresh) storage.setItem("refresh_token", data.refresh);
  storage.setItem("user", JSON.stringify(data.user));
};

// Interceptor pour injecter le token
api.interceptors.request.use((config) => {
    if (config.url?.includes('/users/login/')) {
    return config;
  }
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --------------------
// Types
// --------------------
export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password2: string;
  country_code: string;
  phone: string;
  location: string;
  is_seller: boolean;
  shop_name?: string;
}

// --------------------
// USERS API
// --------------------
export const usersApi = {
  // ---------- AUTH ----------
  async login(payload: LoginPayload, rememberMe = false) {
    const res = await api.post("/users/login/", payload);

    const user = {
      id: res.data.id,
      email: res.data.email,
      full_name: res.data.full_name,
    };

    setAuthStorage(
      {
        access: res.data.access,
        refresh: res.data.refresh,
        user,
      },
      rememberMe
    );

    window.dispatchEvent(new Event("authChange"));
    return user;
  },

  async signup(payload: SignupPayload) {
    const res = await api.post("/users/register/vendor/", payload);
    return res.data;
  },

  async checkEmailExists(email: string): Promise<boolean> {
    const res = await api.post("/users/check-email/", {
      email: email.toLowerCase(),
    });
    return res.data.exists;
  },

  // ---------- GOOGLE ----------
  async loginWithGoogle(idToken: string, rememberMe = false) {
    const res = await api.post("/users/google/login/", {
      id_token: idToken,
    });

    const user = {
      id: res.data.id,
      email: res.data.email,
      names: res.data.full_name || `${res.data.first_name} ${res.data.last_name}`,
    };

    setAuthStorage(
      {
        access: res.data.access || res.data.token,
        refresh: res.data.refresh,
        user,
      },
      rememberMe
    );

    window.dispatchEvent(new Event("authChange"));
    return user;
  },

  // ---------- GITHUB ----------
  getGithubRedirectUrl() {
    const githubClientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    if (!githubClientId) throw new Error("GitHub Client ID manquant");
    return `https://github.com/login/oauth/authorize?client_id=${githubClientId}&scope=user:email`;
  },

  async loginWithGithubCode(code: string, rememberMe = false) {
    const res = await api.post("/users/github-login/", { code });

    const user = {
      id: res.data.id,
      email: res.data.email,
      names: res.data.full_name,
    };

    setAuthStorage(
      {
        access: res.data.access || res.data.token,
        refresh: res.data.refresh,
        user,
      },
      rememberMe
    );

    window.dispatchEvent(new Event("authChange"));
    return user;
  },

  // ---------- ADMIN USERS ----------
  async getUsers(params?: {
    role?: string;
    search?: string;
    is_active?: boolean;
  }): Promise<UsersResponse> {
    const queryParams = new URLSearchParams();

    if (params?.role) queryParams.append("role", params.role);
    if (params?.search) queryParams.append("search", params.search);
    if (params?.is_active !== undefined)
      queryParams.append("is_active", params.is_active.toString());

    const res = await api.get(`/users/admin/users/?${queryParams.toString()}`);
    return res.data;
  },

  async getUserStats(): Promise<Stats> {
    const res = await api.get("/users/admin/stats/");
    return res.data;
  },

  async updateUser(userId: number, data: Partial<User>): Promise<User> {
    const res = await api.patch(`/users/admin/users/${userId}/`, data);
    return res.data;
  },
};
