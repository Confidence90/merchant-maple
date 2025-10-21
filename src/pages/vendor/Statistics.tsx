import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const salesData = [
  { month: "Jan", sales: 2400 },
  { month: "Fév", sales: 1398 },
  { month: "Mar", sales: 9800 },
  { month: "Avr", sales: 3908 },
  { month: "Mai", sales: 4800 },
  { month: "Juin", sales: 3800 },
];

const categoryData = [
  { name: "Chaussures", value: 45 },
  { name: "Vêtements", value: 30 },
  { name: "Accessoires", value: 25 },
];

const COLORS = ["hsl(var(--primary))", "hsl(var(--success))", "hsl(var(--warning))"];

export default function Statistics() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Statistiques</h1>
          <p className="text-muted-foreground">Analysez vos performances</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Exporter (CSV)
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="shadow-md">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Taux de conversion</p>
            <p className="text-3xl font-bold text-foreground">3.2%</p>
            <p className="text-xs text-success mt-1">+0.5% vs. mois dernier</p>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Panier moyen</p>
            <p className="text-3xl font-bold text-foreground">56,40 €</p>
            <p className="text-xs text-success mt-1">+2,10 € vs. mois dernier</p>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Visiteurs uniques</p>
            <p className="text-3xl font-bold text-foreground">12 450</p>
            <p className="text-xs text-success mt-1">+8% vs. mois dernier</p>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Taux de retour</p>
            <p className="text-3xl font-bold text-foreground">2.3%</p>
            <p className="text-xs text-destructive mt-1">+0.3% vs. mois dernier</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Ventes par mois</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
              <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Répartition par catégorie</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="hsl(var(--primary))"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Top 5 produits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Chaussures de sport", sales: 127, revenue: "11 428 €" },
                { name: "Casquette rouge", sales: 143, revenue: "2 858 €" },
                { name: "T-shirt blanc", sales: 89, revenue: "2 669 €" },
                { name: "Jean bleu", sales: 76, revenue: "6 079 €" },
                { name: "Sac à dos", sales: 54, revenue: "3 239 €" },
              ].map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.sales} ventes</p>
                    </div>
                  </div>
                  <p className="font-bold text-success">{product.revenue}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
