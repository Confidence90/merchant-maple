// src/pages/admin/UsersManagement.tsx - VERSION COMPLÈTE CORRIGÉE
import { useState } from "react";
import { 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Shield,
  UserCheck,
  UserX,
  MoreHorizontal,
  RefreshCw
} from "lucide-react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useUsersManagement } from "@/hooks/useUsersManagement";

// Types
interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  phone: string;
  country_code: string;
  location: string;
  role: 'buyer' | 'seller' | 'admin';
  is_staff: boolean;
  is_superuser: boolean;
  is_active: boolean;
  is_verified: boolean;
  is_seller: boolean;
  is_seller_pending: boolean;
  auth_provider: string;
  created_at: string;
  last_login: string;
  vendor_profile?: {
    shop_name: string;
    is_completed: boolean;
  };
}

// Couleurs pour les rôles
const roleColors = {
  buyer: "bg-blue-100 text-blue-800 border-blue-200",
  seller: "bg-green-100 text-green-800 border-green-200",
  admin: "bg-purple-100 text-purple-800 border-purple-200",
};

// Labels pour les rôles
const roleLabels = {
  buyer: "Acheteur",
  seller: "Vendeur",
  admin: "Administrateur",
};

// Sous-composant pour le tableau des utilisateurs
interface UsersTableProps {
  users: User[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  roleFilter: string;
  setRoleFilter: (filter: string) => void;
  statusFilter: string;
  setStatusFilter: (filter: string) => void;
  onRefresh: () => void;
  onUserAction: (action: string, user: User) => void;
  formatDate: (dateString: string) => string;
}

function UsersTable({
  users,
  searchQuery,
  setSearchQuery,
  roleFilter,
  setRoleFilter,
  statusFilter,
  setStatusFilter,
  onRefresh,
  onUserAction,
  formatDate
}: UsersTableProps) {
  return (
    <Card className="shadow-md">
      <CardContent className="p-6">
        {/* Barre d'outils */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher par email, nom, téléphone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[150px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Tous les rôles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les rôles</SelectItem>
              <SelectItem value="buyer">Acheteurs</SelectItem>
              <SelectItem value="seller">Vendeurs</SelectItem>
              <SelectItem value="admin">Administrateurs</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Tous les statuts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="active">Actifs</SelectItem>
              <SelectItem value="inactive">Inactifs</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        {users.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              {users.length === 0 ? "👥" : "🔍"}
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {users.length === 0 ? "Aucun utilisateur" : "Aucun résultat"}
            </h3>
            <p className="text-muted-foreground">
              {users.length === 0 
                ? "Aucun utilisateur n'est inscrit sur la plateforme."
                : "Aucun utilisateur ne correspond à votre recherche."
              }
            </p>
          </div>
        ) : (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Inscription</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {user.first_name} {user.last_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          @{user.username}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <p className="text-sm">{user.email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <p className="text-sm">{user.country_code}{user.phone}</p>
                        </div>
                        {user.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <p className="text-sm">{user.location}</p>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={roleColors[user.role as keyof typeof roleColors]}
                      >
                        {roleLabels[user.role as keyof typeof roleLabels]}
                      </Badge>
                      {user.vendor_profile && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {user.vendor_profile.shop_name}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge 
                          variant={user.is_active ? "default" : "secondary"}
                          className={user.is_active 
                            ? "bg-green-100 text-green-800 hover:bg-green-100" 
                            : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                          }
                        >
                          {user.is_active ? "Actif" : "Inactif"}
                        </Badge>
                        {!user.is_verified && (
                          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                            Non vérifié
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{formatDate(user.created_at)}</p>
                        {user.last_login && (
                          <p className="text-muted-foreground">
                            Dernière connexion: {formatDate(user.last_login)}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          
                          {!user.is_active && (
                            <DropdownMenuItem 
                              onClick={() => onUserAction('activate', user)}
                              className="text-green-600"
                            >
                              <UserCheck className="h-4 w-4 mr-2" />
                              Activer
                            </DropdownMenuItem>
                          )}
                          
                          {user.is_active && (
                            <DropdownMenuItem 
                              onClick={() => onUserAction('deactivate', user)}
                              className="text-red-600"
                            >
                              <UserX className="h-4 w-4 mr-2" />
                              Désactiver
                            </DropdownMenuItem>
                          )}
                          
                          {user.role !== 'seller' && (
                            <DropdownMenuItem 
                              onClick={() => onUserAction('make_seller', user)}
                            >
                              <Shield className="h-4 w-4 mr-2" />
                              Rendre vendeur
                            </DropdownMenuItem>
                          )}
                          
                          {user.role !== 'admin' && (
                            <DropdownMenuItem 
                              onClick={() => onUserAction('make_admin', user)}
                            >
                              <Shield className="h-4 w-4 mr-2" />
                              Rendre admin
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Sous-composant pour les statistiques
function StatsCards({ stats }: { stats: any }) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card className="shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <UserCheck className="h-5 w-5 text-green-600" />
            <p className="text-sm text-muted-foreground">Utilisateurs actifs</p>
          </div>
          <p className="text-3xl font-bold text-green-600">
            {stats.active_users}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.total_users > 0 ? Math.round((stats.active_users / stats.total_users) * 100) : 0}% du total
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-5 w-5 text-purple-600" />
            <p className="text-sm text-muted-foreground">Vendeurs</p>
          </div>
          <p className="text-3xl font-bold text-purple-600">
            {stats.sellers_count}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.role_distribution.seller} actifs
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <p className="text-sm text-muted-foreground">Nouveaux aujourd'hui</p>
          </div>
          <p className="text-3xl font-bold text-blue-600">
            {stats.new_users_today}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Inscriptions récentes
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <UserCheck className="h-5 w-5 text-orange-600" />
            <p className="text-sm text-muted-foreground">Acheteurs</p>
          </div>
          <p className="text-3xl font-bold text-orange-600">
            {stats.role_distribution.buyer}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Clients actifs
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// Sous-composant pour le skeleton de chargement
function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>
      
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
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-10" />
          </div>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

// Composant principal
export default function UsersManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  const { users, stats, loading, error, refetch, updateUser } = useUsersManagement();
  const { toast } = useToast();

  // Filtrage des utilisateurs
  const filteredUsers = users.filter(user =>
    (user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
     user.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
     user.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
     user.phone?.includes(searchQuery)) &&
    (roleFilter === "all" ? true : user.role === roleFilter) &&
    (statusFilter === "all" ? true : 
      statusFilter === "active" ? user.is_active :
      statusFilter === "inactive" ? !user.is_active : true)
  );

  // Actions sur les utilisateurs
  const handleUserAction = async (action: string, user: User) => {
    try {
      switch (action) {
        case 'activate':
          await updateUser(user.id, { is_active: true });
          toast({
            title: "✅ Utilisateur activé",
            description: `${user.email} a été activé avec succès.`,
          });
          break;
        
        case 'deactivate':
          await updateUser(user.id, { is_active: false });
          toast({
            title: "🚫 Utilisateur désactivé",
            description: `${user.email} a été désactivé.`,
          });
          break;
        
        case 'make_seller':
          await updateUser(user.id, { 
            role: 'seller',
            is_seller: true,
            is_seller_pending: false 
          });
          toast({
            title: "👑 Statut vendeur accordé",
            description: `${user.email} est maintenant vendeur.`,
          });
          break;
        
        case 'make_admin':
          await updateUser(user.id, { 
            role: 'admin',
            is_staff: true 
          });
          toast({
            title: "🛡️ Droits admin accordés",
            description: `${user.email} est maintenant administrateur.`,
          });
          break;
      }
    } catch (err) {
      toast({
        title: "❌ Erreur",
        description: "Impossible de réaliser cette action.",
        variant: "destructive",
      });
    }
  };

  const handleRefresh = () => {
    refetch({ 
      role: roleFilter !== "all" ? roleFilter : undefined,
      search: searchQuery || undefined 
    });
  };

  // Formatage de la date
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return 'Date invalide';
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Gestion des Utilisateurs</h1>
        <p className="text-muted-foreground">
          {stats ? `${stats.total_users} utilisateur(s) sur la plateforme` : "Administrez les comptes utilisateurs"}
        </p>
      </div>

      {/* Message d'erreur */}
      {error && (
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-destructive font-medium">{error}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Vérifiez que vous avez les permissions administrateur et que les endpoints sont configurés.
                </p>
              </div>
              <Button variant="outline" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Réessayer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistiques */}
      {stats && (
        <StatsCards stats={stats} />
      )}

      {/* Tableau des utilisateurs */}
      <UsersTable
        users={filteredUsers}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onRefresh={handleRefresh}
        onUserAction={handleUserAction}
        formatDate={formatDate}
      />
    </div>
  );
}