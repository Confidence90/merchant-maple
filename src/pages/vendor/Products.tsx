// src/pages/vendor/Products.tsx
import { useState } from "react";
import { Plus, Search, Edit, Trash2, Eye, Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom"; 
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProductStats } from "@/components/vendor/ProductStats";
import { useVendorProducts } from "@/hooks/useVendorProducts";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { VendorProduct } from "@/services/vendorApi";

const statusColors = {
  active: "bg-success/10 text-success border-success/20",
  out_of_stock: "bg-destructive/10 text-destructive border-destructive/20",
  expired: "bg-muted text-muted-foreground border-border",
  sold: "bg-warning/10 text-warning border-warning/20",
};

const statusLabels = {
  active: "Actif",
  out_of_stock: "Rupture",
  expired: "Expiré",
  sold: "Vendu",
};

const conditionLabels = {
  new: "Neuf",
  used: "Occasion",
};

export default function Products() {
  const navigate = useNavigate(); //
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<VendorProduct | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<VendorProduct | null>(null);
  
  const { products, loading, error, deleteProduct, updateProduct } = useVendorProducts();
  const { toast } = useToast();
  const handleAddProduct = () => {
    navigate("/products/add");
  };
  // Filtrer les produits selon la recherche
  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 🔥 ACTION: Voir les détails d'un produit
  const handleViewClick = (product: VendorProduct) => {
    setSelectedProduct(product);
    setViewDialogOpen(true);
  };

  // 🔥 ACTION: Modifier un produit
  const handleEditClick = (product: VendorProduct) => {
    setSelectedProduct(product);
    setEditDialogOpen(true);
  };

  // 🔥 ACTION: Supprimer un produit
  const handleDeleteClick = (product: VendorProduct) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    try {
      await deleteProduct(productToDelete.id);
      toast({
        title: "✅ Produit supprimé",
        description: `"${productToDelete.title}" a été supprimé avec succès.`,
      });
    } catch (err) {
      toast({
        title: "❌ Erreur",
        description: "Impossible de supprimer le produit.",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  // 🔥 ACTION: Changer le statut d'un produit
  const handleStatusChange = async (productId: number, newStatus: string) => {
    try {
      await updateProduct(productId, { status: newStatus });
      toast({
        title: "✅ Statut mis à jour",
        description: "Le statut du produit a été modifié.",
      });
    } catch (err) {
      toast({
        title: "❌ Erreur",
        description: "Impossible de modifier le statut du produit.",
        variant: "destructive",
      });
    }
  };

  // 🔥 ACTION: Exporter les produits
  const handleExportClick = () => {
    const csvContent = [
      ['ID', 'Titre', 'Catégorie', 'Prix', 'Stock', 'Ventes', 'Statut', 'Condition'],
      ...products.map(product => [
        product.id,
        product.title,
        product.category_name,
        `${product.price} XOF`,
        product.available_quantity,
        product.quantity_sold,
        statusLabels[product.status as keyof typeof statusLabels],
        conditionLabels[product.condition as keyof typeof conditionLabels]
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `produits-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "📤 Export réussi",
      description: `Vos ${products.length} produits ont été exportés en CSV.`,
    });
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
        <Card className="shadow-md">
          <CardContent className="p-6">
            <Skeleton className="h-10 w-full mb-6" />
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Gestion des produits</h1>
          <p className="text-muted-foreground">Gérez votre catalogue de produits</p>
        </div>
        <Card className="p-6 text-center">
          <p className="text-destructive">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Réessayer
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Gestion des produits</h1>
          <p className="text-muted-foreground">
            {products.length} produit(s) dans votre catalogue
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={handleExportClick}
            disabled={products.length === 0}
          >
            <Download className="h-4 w-4" />
            Exporter
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
          onClick={handleAddProduct}
          >
            <Plus className="h-4 w-4" />
            Ajouter un produit
          </Button>
        </div>
      </div>

      <ProductStats products={products} />

      <Card className="shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher un produit par titre, description ou catégorie..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {products.length === 0 ? "Aucun produit" : "Aucun résultat"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {products.length === 0 
                  ? "Commencez par ajouter votre premier produit à votre catalogue."
                  : "Aucun produit ne correspond à votre recherche."
                }
              </p>
              {products.length === 0 && (
                <Button className="gap-2" onClick={handleAddProduct}>
                  <Plus className="h-4 w-4" />
                  Ajouter votre premier produit
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produit</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Prix</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Ventes</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {product.images && product.images.length > 0 ? (
                            <img
                              src={product.images[0].image}
                              alt={product.title}
                              className="h-10 w-10 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                              <span className="text-xs text-muted-foreground">No img</span>
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-foreground">{product.title}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {product.description}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{product.category_name}</TableCell>
                      <TableCell className="font-semibold">
                        {product.price.toLocaleString()} XOF
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className={product.is_out_of_stock ? "text-destructive font-medium" : ""}>
                            {product.available_quantity} dispo.
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {product.quantity} au total
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{product.quantity_sold}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {conditionLabels[product.condition as keyof typeof conditionLabels] || product.condition}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={statusColors[product.status as keyof typeof statusColors] || "bg-muted text-muted-foreground border-border"}
                        >
                          {statusLabels[product.status as keyof typeof statusLabels] || product.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* 🔥 BOUTON VOIR */}
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleViewClick(product)}
                            title="Voir les détails"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          
                          {/* 🔥 BOUTON MODIFIER */}
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleEditClick(product)}
                            title="Modifier le produit"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          
                          {/* 🔥 BOUTON SUPPRIMER */}
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteClick(product)}
                            title="Supprimer le produit"
                          >
                            <Trash2 className="h-4 w-4" />
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

      {/* 🔥 DIALOG: Voir les détails d'un produit */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails du produit</DialogTitle>
            <DialogDescription>
              Informations complètes sur votre produit
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              <div className="flex gap-4">
                {selectedProduct.images && selectedProduct.images.length > 0 ? (
                  <img
                    src={selectedProduct.images[0].image}
                    alt={selectedProduct.title}
                    className="h-32 w-32 rounded-lg object-cover"
                  />
                ) : (
                  <div className="h-32 w-32 rounded-lg bg-muted flex items-center justify-center">
                    <span className="text-sm text-muted-foreground">Aucune image</span>
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{selectedProduct.title}</h3>
                  <p className="text-muted-foreground">{selectedProduct.description}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Catégorie</p>
                  <p className="font-medium">{selectedProduct.category_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Prix</p>
                  <p className="font-medium">{selectedProduct.price.toLocaleString()} XOF</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Stock disponible</p>
                  <p className="font-medium">{selectedProduct.available_quantity}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ventes</p>
                  <p className="font-medium">{selectedProduct.quantity_sold}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Condition</p>
                  <Badge variant="outline">
                    {conditionLabels[selectedProduct.condition as keyof typeof conditionLabels]}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Statut</p>
                  <Badge 
                    variant="outline" 
                    className={statusColors[selectedProduct.status as keyof typeof statusColors]}
                  >
                    {statusLabels[selectedProduct.status as keyof typeof statusLabels]}
                  </Badge>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setViewDialogOpen(false)}
                >
                  Fermer
                </Button>
                <Button 
                  onClick={() => {
                    setViewDialogOpen(false);
                    handleEditClick(selectedProduct);
                  }}
                >
                  Modifier le produit
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 🔥 DIALOG: Modifier un produit (version basique) */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modifier le produit</DialogTitle>
            <DialogDescription>
              Modifiez les informations de votre produit
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Fonctionnalité de modification en cours de développement...
              </p>
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setEditDialogOpen(false)}
                >
                  Annuler
                </Button>
                <Button 
                  onClick={() => {
                    toast({
                      title: "🔄 Modification",
                      description: "La modification sera bientôt disponible",
                    });
                    setEditDialogOpen(false);
                  }}
                >
                  Enregistrer les modifications
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 🔥 DIALOG: Confirmation de suppression */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce produit ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le produit "{productToDelete?.title}" sera définitivement supprimé de votre catalogue.
              {productToDelete && productToDelete.quantity_sold > 0 && (
                <div className="mt-2 p-2 bg-warning/10 border border-warning/20 rounded">
                  ⚠️ Attention : Ce produit a déjà été vendu {productToDelete.quantity_sold} fois.
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer définitivement
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}