// src/components/dashboard/Dashboard.tsx
import { TrendingUp, Package, ShoppingCart, DollarSign, Eye, Users, AlertCircle } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentOrders } from "@/components/dashboard/RecentOrders";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useVendorData } from "@/hooks/useVendorData";
import { Skeleton } from "@/components/ui/skeleton";
import { useListingTracking } from "@/hooks/useListingTracking";
import { useDashboardTracking } from "@/hooks/useDashboardTracking";

export default function Dashboard() {
  const { stats, orders, loading, error } = useVendorData();
  useListingTracking(0);
  useDashboardTracking();

  if (loading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Tableau de bord</h1>
          <p className="text-muted-foreground">Bienvenue sur votre espace vendeur</p>
        </div>
        <Card className="p-6 text-center">
          <p className="text-destructive">{error || 'Aucune donnée disponible'}</p>
        </Card>
      </div>
    );
  }

  const { 
    orders: orderStats, 
    products: productStats, 
    financial,
    reviews,
    visitors,
    popular_listings,
    category_analytics 
  } = stats;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Tableau de bord</h1>
        <p className="text-muted-foreground">Bienvenue sur votre espace vendeur - {stats.user_status.shop_name}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Chiffre d'affaires"
          value={`${financial.total_revenue.toLocaleString()} ${financial.currency}`}
          change="+12,5% vs. mois dernier"
          changeType="positive"
          icon={DollarSign}
          iconBg="bg-success/10"
        />
        <StatCard
          title="Ventes totales"
          value={orderStats.completed.toString()}
          change="+8,2% vs. mois dernier"
          changeType="positive"
          icon={TrendingUp}
        />
        <StatCard
          title="Produits actifs"
          value={productStats.active.toString()}
          change={`${productStats.out_of_stock} en rupture`}
          changeType={productStats.out_of_stock > 0 ? "negative" : "neutral"}
          icon={Package}
        />
        <StatCard
          title="Commandes en cours"
          value={orderStats.pending.toString()}
          change={`${orderStats.confirmed} confirmées`}
          changeType="neutral"
          icon={ShoppingCart}
        />
        <StatCard
          title="Visiteurs uniques"
          value={visitors?.unique_visitors?.current?.toString() || "0"}
          change={
            visitors?.unique_visitors?.change 
              ? `${visitors.unique_visitors.change}% vs. mois dernier`
              : "Données indisponibles"
          }
          changeType={
            (visitors?.unique_visitors?.change || 0) >= 0 ? "positive" : "negative"
          }
          icon={Users}
          iconBg="bg-primary/10"
        />
        <StatCard
          title="Vues totales"
          value={visitors?.total_views?.current?.toString() || "0"}
          change={
            visitors?.total_views?.change 
              ? `${visitors.total_views.change}% vs. mois dernier`
              : "Données indisponibles"
          }
          changeType={
            (visitors?.total_views?.change || 0) >= 0 ? "positive" : "negative"
          }
          icon={Eye}
          iconBg="bg-info/10"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueChart revenueData={financial.total_revenue} />
        
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">Notifications récentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {orderStats.pending > 0 && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-warning/10 border border-warning/20">
                <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-sm">Nouvelles commandes</p>
                  <p className="text-xs text-muted-foreground">
                    {orderStats.pending} commande(s) en attente de traitement
                  </p>
                </div>
              </div>
            )}
            
            {productStats.out_of_stock > 0 && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
                <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-sm">Produits en rupture</p>
                  <p className="text-xs text-muted-foreground">
                    {productStats.out_of_stock} produit(s) nécessitent un réapprovisionnement
                  </p>
                </div>
              </div>
            )}
            
            {financial.total_revenue > 0 && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-success/10 border border-success/20">
                <AlertCircle className="h-5 w-5 text-success mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-sm">Revenus générés</p>
                  <p className="text-xs text-muted-foreground">
                    {financial.total_revenue.toLocaleString()} {financial.currency} de chiffre d'affaires total
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <RecentOrders orders={orders} />

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">Performance globale</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Taux de conversion</span>
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                {((orderStats.completed / (orderStats.total || 1)) * 100).toFixed(1)}%
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Produits actifs</span>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                {productStats.active}/{productStats.total}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Taux de complétion</span>
              <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                {((orderStats.completed / (orderStats.total || 1)) * 100).toFixed(1)}%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">Aperçu boutique</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Boutique</p>
                <p className="text-xl font-bold text-foreground">{stats.user_status.shop_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Produits total</p>
                <p className="text-xl font-semibold text-primary">{productStats.total}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Commandes totales</p>
                <p className="text-xl font-semibold text-success">{orderStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">Annonces les plus populaires</CardTitle>
          </CardHeader>
          <CardContent>
            {popular_listings && popular_listings.length > 0 ? (
              <div className="space-y-4">
                {popular_listings.map((listing) => (
                  <div key={listing.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{listing.title}</p>
                      <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
                        <span>{listing.total_views} vues</span>
                        <span>{listing.unique_visitors} visiteurs uniques</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">{listing.price?.toLocaleString()} XOF</p>
                      <Badge variant="outline" className={
                        listing.conversion_rate > 5 ? "bg-success/10 text-success border-success/20" :
                        listing.conversion_rate > 2 ? "bg-warning/10 text-warning border-warning/20" :
                        "bg-muted text-muted-foreground border-border"
                      }>
                        {listing.conversion_rate}% conversion
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Aucune donnée de visite disponible
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Section catégories populaires */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Catégories les plus performantes</CardTitle>
        </CardHeader>
        <CardContent>
          {category_analytics?.top_selling_categories && 
          category_analytics.top_selling_categories.length > 0 ? (
            <div className="space-y-3">
              {category_analytics.top_selling_categories.slice(0, 5).map((category: any, index: number) => (
                <div key={category.category__id || index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{category.category__name || 'Catégorie sans nom'}</p>
                      <p className="text-sm text-muted-foreground">
                        {category.total_sales || 0} ventes • {category.total_views || 0} vues
                      </p>
                    </div>
                  </div>
                  <p className="font-bold text-success">
                    {category.total_revenue ? `${Math.round(category.total_revenue).toLocaleString()} XOF` : '0 XOF'}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              Aucune donnée de catégorie disponible
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}