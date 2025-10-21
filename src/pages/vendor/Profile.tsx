import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Upload } from "lucide-react";

export default function Profile() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Profil boutique</h1>
        <p className="text-muted-foreground">Gérez les informations de votre boutique</p>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Informations générales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="text-2xl">MB</AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline" className="gap-2">
                <Upload className="h-4 w-4" />
                Changer le logo
              </Button>
              <p className="text-xs text-muted-foreground mt-2">PNG ou JPG, max 2MB</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="shop-name">Nom de la boutique</Label>
              <Input id="shop-name" defaultValue="Ma Boutique" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="contact@maboutique.fr" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              defaultValue="Nous proposons des produits de qualité avec une livraison rapide."
              rows={4}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input id="phone" defaultValue="+33 6 12 34 56 78" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siret">SIRET</Label>
              <Input id="siret" defaultValue="123 456 789 00012" />
            </div>
          </div>

          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Enregistrer les modifications
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Politiques</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="return-policy">Politique de retour</Label>
            <Textarea
              id="return-policy"
              defaultValue="Retours acceptés sous 30 jours. Produit non utilisé."
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shipping-policy">Politique de livraison</Label>
            <Textarea
              id="shipping-policy"
              defaultValue="Livraison en 2-3 jours ouvrés. Frais de port offerts dès 50€."
              rows={3}
            />
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Enregistrer les politiques
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
