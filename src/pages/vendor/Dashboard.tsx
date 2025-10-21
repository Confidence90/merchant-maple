import { TrendingUp, Package, ShoppingCart, DollarSign, Users, AlertCircle } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentOrders } from "@/components/dashboard/RecentOrders";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Tableau de bord</h1>
        <p className="text-muted-foreground">Bienvenue sur votre espace vendeur</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Chiffre d'affaires"
          value="12 450 €"
          change="+12,5% vs. mois dernier"
          changeType="positive"
          icon={DollarSign}
          iconBg="bg-success/10"
        />
        <StatCard
          title="Ventes totales"
          value="342"
          change="+8,2% vs. mois dernier"
          changeType="positive"
          icon={TrendingUp}
        />
        <StatCard
          title="Produits actifs"
          value="48"
          change="3 en rupture"
          changeType="neutral"
          icon={Package}
        />
        <StatCard
          title="Commandes en cours"
          value="23"
          change="2 en attente"
          changeType="neutral"
          icon={ShoppingCart}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueChart />
        
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">Notifications récentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-warning/10 border border-warning/20">
              <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-sm">Nouvelle commande</p>
                <p className="text-xs text-muted-foreground">Commande #CMD-1234 reçue il y a 5 min</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
              <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-sm">Produit en rupture</p>
                <p className="text-xs text-muted-foreground">T-shirt bleu - Taille M</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-success/10 border border-success/20">
              <AlertCircle className="h-5 w-5 text-success mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-sm">Paiement reçu</p>
                <p className="text-xs text-muted-foreground">850 € transférés vers votre portefeuille</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <RecentOrders />

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">Performance globale</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Taux de satisfaction</span>
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                98%
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Délai moyen d'expédition</span>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                1,5 jours
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Taux de retour</span>
              <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                2,3%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">Solde portefeuille</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Disponible</p>
                <p className="text-3xl font-bold text-success">3 245,50 €</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">En attente</p>
                <p className="text-xl font-semibold text-warning">892,00 €</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
