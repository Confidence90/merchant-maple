import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Percent, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const promos = [
  { id: 1, code: "SOLDES2025", discount: "20%", uses: 45, limit: 100, status: "Actif" },
  { id: 2, code: "BIENVENUE10", discount: "10%", uses: 127, limit: 200, status: "Actif" },
  { id: 3, code: "NOEL2024", discount: "15%", uses: 89, limit: 150, status: "Expiré" },
];

export default function Marketing() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Marketing</h1>
          <p className="text-muted-foreground">Promotions et mise en avant</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
          <Plus className="h-4 w-4" />
          Nouvelle promotion
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10">
                <Percent className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Promotions actives</p>
                <p className="text-2xl font-bold text-foreground">2</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-success/10">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ventes promo ce mois</p>
                <p className="text-2xl font-bold text-foreground">172</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-warning/10">
                <Percent className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Remise moyenne</p>
                <p className="text-2xl font-bold text-foreground">15%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Codes promotionnels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {promos.map((promo) => (
              <div key={promo.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Percent className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{promo.code}</p>
                    <p className="text-sm text-muted-foreground">
                      {promo.uses} / {promo.limit} utilisations
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-lg font-bold text-primary">{promo.discount}</p>
                  <Badge
                    variant="outline"
                    className={
                      promo.status === "Actif"
                        ? "bg-success/10 text-success border-success/20"
                        : "bg-muted text-muted-foreground border-border"
                    }
                  >
                    {promo.status}
                  </Badge>
                  <Button variant="outline" size="sm">Modifier</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Créer un code promo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="promo-code">Code promo</Label>
              <Input id="promo-code" placeholder="Ex: SOLDES2025" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount">Réduction (%)</Label>
              <Input id="discount" type="number" placeholder="10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="limit">Limite d'utilisation</Label>
              <Input id="limit" type="number" placeholder="100" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiry">Date d'expiration</Label>
              <Input id="expiry" type="date" />
            </div>
          </div>
          <Button className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground">
            Créer le code promo
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
