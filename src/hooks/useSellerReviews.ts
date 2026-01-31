// src/hooks/useSellerReviews.ts (version corrigée)
import { useState, useEffect } from 'react';
import { reviewsApi } from '@/services/reviewsApi';
import type {
  AverageRatingResponse,
  PositiveReviewsResponse,
  PendingReplyResponse,
  AllReviewsResponse,
} from '@/services/reviewsApi';

export function useSellerReviews() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // États pour les différentes données
  const [averageRating, setAverageRating] = useState<AverageRatingResponse | null>(null);
  const [positiveReviews, setPositiveReviews] = useState<PositiveReviewsResponse | null>(null);
  const [pendingReviews, setPendingReviews] = useState<PendingReplyResponse | null>(null);
  const [allReviews, setAllReviews] = useState<AllReviewsResponse | null>(null);

  // États de pagination
  const [allReviewsPage, setAllReviewsPage] = useState(1);
  const [positiveReviewsPage, setPositiveReviewsPage] = useState(1);
  const [pendingReviewsPage, setPendingReviewsPage] = useState(1);

  // Fonctions de récupération
  const fetchAverageRating = async () => {
    try {
      const data = await reviewsApi.getAverageRating();
      setAverageRating(data);
      return data;
    } catch (err) {
      setError('Erreur lors du chargement de la note moyenne');
      console.error(err);
      throw err;
    }
  };

  const fetchPositiveReviews = async (page: number = positiveReviewsPage) => {
    try {
      setLoading(true);
      const data = await reviewsApi.getPositiveReviews(page);
      setPositiveReviews(data);
      setPositiveReviewsPage(page);
      setError(null);
      return data;
    } catch (err) {
      setError('Erreur lors du chargement des avis positifs');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingReviews = async (page: number = pendingReviewsPage) => {
    try {
      setLoading(true);
      const data = await reviewsApi.getPendingReply(page);
      setPendingReviews(data);
      setPendingReviewsPage(page);
      setError(null);
      return data;
    } catch (err) {
      setError('Erreur lors du chargement des avis en attente');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchAllReviews = async (page: number = allReviewsPage) => {
    try {
      setLoading(true);
      const data = await reviewsApi.getSellerReviews(page);
      setAllReviews(data);
      setAllReviewsPage(page);
      setError(null);
      return data;
    } catch (err) {
      setError('Erreur lors du chargement de tous les avis');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Répondre à un avis
  const replyToReview = async (reviewId: number, reply: string) => {
    try {
      await reviewsApi.replyToReview(reviewId, reply);
      
      // Recharger les données pertinentes
      await Promise.all([
        fetchAverageRating(),
        fetchAllReviews(allReviewsPage),
        fetchPendingReviews(pendingReviewsPage),
      ]);
      
      return true;
    } catch (err) {
      setError('Erreur lors de l\'envoi de la réponse');
      console.error(err);
      throw err;
    }
  };

  // Exporter les avis
  const exportReviews = async () => {
    try {
      const blob = await reviewsApi.exportReviews();
      
      // Créer un lien de téléchargement
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `avis-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      return true;
    } catch (err) {
      setError('Erreur lors de l\'export');
      console.error(err);
      throw err;
    }
  };

  // Chargement initial
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchAverageRating(),
          fetchAllReviews(1),
          fetchPendingReviews(1),
          fetchPositiveReviews(1),
        ]);
      } catch (err) {
        setError('Erreur lors du chargement initial des données');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  return {
    // Données
    averageRating,
    positiveReviews,
    pendingReviews,
    allReviews,
    
    // États
    loading,
    error,
    allReviewsPage,
    positiveReviewsPage,
    pendingReviewsPage,
    
    // Fonctions de récupération
    fetchAverageRating,
    fetchPositiveReviews,
    fetchPendingReviews,
    fetchAllReviews,
    
    // Fonctions d'action
    replyToReview,
    exportReviews,
    
    // Navigation pagination
    goToAllReviewsPage: (page: number) => fetchAllReviews(page),
    goToPositiveReviewsPage: (page: number) => fetchPositiveReviews(page),
    goToPendingReviewsPage: (page: number) => fetchPendingReviews(page),
    
    // Rafraîchir toutes les données
    refreshAll: async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchAverageRating(),
          fetchAllReviews(allReviewsPage),
          fetchPendingReviews(pendingReviewsPage),
          fetchPositiveReviews(positiveReviewsPage),
        ]);
      } finally {
        setLoading(false);
      }
    },
  };
}