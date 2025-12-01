// src/components/dashboard/RecentOrders.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { VendorOrder } from "@/services/vendorApi";

interface RecentOrdersProps {
  orders: VendorOrder[];
}

const statusColors = {
  "pending": "bg-warning/10 text-warning border-warning/20",
  "confirmed": "bg-primary/10 text-primary border-primary/20", 
  "shipped": "bg-info/10 text-info border-info/20",
  "completed": "bg-success/10 text-success border-success/20",
  "cancelled": "bg-destructive/10 text-destructive border-destructive/20",
};

const statusLabels = {
  "pending": "En attente",
  "confirmed": "Confirmée",
  "shipped": "Expédiée",
  "completed": "Livrée",
  "cancelled": "Annulée",
};

export function RecentOrders({ orders }: RecentOrdersProps) {
  // CORRECTION: Vérifier que orders est bien un tableau
  if (!Array.isArray(orders)) {
    console.error('Orders is not an array:', orders);
    return (
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Commandes récentes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Erreur de chargement des commandes
          </p>
        </CardContent>
      </Card>
    );
  }

  // Prendre les 4 commandes les plus récentes
  const recentOrders = orders.slice(0, 4);

  if (recentOrders.length === 0) {
    return (
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Commandes récentes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Aucune commande pour le moment
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl">Commandes récentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-foreground">#{order.order_number || `CMD-${order.id}`}</p>
                  <Badge variant="outline" className={statusColors[order.status as keyof typeof statusColors] || "bg-muted text-muted-foreground border-border"}>
                    {statusLabels[order.status as keyof typeof statusLabels] || order.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{order.customer_name || "Client"}</p>
                <p className="text-sm text-foreground">{order.product_name || "Produit"}</p>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-lg font-bold text-foreground">{order.amount || "0 XOF"}</p>
                <Button variant="ghost" size="icon">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}