// src/components/vendor/ProductStats.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Package, TrendingUp, AlertTriangle, Eye } from "lucide-react";
import { VendorProduct } from "@/services/vendorApi";

interface ProductStatsProps {
  products: VendorProduct[];
}

export function ProductStats({ products }: ProductStatsProps) {
  const stats = {
    total: products.length,
    active: products.filter(p => p.status === 'active').length,
    outOfStock: products.filter(p => p.status === 'out_of_stock').length,
    totalRevenue: products.reduce((sum, product) => sum + (product.price * product.quantity_sold), 0),
    totalSales: products.reduce((sum, product) => sum + product.quantity_sold, 0),
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/10">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total produits</p>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-success/10">
              <Eye className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Produits actifs</p>
              <p className="text-2xl font-bold text-foreground">{stats.active}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-warning/10">
              <AlertTriangle className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">En rupture</p>
              <p className="text-2xl font-bold text-foreground">{stats.outOfStock}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-success/10">
              <TrendingUp className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ventes totales</p>
              <p className="text-2xl font-bold text-foreground">{stats.totalSales}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}