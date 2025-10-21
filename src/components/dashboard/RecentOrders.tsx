import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const orders = [
  { id: "#CMD-1234", customer: "Marie Dupont", product: "Chaussures de sport", amount: "89,99 €", status: "En cours" },
  { id: "#CMD-1233", customer: "Jean Martin", product: "T-shirt blanc", amount: "29,99 €", status: "Expédié" },
  { id: "#CMD-1232", customer: "Sophie Bernard", product: "Sac à dos", amount: "59,99 €", status: "Livré" },
  { id: "#CMD-1231", customer: "Pierre Dubois", product: "Casquette rouge", amount: "19,99 €", status: "En attente" },
];

const statusColors = {
  "En cours": "bg-warning/10 text-warning border-warning/20",
  "Expédié": "bg-primary/10 text-primary border-primary/20",
  "Livré": "bg-success/10 text-success border-success/20",
  "En attente": "bg-muted text-muted-foreground border-border",
};

export function RecentOrders() {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl">Commandes récentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-foreground">{order.id}</p>
                  <Badge variant="outline" className={statusColors[order.status as keyof typeof statusColors]}>
                    {order.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{order.customer}</p>
                <p className="text-sm text-foreground">{order.product}</p>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-lg font-bold text-foreground">{order.amount}</p>
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
