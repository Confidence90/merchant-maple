// src/services/reviewsApi.ts
import type { User } from '@/types/users';

const API_BASE_URL = 'http://localhost:8000/api';

const getAuthToken = (): string | null => {
  return localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
};

// Types pour les réponses API
export interface ReviewData {
  id: number;
  rating: number;
  comment: string;
  review_type: 'product' | 'seller' | 'buyer' | 'platform';
  is_verified_purchase: boolean;
  helpful_count: number;
  not_helpful_count: number;
  helpful_percentage: number;
  seller_reply: string | null;
  reply_date: string | null;
  is_edited: boolean;
  edit_date: string | null;
  created_at: string;
  updated_at: string;
  time_ago: string;
}

export interface SellerReviewData extends ReviewData {
  reviewer_public_info: {
    id: number;
    full_name: string;
    first_name: string;
    last_name: string;
    location_display: string;
    is_seller: boolean;
    created_at: string;
    avatar: string | null;
  };
  reviewed: number;
  reviewed_details: {
    id: number;
    full_name: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    location: string;
    is_seller: boolean;
    avatar: string | null;
  };
}

export interface AverageRatingResponse {
  seller: {
    id: number;
    shop_name: string;
    avatar: string | null;
  };
  average_rating: {
    value: number;
    stars: string;
    formatted: string;
  };
  summary: {
    total_reviews: number;
    verified_purchases: number;
    positive_reviews: number;
    positive_percentage: number;
    recent_reviews: number;
  };
  distribution: {
    [key: number]: number;
  };
  comparison: {
    platform_average: number;
    difference: number;
    trend: 'up' | 'down' | 'stable';
  };
}

export interface PositiveReviewsResponse {
  seller: {
    id: number;
    shop_name: string;
  };
  stats: {
    total_positive_reviews: number;
    five_star_count: number;
    four_star_count: number;
    average_positive_rating: number;
    percentage_of_total: number;
  };
  highlights: {
    common_words: Array<{ word: string; count: number }>;
    detailed_reviews: Array<{
      id: number;
      rating: number;
      excerpt: string;
      date: string;
    }>;
  };
  reviews: SellerReviewData[];
  pagination: {
    page: number;
    page_size: number;
    total_reviews: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
  };
}

export interface PendingReplyResponse {
  seller: {
    id: number;
    shop_name: string;
    response_rate: number;
  };
  stats: {
    total_pending: number;
    average_pending_rating: number;
    avg_waiting_days: number;
    oldest_pending: string;
    newest_pending: string;
    by_rating: {
      [key: number]: number;
    };
  };
  priority_summary: {
    high: number;
    medium: number;
    low: number;
  };
  reviews: Array<SellerReviewData & {
    priority: 'high' | 'medium' | 'low';
    waiting_days: number;
  }>;
  suggested_responses: Array<{
    id: number;
    template: string;
    for_rating: number[];
  }>;
  pagination: {
    page: number;
    page_size: number;
    total_reviews: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
  };
}

export interface AllReviewsResponse {
  seller: {
    id: number;
    shop_name: string;
    total_reviews: number;
    average_rating: number;
  };
  stats: {
    total_reviews: number;
    average_rating: number;
    verified_purchases: number;
    five_star_count: number;
    one_star_count: number;
    replied_reviews: number;
    rating_distribution: {
      [key: number]: number;
    };
    response_rate: number;
    verified_percentage: number;
  };
  reviews: SellerReviewData[];
  pagination: {
    page: number;
    page_size: number;
    total_reviews: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
  };
}

// Service API pour les avis
export const reviewsApi = {
  // Récupérer toutes les avis du vendeur
  async getSellerReviews(page: number = 1, pageSize: number = 10): Promise<AllReviewsResponse> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Non authentifié');
      }

      const url = `${API_BASE_URL}/reviews/seller/?page=${page}&page_size=${pageSize}`;
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des avis:', error);
      throw error;
    }
  },

  // Récupérer la note moyenne
  async getAverageRating(): Promise<AverageRatingResponse> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Non authentifié');
      }

      const url = `${API_BASE_URL}/reviews/seller/average-rating/`;
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération de la note moyenne:', error);
      throw error;
    }
  },

  // Récupérer les avis positifs
  async getPositiveReviews(page: number = 1, pageSize: number = 10): Promise<PositiveReviewsResponse> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Non authentifié');
      }

      const url = `${API_BASE_URL}/reviews/seller/positive-reviews/?page=${page}&page_size=${pageSize}`;
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des avis positifs:', error);
      throw error;
    }
  },

  // Récupérer les avis en attente de réponse
  async getPendingReply(page: number = 1, pageSize: number = 10): Promise<PendingReplyResponse> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Non authentifié');
      }

      const url = `${API_BASE_URL}/reviews/seller/pending-reply/?page=${page}&page_size=${pageSize}`;
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des avis en attente:', error);
      throw error;
    }
  },

  // Répondre à un avis
  async replyToReview(reviewId: number, reply: string): Promise<ReviewData> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Non authentifié');
      }

      const url = `${API_BASE_URL}/reviews/${reviewId}/reply/`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ reply }),
      });
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la réponse:', error);
      throw error;
    }
  },

  // Exporter les avis au format CSV
  async exportReviews(): Promise<Blob> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Non authentifié');
      }

      const url = `${API_BASE_URL}/reviews/seller/export/`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }
      
      return await response.blob();
    } catch (error) {
      console.error('Erreur lors de l\'export des avis:', error);
      throw error;
    }
  },
};