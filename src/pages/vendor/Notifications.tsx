// src/pages/vendor/Notifications.tsx - VERSION AMÉLIORÉE
import { useState, useEffect } from "react";
import { Bell, Send, Users, CheckCircle, Clock, Loader2, AlertTriangle, Package, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
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
import { Switch } from "@/components/ui/switch";
import StatCardV2 from "../../components/dashboard/StatCardV2";
import { notificationsApi, type CreateNotificationData } from "../../services/notificationsApi";
import { toast } from "@/hooks/use-toast";

// Interface pour les données de notification vendeur
interface VendorNotification {
  id: number;
  type: 'order' | 'message' | 'listing' | 'system' | 'event';
  content: string;
  is_read: boolean;
  created_at: string;
  time_ago?: string;
}

interface OutOfStockProduct {
  id: number;
  title: string;
  category: string;
  price: number;
  available_quantity: number;
  status: string;
  last_viewed: string | null;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<VendorNotification[]>([]);
  const [outOfStockProducts, setOutOfStockProducts] = useState<OutOfStockProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [markingAsRead, setMarkingAsRead] = useState(false);
  const [showOutOfStock, setShowOutOfStock] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    outOfStockAlerts: 0,
    totalOutOfStock: 0,
  });

  // Charger les données
  const loadData = async () => {
    setLoading(true);
    try {
      console.log('🔄 Chargement des données de notifications...');
      
      // Charger les statistiques
      const statsData = await notificationsApi.getNotificationStats();
      console.log('📊 Statistiques reçues:', statsData);
      
      setStats({
        total: statsData.total || 0,
        unread: statsData.unread || 0,
        outOfStockAlerts: statsData.out_of_stock_alerts || 0,
        totalOutOfStock: 0,
      });

      // Charger les notifications
      console.log('🔄 Chargement des notifications...');
      const notificationsData = await notificationsApi.getVendorNotifications({
        page_size: 50,
      });
      
      console.log('📨 Notifications reçues:', notificationsData);
      setNotifications(notificationsData.results || []);

      // Charger les alertes stock épuisé
      console.log('🔄 Chargement des alertes stock...');
      try {
        const alertsData = await notificationsApi.getOutOfStockAlerts();
        console.log('⚠️ Alertes stock reçues:', alertsData);
        setOutOfStockProducts(alertsData.out_of_stock_products || []);
        setStats(prev => ({
          ...prev,
          totalOutOfStock: alertsData.total_out_of_stock || 0,
        }));
      } catch (alertError) {
        console.warn('⚠️ Impossible de charger les alertes stock:', alertError);
        // Ne pas bloquer si les alertes échouent
      }

    } catch (error) {
      console.error("❌ Erreur lors du chargement des données:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les notifications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleMarkAllAsRead = async () => {
    setMarkingAsRead(true);
    try {
      const result = await notificationsApi.markAllAsRead();
      
      toast({
        title: "Succès",
        description: `${result.count} notifications marquées comme lues`,
      });

      // Recharger les données
      await loadData();
    } catch (error) {
      console.error("Erreur lors du marquage:", error);
      toast({
        title: "Erreur",
        description: "Impossible de marquer les notifications comme lues",
        variant: "destructive",
      });
    } finally {
      setMarkingAsRead(false);
    }
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await notificationsApi.markAsRead(notificationId);
      
      // Mettre à jour localement
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, is_read: true } : notif
        )
      );

      // Mettre à jour les stats
      setStats(prev => ({
        ...prev,
        unread: Math.max(0, prev.unread - 1),
      }));

      toast({
        title: "Succès",
        description: "Notification marquée comme lue",
      });

    } catch (error) {
      console.error("Erreur lors du marquage:", error);
      toast({
        title: "Erreur",
        description: "Impossible de marquer cette notification",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("fr-FR", {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'listing':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'system':
        return <Bell className="h-5 w-5 text-gray-500" />;
      case 'message':
        return <Send className="h-5 w-5 text-green-500" />;
      default:
        return <Bell className="h-5 w-5 text-purple-500" />;
    }
  };

  const getNotificationLabel = (type: string) => {
    switch (type) {
      case 'order': return 'Commande';
      case 'listing': return 'Annonce';
      case 'system': return 'Système';
      case 'message': return 'Message';
      case 'event': return 'Événement';
      default: return type;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'order': return 'bg-blue-100 text-blue-800';
      case 'listing': return 'bg-amber-100 text-amber-800';
      case 'system': return 'bg-gray-100 text-gray-800';
      case 'message': return 'bg-green-100 text-green-800';
      default: return 'bg-purple-100 text-purple-800';
    }
  };

  const filteredNotifications = showOutOfStock
    ? notifications.filter(n => n.type === 'listing' && n.content.includes('épuisé'))
    : notifications;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Notifications</h1>
          <p className="text-muted-foreground">Suivez vos activités et alertes</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={showOutOfStock}
              onCheckedChange={setShowOutOfStock}
              id="show-out-of-stock"
            />
            <label htmlFor="show-out-of-stock" className="text-sm font-medium">
              Alertes stock seulement
            </label>
          </div>
          <Button
            variant="outline"
            onClick={handleMarkAllAsRead}
            disabled={markingAsRead || stats.unread === 0}
            className="gap-2"
          >
            {markingAsRead ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            Tout marquer comme lu
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCardV2
          title="Total notifications"
          value={stats.total.toString()}
          icon={Bell}
          variant="default"
        />
        <StatCardV2
          title="Non lues"
          value={stats.unread.toString()}
          icon={EyeOff}
          variant="warning"
        />
        <StatCardV2
          title="Alertes stock"
          value={stats.outOfStockAlerts.toString()}
          icon={AlertTriangle}
          variant="destructive"
        />
        <StatCardV2
          title="Produits épuisés"
          value={stats.totalOutOfStock.toString()}
          icon={Package}
          variant="default"
        />
      </div>

      {/* Liste des notifications */}
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {showOutOfStock ? 'Alertes de stock épuisé' : 'Toutes les notifications'}
            <span className="text-sm font-normal text-muted-foreground ml-2">
              ({filteredNotifications.length})
            </span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadData}
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Actualiser"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {showOutOfStock 
                ? "Aucune alerte de stock épuisé"
                : "Aucune notification pour le moment"}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start p-4 rounded-lg border ${
                    !notification.is_read ? 'bg-blue-50 border-blue-200' : 'bg-white'
                  } hover:bg-gray-50 transition-colors duration-200`}
                >
                  <div className="mr-3 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                      <div className="flex items-center flex-wrap gap-2">
                        <Badge className={`${getNotificationColor(notification.type)}`}>
                          {getNotificationLabel(notification.type)}
                        </Badge>
                        <span className="text-sm text-muted-foreground whitespace-nowrap">
                          {formatDate(notification.created_at)}
                          {notification.time_ago && ` • ${notification.time_ago}`}
                        </span>
                      </div>
                      {!notification.is_read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="h-8 px-2 shrink-0"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          <span className="hidden sm:inline">Marquer lu</span>
                        </Button>
                      )}
                    </div>
                    <p className="mt-2 text-sm sm:text-base break-words">
                      {notification.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Produits épuisés */}
      {outOfStockProducts.length > 0 && (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
              Produits en rupture de stock ({outOfStockProducts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produit</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Prix</TableHead>
                    <TableHead>Quantité</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Dernière vue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {outOfStockProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.title}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>{product.price.toFixed(2)} €</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-red-100 text-red-800">
                          {product.available_quantity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.status}</Badge>
                      </TableCell>
                      <TableCell>
                        {product.last_viewed ? formatDate(product.last_viewed) : 'Jamais'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}