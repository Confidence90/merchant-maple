import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Download } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const orders = [
  { id: "#CMD-1234", date: "2025-01-15", customer: "Marie Dupont", product: "Chaussures de sport", amount: "89,99 €", status: "En cours" },
  { id: "#CMD-1233", date: "2025-01-15", customer: "Jean Martin", product: "T-shirt blanc", amount: "29,99 €", status: "Expédié" },
  { id: "#CMD-1232", date: "2025-01-14", customer: "Sophie Bernard", product: "Sac à dos", amount: "59,99 €", status: "Livré" },
  { id: "#CMD-1231", date: "2025-01-14", customer: "Pierre Dubois", product: "Casquette rouge", amount: "19,99 €", status: "En attente" },
  { id: "#CMD-1230", date: "2025-01-13", customer: "Claire Moreau", product: "Jean bleu", amount: "79,99 €", status: "Expédié" },
];

const statusColors = {
  "En cours": "bg-warning/10 text-warning border-warning/20",
  "Expédié": "bg-primary/10 text-primary border-primary/20",
  "Livré": "bg-success/10 text-success border-success/20",
  "En attente": "bg-muted text-muted-foreground border-border",
  "Annulé": "bg-destructive/10 text-destructive border-destructive/20",
};

export default function Orders() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Gestion des commandes</h1>
        <p className="text-muted-foreground">Suivez et gérez vos commandes</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-md">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">En attente</p>
            <p className="text-3xl font-bold text-warning">5</p>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">En cours</p>
            <p className="text-3xl font-bold text-primary">12</p>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Expédiées</p>
            <p className="text-3xl font-bold text-primary">8</p>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Livrées</p>
            <p className="text-3xl font-bold text-success">247</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-md">
        <CardContent className="p-6">
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Commande</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Produit</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.product}</TableCell>
                    <TableCell className="font-semibold">{order.amount}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusColors[order.status as keyof typeof statusColors]}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
