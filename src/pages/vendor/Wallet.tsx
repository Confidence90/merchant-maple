import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownRight, Clock, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const transactions = [
  { id: 1, type: "credit", amount: "+850,00 €", description: "Vente - Commande #CMD-1230", date: "15 Jan 2025", status: "Complété" },
  { id: 2, type: "debit", amount: "-42,50 €", description: "Commission plateforme", date: "15 Jan 2025", status: "Complété" },
  { id: 3, type: "debit", amount: "-1000,00 €", description: "Retrait vers compte bancaire", date: "14 Jan 2025", status: "En cours" },
  { id: 4, type: "credit", amount: "+129,99 €", description: "Vente - Commande #CMD-1225", date: "14 Jan 2025", status: "Complété" },
];

export default function Wallet() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Portefeuille</h1>
        <p className="text-muted-foreground">Gérez vos paiements et retraits</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-md border-success/20">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Solde disponible</p>
                <p className="text-4xl font-bold text-success">3 245,50 €</p>
              </div>
              <div className="p-3 rounded-xl bg-success/10">
                <ArrowUpRight className="h-6 w-6 text-success" />
              </div>
            </div>
            <Button className="w-full bg-success hover:bg-success/90 text-success-foreground">
              Effectuer un retrait
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-md border-warning/20">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Montant en attente</p>
                <p className="text-4xl font-bold text-warning">892,00 €</p>
              </div>
              <div className="p-3 rounded-xl bg-warning/10">
                <Clock className="h-6 w-6 text-warning" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Disponible après validation des commandes (3-5 jours)
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Historique des transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    transaction.type === "credit" ? "bg-success/10" : "bg-destructive/10"
                  }`}>
                    {transaction.type === "credit" ? (
                      <ArrowUpRight className="h-5 w-5 text-success" />
                    ) : (
                      <ArrowDownRight className="h-5 w-5 text-destructive" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{transaction.description}</p>
                    <p className="text-sm text-muted-foreground">{transaction.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className={`text-lg font-bold ${
                    transaction.type === "credit" ? "text-success" : "text-destructive"
                  }`}>
                    {transaction.amount}
                  </p>
                  <Badge
                    variant="outline"
                    className={
                      transaction.status === "Complété"
                        ? "bg-success/10 text-success border-success/20"
                        : "bg-warning/10 text-warning border-warning/20"
                    }
                  >
                    {transaction.status === "Complété" ? (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    ) : (
                      <Clock className="h-3 w-3 mr-1" />
                    )}
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">Commissions de la plateforme</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total prélevé ce mois</span>
                <span className="font-semibold text-destructive">-127,50 €</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Taux de commission</span>
                <span className="font-semibold">5%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">Compte bancaire</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground mb-1">IBAN</p>
                <p className="font-mono text-sm">FR76 **** **** **** **45</p>
              </div>
              <Button variant="outline" className="w-full">
                Modifier le compte
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
