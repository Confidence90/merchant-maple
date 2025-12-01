// src/components/listings/ListingDetail.tsx - Exemple complet

import { useEffect, useState } from 'react';
import { useListingTracking } from '@/hooks/useListingTracking';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { listingsApi } from '@/services/listingsApi';

interface ListingDetailProps {
  listingId: number;
}

export function ListingDetail({ listingId }: ListingDetailProps) {
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // 🔥 TRACKING AUTOMATIQUE DES VUES
  useListingTracking(listingId);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const listingData = await listingsApi.getListing(listingId);
        setListing(listingData);
      } catch (error) {
        console.error('Error fetching listing:', error);
      } finally {
        setLoading(false);
      }
    };

    if (listingId) {
      fetchListing();
    }
  }, [listingId]);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3 mb-4" />
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!listing) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Annonce non trouvée</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-2xl">{listing.title}</CardTitle>
          <Badge variant={listing.status === 'active' ? 'default' : 'secondary'}>
            {listing.status === 'active' ? 'Actif' : 'Inactif'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Images de l'annonce */}
        {listing.images && listing.images.length > 0 ? (
          <div className="grid grid-cols-2 gap-2">
            {listing.images.slice(0, 4).map((image: any, index: number) => (
              <img
                key={image.id}
                src={image.image}
                alt={`${listing.title} - Image ${index + 1}`}
                className="w-full h-48 object-cover rounded-lg"
              />
            ))}
          </div>
        ) : (
          <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Aucune image</p>
          </div>
        )}

        {/* Description */}
        <div>
          <h3 className="font-semibold mb-2">Description</h3>
          <p className="text-muted-foreground">{listing.description}</p>
        </div>

        {/* Informations prix et quantité */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2">Prix</h3>
            <p className="text-2xl font-bold text-primary">
              {listing.price.toLocaleString()} XOF
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Stock disponible</h3>
            <p className="text-xl font-semibold">
              {listing.available_quantity} unités
            </p>
          </div>
        </div>

        {/* Statistiques de vues (si disponibles) */}
        {(listing.views_count > 0 || listing.unique_visitors > 0) && (
          <div className="bg-muted/30 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Statistiques de visites</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Vues totales:</span>
                <p className="font-semibold">{listing.views_count}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Visiteurs uniques:</span>
                <p className="font-semibold">{listing.unique_visitors}</p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-4">
          <Button className="flex-1">Contacter le vendeur</Button>
          <Button variant="outline" className="flex-1">
            Ajouter aux favoris
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}