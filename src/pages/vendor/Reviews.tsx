// src/pages/vendor/Reviews.tsx (version corrigée)
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Star, 
  MessageSquare, 
  Download, 
  TrendingUp, 
  TrendingDown, 
  RefreshCw,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useSellerReviews } from '@/hooks/useSellerReviews';
import { ReplyDialog } from '@/components/reviews/ReplyDialog';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export default function Reviews() {
  const {
    averageRating,
    positiveReviews,
    pendingReviews,
    allReviews,
    loading,
    error,
    allReviewsPage,
    positiveReviewsPage,
    pendingReviewsPage,
    refreshAll,
    replyToReview,
    exportReviews,
    goToAllReviewsPage,
    goToPositiveReviewsPage,
    goToPendingReviewsPage,
  } = useSellerReviews();

  const [activeTab, setActiveTab] = useState('all');
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<number | null>(null);

  // Gérer la réponse à un avis
  const handleReply = async (reviewId: number, reply: string) => {
    try {
      await replyToReview(reviewId, reply);
      toast.success('Réponse envoyée avec succès');
      setReplyDialogOpen(false);
    } catch {
      toast.error('Erreur lors de l\'envoi de la réponse');
    }
  };

  // Gérer l'export
  const handleExport = async () => {
    try {
      await exportReviews();
      toast.success('Export réussi');
    } catch {
      toast.error('Erreur lors de l\'export');
    }
  };

  // Navigation pagination
  const handleAllReviewsPrevPage = () => {
    if (allReviews?.pagination.has_previous) {
      goToAllReviewsPage(allReviewsPage - 1);
    }
  };

  const handleAllReviewsNextPage = () => {
    if (allReviews?.pagination.has_next) {
      goToAllReviewsPage(allReviewsPage + 1);
    }
  };

  const handlePositiveReviewsPrevPage = () => {
    if (positiveReviews?.pagination.has_previous) {
      goToPositiveReviewsPage(positiveReviewsPage - 1);
    }
  };

  const handlePositiveReviewsNextPage = () => {
    if (positiveReviews?.pagination.has_next) {
      goToPositiveReviewsPage(positiveReviewsPage + 1);
    }
  };

  const handlePendingReviewsPrevPage = () => {
    if (pendingReviews?.pagination.has_previous) {
      goToPendingReviewsPage(pendingReviewsPage - 1);
    }
  };

  const handlePendingReviewsNextPage = () => {
    if (pendingReviews?.pagination.has_next) {
      goToPendingReviewsPage(pendingReviewsPage + 1);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <p className="text-lg font-semibold text-destructive">{error}</p>
        <Button onClick={refreshAll}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* En-tête */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Avis clients</h1>
          <p className="text-muted-foreground">Consultez et répondez aux avis sur vos produits</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={refreshAll}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          <Button 
            variant="outline" 
            onClick={handleExport}
            disabled={loading}
          >
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="shadow-md">
              <CardContent className="p-6">
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : averageRating && (
        <div className="grid gap-6 md:grid-cols-3">
          {/* Note moyenne */}
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">Note moyenne</p>
              <div className="flex items-center justify-center gap-2 mb-2">
                <p className="text-4xl font-bold text-foreground">
                  {averageRating.average_rating.value.toFixed(1)}
                </p>
                <div className="flex items-center">
                  <Star className="h-8 w-8 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1 text-muted-foreground">/5</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Sur {averageRating.summary.total_reviews} avis
              </p>
              <div className="mt-3 flex items-center justify-center gap-1">
                {averageRating.comparison.difference >= 0 ? (
                  <>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-500">
                      +{averageRating.comparison.difference.toFixed(1)} vs plateforme
                    </span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-red-500">
                      {averageRating.comparison.difference.toFixed(1)} vs plateforme
                    </span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Avis positifs */}
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">Avis positifs</p>
              <p className="text-4xl font-bold text-green-500 mb-2">
                {averageRating.summary.positive_percentage.toFixed(0)}%
              </p>
              <div className="mb-3">
                <Progress 
                  value={averageRating.summary.positive_percentage} 
                  className="h-2"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {averageRating.summary.positive_reviews} avis 4★+
              </p>
            </CardContent>
          </Card>

          {/* En attente de réponse */}
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">En attente de réponse</p>
              {pendingReviews ? (
                <>
                  <p className="text-4xl font-bold text-yellow-500 mb-2">
                    {pendingReviews.stats.total_pending}
                  </p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Attente moyenne</span>
                      <span className="font-medium">
                        {pendingReviews.stats.avg_waiting_days.toFixed(1)} jours
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Taux de réponse</span>
                      <span className="font-medium">
                        {pendingReviews.seller.response_rate}%
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <Skeleton className="h-20 w-full" />
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Distribution des notes */}
      {!loading && averageRating && (
        <Card className="shadow-md">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Distribution des notes</h3>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = averageRating.distribution[rating] || 0;
                const total = averageRating.summary.total_reviews;
                const percentage = total > 0 ? (count / total) * 100 : 0;
                
                return (
                  <div key={rating} className="flex items-center gap-4">
                    <div className="flex items-center gap-1 w-20">
                      <span className="text-sm font-medium w-4">{rating}</span>
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-muted-foreground ml-1">
                        ({count})
                      </span>
                    </div>
                    <Progress 
                      value={percentage} 
                      className="flex-1 h-3"
                    />
                    <span className="text-sm text-muted-foreground w-12 text-right">
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Tous les avis</TabsTrigger>
          <TabsTrigger value="positive">Avis positifs</TabsTrigger>
          <TabsTrigger value="pending">En attente</TabsTrigger>
          <TabsTrigger value="stats">Statistiques</TabsTrigger>
        </TabsList>

        {/* Tous les avis */}
        <TabsContent value="all" className="space-y-6">
          <Card className="shadow-md">
            <CardContent className="p-6">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-32 w-full" />
                  ))}
                </div>
              ) : allReviews && allReviews.reviews.length > 0 ? (
                <div className="space-y-6">
                  {allReviews.reviews.map((review) => (
                    <ReviewCard
                      key={review.id}
                      review={review}
                      onReply={() => {
                        setSelectedReview(review.id);
                        setReplyDialogOpen(true);
                      }}
                    />
                  ))}
                  
                  {/* Pagination */}
                  {allReviews.pagination.total_pages > 1 && (
                    <div className="flex justify-between items-center pt-4 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleAllReviewsPrevPage}
                        disabled={!allReviews.pagination.has_previous}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Précédent
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        Page {allReviewsPage} sur {allReviews.pagination.total_pages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleAllReviewsNextPage}
                        disabled={!allReviews.pagination.has_next}
                      >
                        Suivant
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Aucun avis pour le moment
                  </h3>
                  <p className="text-muted-foreground">
                    Vos clients n'ont pas encore laissé d'avis sur vos produits.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Avis positifs */}
        <TabsContent value="positive" className="space-y-6">
          <Card className="shadow-md">
            <CardContent className="p-6">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-32 w-full" />
                  ))}
                </div>
              ) : positiveReviews ? (
                <>
                  {/* Mots-clés positifs */}
                  {positiveReviews.highlights?.common_words && positiveReviews.highlights.common_words.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-semibold mb-3">Mots-clés récurrents</h4>
                      <div className="flex flex-wrap gap-2">
                        {positiveReviews.highlights.common_words.map((word, index) => (
                          <Badge key={index} variant="secondary" className="text-sm">
                            {word.word} ({word.count})
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Avis détaillés */}
                  <div className="space-y-6">
                    {positiveReviews.reviews.map((review) => (
                      <ReviewCard
                        key={review.id}
                        review={review}
                        onReply={() => {
                          setSelectedReview(review.id);
                          setReplyDialogOpen(true);
                        }}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {positiveReviews.pagination.total_pages > 1 && (
                    <div className="flex justify-between items-center pt-4 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePositiveReviewsPrevPage}
                        disabled={!positiveReviews.pagination.has_previous}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Précédent
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        Page {positiveReviewsPage} sur {positiveReviews.pagination.total_pages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePositiveReviewsNextPage}
                        disabled={!positiveReviews.pagination.has_next}
                      >
                        Suivant
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Aucun avis positif pour le moment.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* En attente */}
        <TabsContent value="pending" className="space-y-6">
          <Card className="shadow-md">
            <CardContent className="p-6">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-32 w-full" />
                  ))}
                </div>
              ) : pendingReviews && pendingReviews.reviews.length > 0 ? (
                <>
                  {/* Priorités */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {[
                      { label: 'Haute priorité', value: pendingReviews.priority_summary.high, color: 'text-red-500' },
                      { label: 'Moyenne', value: pendingReviews.priority_summary.medium, color: 'text-yellow-500' },
                      { label: 'Basse', value: pendingReviews.priority_summary.low, color: 'text-gray-500' },
                    ].map((item) => (
                      <div key={item.label} className="text-center">
                        <p className={`text-3xl font-bold ${item.color}`}>{item.value}</p>
                        <p className="text-sm text-muted-foreground">{item.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Avis en attente */}
                  <div className="space-y-6">
                    {pendingReviews.reviews.map((review) => (
                      <PendingReviewCard
                        key={review.id}
                        review={review}
                        onReply={() => {
                          setSelectedReview(review.id);
                          setReplyDialogOpen(true);
                        }}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {pendingReviews.pagination.total_pages > 1 && (
                    <div className="flex justify-between items-center pt-4 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePendingReviewsPrevPage}
                        disabled={!pendingReviews.pagination.has_previous}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Précédent
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        Page {pendingReviewsPage} sur {pendingReviews.pagination.total_pages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePendingReviewsNextPage}
                        disabled={!pendingReviews.pagination.has_next}
                      >
                        Suivant
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Aucun avis en attente
                  </h3>
                  <p className="text-muted-foreground">
                    Vous avez répondu à tous les avis. Excellent travail !
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Statistiques détaillées */}
        <TabsContent value="stats" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="shadow-md">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Performance globale</h3>
                {loading ? (
                  <Skeleton className="h-40 w-full" />
                ) : allReviews?.stats ? (
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Note moyenne</span>
                      <span className="font-semibold">
                        {allReviews.stats.average_rating.toFixed(1)}/5
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Achats vérifiés</span>
                      <span className="font-semibold">
                        {allReviews.stats.verified_percentage.toFixed(0)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Taux de réponse</span>
                      <span className="font-semibold">
                        {allReviews.stats.response_rate.toFixed(0)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avis 5★</span>
                      <span className="font-semibold">
                        {allReviews.stats.five_star_count}
                      </span>
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Comparaison plateforme</h3>
                {loading ? (
                  <Skeleton className="h-40 w-full" />
                ) : averageRating?.comparison ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Votre note</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">
                          {averageRating.average_rating.value.toFixed(1)}/5
                        </span>
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Moyenne plateforme</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">
                          {averageRating.comparison.platform_average}/5
                        </span>
                        <Star className="h-4 w-4 text-gray-300" />
                      </div>
                    </div>
                    <div className="pt-4 border-t">
                      <div className={`flex items-center gap-2 ${averageRating.comparison.difference >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {averageRating.comparison.difference >= 0 ? (
                          <TrendingUp className="h-5 w-5" />
                        ) : (
                          <TrendingDown className="h-5 w-5" />
                        )}
                        <span className="font-semibold">
                          {averageRating.comparison.difference >= 0 ? '+' : ''}
                          {averageRating.comparison.difference.toFixed(1)} points
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {averageRating.comparison.difference >= 0 
                          ? 'Au-dessus de la moyenne' 
                          : 'En dessous de la moyenne'}
                      </p>
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialogue de réponse */}
      <ReplyDialog
        open={replyDialogOpen}
        onOpenChange={setReplyDialogOpen}
        reviewId={selectedReview}
        onReply={handleReply}
        loading={loading}
        suggestedResponses={pendingReviews?.suggested_responses || []}
      />
    </div>
  );
}

// Composant pour une carte d'avis
interface ReviewCardProps {
  review: any;
  onReply: () => void;
}

function ReviewCard({ review, onReply }: ReviewCardProps) {
  const initials = review.reviewer_public_info?.full_name
    ? review.reviewer_public_info.full_name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
    : '??';

  return (
    <div className="p-4 rounded-lg bg-muted/30 space-y-3 hover:bg-muted/50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar>
            {review.reviewer_public_info?.avatar ? (
              <AvatarImage 
                src={review.reviewer_public_info.avatar} 
                alt={review.reviewer_public_info.full_name}
              />
            ) : null}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-foreground">
              {review.reviewer_public_info?.full_name || 'Anonyme'}
            </p>
            <p className="text-sm text-muted-foreground">
              {review.reviewer_public_info?.location_display || 'Localisation inconnue'}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 mb-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < review.rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <p className="text-xs text-muted-foreground">
              {review.time_ago || 'Récemment'}
            </p>
            {review.is_verified_purchase && (
              <Badge variant="secondary" className="text-xs h-5">
                ✓ Vérifié
              </Badge>
            )}
          </div>
        </div>
      </div>

      <p className="text-sm text-foreground">{review.comment}</p>

      {review.seller_reply ? (
        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex items-center gap-2 mb-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs bg-blue-100 text-blue-800">VOUS</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-foreground">Votre réponse</span>
            <span className="text-xs text-muted-foreground">
              {review.reply_date ? new Date(review.reply_date).toLocaleDateString('fr-FR') : ''}
            </span>
          </div>
          <p className="text-sm text-foreground">{review.seller_reply}</p>
        </div>
      ) : (
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2 mt-2"
          onClick={onReply}
        >
          <MessageSquare className="h-4 w-4" />
          Répondre
        </Button>
      )}
    </div>
  );
}

// Composant pour les avis en attente
interface PendingReviewCardProps {
  review: any;
  onReply: () => void;
}

function PendingReviewCard({ review, onReply }: PendingReviewCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Haute priorité';
      case 'medium': return 'Moyenne';
      default: return 'Basse';
    }
  };

  const initials = review.reviewer_public_info?.full_name
    ? review.reviewer_public_info.full_name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
    : '??';

  return (
    <div className="p-4 rounded-lg border space-y-3 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar>
            {review.reviewer_public_info?.avatar ? (
              <AvatarImage 
                src={review.reviewer_public_info.avatar} 
                alt={review.reviewer_public_info.full_name}
              />
            ) : null}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-foreground">
                {review.reviewer_public_info?.full_name || 'Anonyme'}
              </p>
              <Badge 
                className={cn("text-xs", getPriorityColor(review.priority))}
              >
                {getPriorityLabel(review.priority)}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              En attente depuis {review.waiting_days} jour{review.waiting_days > 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 mb-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < review.rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">{review.time_ago || 'Récemment'}</p>
        </div>
      </div>

      <p className="text-sm text-foreground">{review.comment}</p>

      <div className="flex justify-between items-center pt-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {review.rating} ★
          </Badge>
          {review.is_verified_purchase && (
            <Badge variant="secondary" className="text-xs">
              ✓ Achat vérifié
            </Badge>
          )}
        </div>
        <Button 
          size="sm" 
          className="gap-2"
          onClick={onReply}
        >
          <MessageSquare className="h-4 w-4" />
          Répondre maintenant
        </Button>
      </div>
    </div>
  );
}