// src/services/listingsApi.ts - Créez ce fichier si nécessaire

import axios, { AxiosInstance } from 'axios';

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
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
    const response = await apiClient.put(`/api/listings/${listingId}/`, listingData);
    return response.data;
  },

  deleteListing: async (listingId: number): Promise<void> => {
    await apiClient.delete(`/api/listings/${listingId}/`);
  },
};