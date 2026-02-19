// src/services/listingsApi.ts - Créez ce fichier si nécessaire

import axios, { AxiosInstance } from 'axios';

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
});
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export const listingsApi = {
  getListing: async (listingId: number): Promise<any> => {
    const response = await apiClient.get(`/api/listings/${listingId}/`);
    return response.data;
  },

  getListings: async (params?: any): Promise<any> => {
    const response = await apiClient.get('/api/listings/', { params });
    return response.data;
  },

  createListing: async (listingData: any): Promise<any> => {
    const response = await apiClient.post('/api/listings/', listingData);
    return response.data;
  },

  updateListing: async (listingId: number, listingData: any): Promise<any> => {
    const response = await apiClient.put(`/api/listings/listings/${listingId}/update/`, listingData);
    return response.data;
  },

  deleteListing: async (listingId: number): Promise<void> => {
    await apiClient.delete(`/api/listings/${listingId}/`);
  },
   partialUpdateListing: async (listingId: number, listingData: any) => {
    const response = await apiClient.patch(`/api/listings/listings/${listingId}/update/`, listingData);
    return response.data;
  },

  deeleteListing: async (listingId: number) => {
    await apiClient.delete(`/api/listings/${listingId}/delete/`);
  },

  bulkDelete: async (listingIds: number[]) => {
    const response = await apiClient.post('/api/listings/bulk-delete/', { listing_ids: listingIds });
    return response.data;
  },

  toggleStatus: async (listingId: number, status: 'active' | 'expired') => {
    const response = await apiClient.post(`/api/listings/${listingId}/toggle-status/`, { status });
    return response.data;
  },

  deleteImage: async (listingId: number, imageId: number) => {
    const response = await apiClient.delete(`/api/listings/${listingId}/delete-image/`, { data: { image_id: imageId } });
    return response.data;
  },

  getMyListings: async () => {
    const response = await apiClient.get('/api/my-listings/');
    return response.data;
  },
  
};