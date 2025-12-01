// src/pages/vendor/Orders.tsx
import { useState } from "react";
import { Eye, Download, Search, Filter, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useVendorOrders } from "@/hooks/useVendorOrders";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const statusColors = {
  pending: "bg-warning/10 text-warning border-warning/20",
  ready_to_ship: "bg-primary/10 text-primary border-primary/20",
  shipped: "bg-info/10 text-info border-info/20",
  delivered: "bg-success/10 text-success border-success/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
  failed: "bg-destructive/10 text-destructive border-destructive/20",
  returned: "bg-muted text-muted-foreground border-border",
};

const statusLabels = {
  pending: "En attente",
  ready_to_ship: "Prêt à expédier",
  shipped: "Expédié",
  delivered: "Livré",
  cancelled: "Annulé",
  failed: "Échouée",
  returned: "Retourné",
};

export default function Orders() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  
  const { orders, stats, loading, error, refetch, updateOrderStatus, exportOrders } = useVendorOrders();
  const { toast } = useToast();

  // Filtrer les commandes selon la recherche et les filtres
  const filteredOrders = orders.filter(order =>
    (order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
     order.buyer.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     order.buyer.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     order.items.some(item => 
       item.listing.title.toLowerCase().includes(searchQuery.toLowerCase())
     )) &&
    (statusFilter === "all" ? true: order.status === statusFilter)
  );

  // 🔥 ACTION: Voir les détails d'une commande
  const handleViewClick = (order: any) => {
    setSelectedOrder(order);
    setViewDialogOpen(true);
  };

  // 🔥 ACTION: Télécharger la facture
  const handleDownloadClick = async (order: any) => {
    try {
      await exportOrders({ status: order.status });
      toast({
        title: "📥 Téléchargement",
        description: "La facture a été téléchargée.",
      });
    } catch (err) {
      toast({
        title: "❌ Erreur",
        description: "Impossible de télécharger la facture.",
        variant: "destructive",
      });
    }
  };

  // 🔥 ACTION: Exporter toutes les commandes
  const handleExportAll = async () => {
    try {
      await exportOrders({ status: statusFilter });
      toast({
        title: "📤 Export réussi",
        description: "Vos commandes ont été exportées en CSV.",
      });
    } catch (err) {
      toast({
        title: "❌ Erreur",
        description: "Impossible d'exporter les commandes.",
        variant: "destructive",
      });
    }
  };

  // 🔥 ACTION: Changer le statut d'une commande
  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast({
        title: "✅ Statut mis à jour",
        description: "Le statut de la commande a été modifié.",
      });
    } catch (err) {
      toast({
        title: "❌ Erreur",
        description: "Impossible de modifier le statut.",
        variant: "destructive",
      });
    }
  };

  // 🔥 ACTION: Rafraîchir les données
  const handleRefresh = () => {
    refetch({ 
      status: statusFilter || undefined,
      search: searchQuery || undefined 
    });
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        
        {/* Skeleton pour les statistiques */}
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>

        <Card className="shadow-md">
          <CardContent className="p-6">
            <div className="flex gap-4 mb-6">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-10" />
            </div>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Gestion des commandes</h1>
          <p className="text-muted-foreground">Suivez et gérez vos commandes</p>
        </div>
        <Card className="p-6 text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={handleRefresh} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Réessayer
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Gestion des commandes</h1>
        <p className="text-muted-foreground">
          {stats ? `${stats.total_orders} commande(s) au total` : "Suivez et gérez vos commandes"}
        </p>
      </div>

      {/* Statistiques des commandes */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="shadow-md">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">En attente</p>
              <p className="text-3xl font-bold text-warning">
                {stats.status_stats["En attente"] || 0}
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Prêtes à expédier</p>
              <p className="text-3xl font-bold text-primary">
                {stats.status_stats["Prêt à expédier"] || 0}
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Expédiées</p>
              <p className="text-3xl font-bold text-primary">
                {stats.status_stats["Expédié"] || 0}
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Livrées</p>
              <p className="text-3xl font-bold text-success">
                {stats.status_stats["Livré"] || 0}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Card className="shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher par numéro, client ou produit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                {Object.entries(statusLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>

            <Button variant="outline" className="gap-2" onClick={handleExportAll}>
              <Download className="h-4 w-4" />
              Exporter
            </Button>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                {orders.length === 0 ? "📦" : "🔍"}
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {orders.length === 0 ? "Aucune commande" : "Aucun résultat"}
              </h3>
              <p className="text-muted-foreground">
                {orders.length === 0 
                  ? "Vous n'avez pas encore reçu de commandes."
                  : "Aucune commande ne correspond à votre recherche."
                }
              </p>
            </div>
          ) : (
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Commande</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Produit(s)</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        #{order.order_number || order.id}
                      </TableCell>
                      <TableCell>
                        {new Date(order.created_at).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {order.buyer.first_name} {order.buyer.last_name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {order.buyer.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[200px]">
                          {order.items.map((item, index) => (
                            <div key={item.id} className="text-sm">
                              {item.quantity} × {item.listing.title}
                              {index < order.items.length - 1 && ", "}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {order.total_price.toLocaleString()} XOF
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge 
                            variant="outline" 
                            className={statusColors[order.status as keyof typeof statusColors] || "bg-muted text-muted-foreground border-border"}
                          >
                            {statusLabels[order.status as keyof typeof statusLabels] || order.status}
                          </Badge>
                          
                          {/* Sélecteur de statut */}
                          <Select
                            value={order.status}
                            onValueChange={(newStatus) => 
                              handleStatusChange(order.id, newStatus)
                            }
                          >
                            <SelectTrigger className="h-6 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(statusLabels).map(([value, label]) => (
                                <SelectItem key={value} value={value}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleViewClick(order)}
                            title="Voir les détails"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDownloadClick(order)}
                            title="Télécharger la facture"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 🔥 DIALOG: Voir les détails d'une commande */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Détails de la commande #{selectedOrder?.order_number || selectedOrder?.id}
            </DialogTitle>
            <DialogDescription>
              Informations complètes sur cette commande
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              {/* Informations client */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Client</h4>
                  <p>{selectedOrder.buyer.first_name} {selectedOrder.buyer.last_name}</p>
                  <p className="text-sm text-muted-foreground">{selectedOrder.buyer.email}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Livraison</h4>
                  <p className="text-sm">{selectedOrder.shipping_address || "Non spécifiée"}</p>
                  {selectedOrder.shipping_method && (
                    <p className="text-sm text-muted-foreground">
                      Méthode: {selectedOrder.shipping_method}
                    </p>
                  )}
                </div>
              </div>

              {/* Articles commandés */}
              <div>
                <h4 className="font-semibold mb-2">Articles commandés</h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center p-2 border rounded">
                      <div>
                        <p className="font-medium">{item.listing.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity} × {item.price.toLocaleString()} XOF
                        </p>
                      </div>
                      <p className="font-semibold">
                        {(item.quantity * item.price).toLocaleString()} XOF
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total et statut */}
              <div className="flex justify-between items-center pt-4 border-t">
                <div>
                  <p className="font-semibold">Total: {selectedOrder.total_price.toLocaleString()} XOF</p>
                  <p className="text-sm text-muted-foreground">
                    Commandé le {new Date(selectedOrder.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <Badge 
                  variant="outline" 
                  className={statusColors[selectedOrder.status as keyof typeof statusColors]}
                >
                  {statusLabels[selectedOrder.status as keyof typeof statusLabels]}
                </Badge>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setViewDialogOpen(false)}
                >
                  Fermer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}