import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import StepProgress from "@/components/vendor/StepProgress";

export default function Profile() {
  const { toast } = useToast();
  const [currentTab, setCurrentTab] = useState("general");
  const [loading, setLoading] = useState(false);

  const [profileData, setProfileData] = useState({
    // Informations générales
    shop_name: "Ma Boutique",
    contact_name: "John Doe",
    contact_email: "contact@maboutique.fr",
    contact_phone: "+223 XX XX XX XX",
    customer_service_name: "Service Client",
    customer_service_phone: "+223 XX XX XX XX",
    customer_service_email: "service@maboutique.fr",
    description: "Nous proposons des produits de qualité avec une livraison rapide.",
    
    // Adresse
    address_line1: "",
    address_line2: "",
    city: "Bamako",
    region: "",
    country: "Mali",
    
    // Informations société
    account_type: "individual",
    company_name: "",
    legal_representative: "",
    tax_id: "",
    vat_number: "",
    
    // Expédition
    shipping_zone: "Bamako",
    shipping_address_line1: "",
    shipping_address_line2: "",
    shipping_city: "",
    shipping_state: "",
    shipping_zip: "",
    
    // Retour
    return_address_line1: "",
    return_address_line2: "",
    return_city: "",
    return_state: "",
    return_zip: "",
    
    // Politiques
    return_policy: "Retours acceptés sous 30 jours. Produit non utilisé.",
    shipping_policy: "Livraison en 2-3 jours ouvrés. Frais de port offerts dès 50€.",
    
    // Complémentaires
    has_existing_shop: "no",
    vendor_type: "retailer",
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulation de sauvegarde
      setTimeout(() => {
        toast({
          title: "Profil mis à jour",
          description: "Vos informations ont été enregistrées avec succès",
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la sauvegarde",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Profil boutique</h1>
        <p className="text-muted-foreground">Gérez les informations complètes de votre boutique</p>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="societe">Société</TabsTrigger>
          <TabsTrigger value="expedition">Expédition</TabsTrigger>
          <TabsTrigger value="politiques">Politiques</TabsTrigger>
          <TabsTrigger value="complementaires">Complémentaires</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6 mt-6">
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
                  <Label htmlFor="shop_name">Nom de la boutique *</Label>
                  <Input 
                    id="shop_name" 
                    value={profileData.shop_name}
                    onChange={(e) => handleInputChange('shop_name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_email">Email *</Label>
                  <Input 
                    id="contact_email" 
                    type="email" 
                    value={profileData.contact_email}
                    onChange={(e) => handleInputChange('contact_email', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={profileData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contact_name">Nom du contact *</Label>
                  <Input 
                    id="contact_name" 
                    value={profileData.contact_name}
                    onChange={(e) => handleInputChange('contact_name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_phone">Téléphone *</Label>
                  <Input 
                    id="contact_phone" 
                    value={profileData.contact_phone}
                    onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Service client</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="customer_service_name">Nom du service</Label>
                  <Input 
                    id="customer_service_name" 
                    value={profileData.customer_service_name}
                    onChange={(e) => handleInputChange('customer_service_name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer_service_phone">Téléphone</Label>
                  <Input 
                    id="customer_service_phone" 
                    value={profileData.customer_service_phone}
                    onChange={(e) => handleInputChange('customer_service_phone', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer_service_email">Email du service</Label>
                <Input 
                  id="customer_service_email" 
                  type="email"
                  value={profileData.customer_service_email}
                  onChange={(e) => handleInputChange('customer_service_email', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Adresse professionnelle</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="address_line1">Adresse ligne 1</Label>
                  <Input 
                    id="address_line1" 
                    value={profileData.address_line1}
                    onChange={(e) => handleInputChange('address_line1', e.target.value)}
                    placeholder="Rue, numéro"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address_line2">Adresse ligne 2</Label>
                  <Input 
                    id="address_line2" 
                    value={profileData.address_line2}
                    onChange={(e) => handleInputChange('address_line2', e.target.value)}
                    placeholder="Quartier"
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="city">Ville</Label>
                  <Input 
                    id="city" 
                    value={profileData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">Région</Label>
                  <Input 
                    id="region" 
                    value={profileData.region}
                    onChange={(e) => handleInputChange('region', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="societe" className="space-y-6 mt-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Informations de la société</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="account_type">Type de compte</Label>
                <Select value={profileData.account_type} onValueChange={(value) => handleInputChange('account_type', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individuel</SelectItem>
                    <SelectItem value="company">Entreprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {profileData.account_type === "company" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="company_name">Nom de l'entreprise</Label>
                    <Input 
                      id="company_name" 
                      value={profileData.company_name}
                      onChange={(e) => handleInputChange('company_name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="legal_representative">Représentant légal</Label>
                    <Input 
                      id="legal_representative" 
                      value={profileData.legal_representative}
                      onChange={(e) => handleInputChange('legal_representative', e.target.value)}
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="tax_id">Numéro fiscal (TIN)</Label>
                      <Input 
                        id="tax_id" 
                        value={profileData.tax_id}
                        onChange={(e) => handleInputChange('tax_id', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vat_number">Numéro de TVA</Label>
                      <Input 
                        id="vat_number" 
                        value={profileData.vat_number}
                        onChange={(e) => handleInputChange('vat_number', e.target.value)}
                      />
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expedition" className="space-y-6 mt-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Informations d'expédition</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="shipping_zone">Zone d'expédition</Label>
                <Select value={profileData.shipping_zone} onValueChange={(value) => handleInputChange('shipping_zone', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bamako">Bamako</SelectItem>
                    <SelectItem value="Ségou">Ségou</SelectItem>
                    <SelectItem value="Koulikoro">Koulikoro</SelectItem>
                    <SelectItem value="Mali">Tout le Mali</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Adresse d'expédition</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="shipping_address_line1">Adresse ligne 1</Label>
                    <Input 
                      id="shipping_address_line1" 
                      value={profileData.shipping_address_line1}
                      onChange={(e) => handleInputChange('shipping_address_line1', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shipping_address_line2">Adresse ligne 2</Label>
                    <Input 
                      id="shipping_address_line2" 
                      value={profileData.shipping_address_line2}
                      onChange={(e) => handleInputChange('shipping_address_line2', e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="shipping_city">Ville</Label>
                    <Input 
                      id="shipping_city" 
                      value={profileData.shipping_city}
                      onChange={(e) => handleInputChange('shipping_city', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shipping_state">Région</Label>
                    <Input 
                      id="shipping_state" 
                      value={profileData.shipping_state}
                      onChange={(e) => handleInputChange('shipping_state', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shipping_zip">Code postal</Label>
                    <Input 
                      id="shipping_zip" 
                      value={profileData.shipping_zip}
                      onChange={(e) => handleInputChange('shipping_zip', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Adresse de retour</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="return_address_line1">Adresse ligne 1</Label>
                    <Input 
                      id="return_address_line1" 
                      value={profileData.return_address_line1}
                      onChange={(e) => handleInputChange('return_address_line1', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="return_address_line2">Adresse ligne 2</Label>
                    <Input 
                      id="return_address_line2" 
                      value={profileData.return_address_line2}
                      onChange={(e) => handleInputChange('return_address_line2', e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="return_city">Ville</Label>
                    <Input 
                      id="return_city" 
                      value={profileData.return_city}
                      onChange={(e) => handleInputChange('return_city', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="return_state">Région</Label>
                    <Input 
                      id="return_state" 
                      value={profileData.return_state}
                      onChange={(e) => handleInputChange('return_state', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="return_zip">Code postal</Label>
                    <Input 
                      id="return_zip" 
                      value={profileData.return_zip}
                      onChange={(e) => handleInputChange('return_zip', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="politiques" className="space-y-6 mt-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Politiques</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="return_policy">Politique de retour</Label>
                <Textarea
                  id="return_policy"
                  value={profileData.return_policy}
                  onChange={(e) => handleInputChange('return_policy', e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shipping_policy">Politique de livraison</Label>
                <Textarea
                  id="shipping_policy"
                  value={profileData.shipping_policy}
                  onChange={(e) => handleInputChange('shipping_policy', e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="complementaires" className="space-y-6 mt-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Informations complémentaires</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium">Avez-vous une boutique existante ?</Label>
                <RadioGroup 
                  value={profileData.has_existing_shop} 
                  onValueChange={(value) => handleInputChange('has_existing_shop', value)}
                  className="mt-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="shop-yes" />
                    <Label htmlFor="shop-yes">Oui</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="shop-no" />
                    <Label htmlFor="shop-no">Non</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="vendor_type" className="text-base font-medium">
                  Type de vendeur
                </Label>
                <Select value={profileData.vendor_type} onValueChange={(value) => handleInputChange('vendor_type', value)}>
                  <SelectTrigger className="mt-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="retailer">Détaillant</SelectItem>
                    <SelectItem value="wholesaler">Grossiste</SelectItem>
                    <SelectItem value="manufacturer">Fabricant</SelectItem>
                    <SelectItem value="distributor">Distributeur</SelectItem>
                    <SelectItem value="individual">Particulier</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={loading} className="px-8">
          {loading ? "Enregistrement..." : "Enregistrer les modifications"}
        </Button>
      </div>
    </div>
  );
}
