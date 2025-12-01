import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { vendorProfileApi, type VendorProfileData, type VendorStatus } from "@/services/vendorProfileApi";

// Valeurs par défaut pour éviter les champs undefined
const defaultProfileData: VendorProfileData = {
  shop_name: "",
  contact_name: "",
  contact_email: "",
  contact_phone: "",
  customer_service_name: "",
  customer_service_phone: "",
  customer_service_email: "",
  address_line1: "",
  address_line2: "",
  city: "",
  region: "",
  account_type: "individual",
  company_name: "",
  legal_representative: "",
  tax_id: "",
  vat_number: "",
  shipping_zone: "Bamako",
  shipping_address_line1: "",
  shipping_address_line2: "",
  shipping_city: "",
  shipping_state: "",
  shipping_zip: "",
  return_address_line1: "",
  return_address_line2: "",
  return_city: "",
  return_state: "",
  return_zip: "",
  has_existing_shop: "no",
  vendor_type: "retailer",
};

export default function Profile() {
  const { toast } = useToast();
  const [currentTab, setCurrentTab] = useState("general");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [vendorStatus, setVendorStatus] = useState<VendorStatus | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [userProfile, setUserProfile] = useState<any>(null);

  const [profileData, setProfileData] = useState<VendorProfileData>(defaultProfileData);

  // Charger les données au montage du composant
  useEffect(() => {
    loadVendorData();
  }, []);

  const loadVendorData = async () => {
    setLoading(true);
    try {
      // Vérifier le statut vendeur
      const status = await vendorProfileApi.checkVendorStatus();
      setVendorStatus(status);

      // Charger le profil utilisateur pour l'avatar
      try {
        const userData = await vendorProfileApi.getUserProfile();
        setUserProfile(userData);
        if (userData.avatar) {
          setAvatarPreview(userData.avatar);
        }
      } catch (error) {
        console.log("Profil utilisateur non disponible");
      }

      // Charger le profil vendeur
      const profile = await vendorProfileApi.getVendorProfile();
      
      // Fusionner avec les valeurs par défaut pour éviter les champs undefined
      setProfileData({
        ...defaultProfileData,
        ...profile
      });

    } catch (error: any) {
      console.error("Erreur chargement données:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données du profil",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof VendorProfileData | string, value: string | boolean) => {
    setProfileData(prev => ({ 
      ...prev as any, 
      [field]: value === undefined ? '' : value 
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Vérifier la taille du fichier (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "Fichier trop volumineux",
          description: "Le fichier doit faire moins de 2MB",
          variant: "destructive",
        });
        return;
      }

      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Type de fichier invalide",
          description: "Veuillez sélectionner une image",
          variant: "destructive",
        });
        return;
      }

      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const uploadAvatar = async () => {
    if (!avatarFile) return;

    try {
      await vendorProfileApi.updateUserProfile({ avatar: avatarFile });
      toast({
        title: "Avatar mis à jour",
        description: "Votre avatar a été changé avec succès",
      });
      setAvatarFile(null); // Réinitialiser après upload réussi
    } catch (error: any) {
      console.error("Erreur upload avatar:", error);
      toast({
        title: "Erreur",
        description: error.response?.data?.error || "Impossible de mettre à jour l'avatar",
        variant: "destructive",
      });
    }
  };

  // Dans votre composant Profile - Correction de la fonction handleSave
const handleSave = async () => {
  setSaving(true);
  try {
    // Uploader l'avatar d'abord si nécessaire
    if (avatarFile) {
      await vendorProfileApi.updateUserProfile({ avatar: avatarFile });
    }

    // Nettoyer les données avant envoi
    const dataToSend = { ...profileData };
    
    // Utiliser la méthode intelligente qui gère création/mise à jour automatiquement
    const savedProfile = await vendorProfileApi.saveVendorProfile(dataToSend);
    
    toast({
      title: "Profil mis à jour",
      description: "Vos informations ont été enregistrées avec succès",
    });

    // Mettre à jour les données locales
    setProfileData({
      ...defaultProfileData,
      ...savedProfile
    });

    // Si le profil est complété et l'utilisateur n'est pas encore vendeur, proposer l'activation
    if (savedProfile.is_completed && vendorStatus && !vendorStatus.is_seller) {
      toast({
        title: "Profil complété !",
        description: "Voulez-vous activer votre statut vendeur ?",
        action: (
          <Button 
            variant="outline" 
            onClick={activateVendor}
            className="ml-2"
          >
            Activer
          </Button>
        ),
      });
    }

  } catch (error: any) {
    console.error('Erreur sauvegarde:', error);
    
    let errorMessage = "Une erreur s'est produite lors de la sauvegarde";
    
    if (error.response?.data) {
      // Gestion spécifique des erreurs du backend
      if (error.response.data.error) {
        errorMessage = error.response.data.error;
      } else if (error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (typeof error.response.data === 'object') {
        // Erreurs de validation Django
        const fieldErrors = Object.values(error.response.data).flat();
        errorMessage = fieldErrors.join(', ');
      }
    }
    
    toast({
      title: "Erreur",
      description: errorMessage,
      variant: "destructive",
    });
  } finally {
    setSaving(false);
  }
};

  const activateVendor = async () => {
    try {
      await vendorProfileApi.activateVendorStatus();
      // Recharger le statut
      const status = await vendorProfileApi.checkVendorStatus();
      setVendorStatus(status);
      toast({
        title: "Félicitations !",
        description: "Vous êtes maintenant vendeur sur E-Sugu",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.response?.data?.error || "Impossible d'activer le statut vendeur",
        variant: "destructive",
      });
    }
  };

  // Fonction utilitaire pour obtenir les initiales
  const getInitials = () => {
    if (profileData.contact_name) {
      return profileData.contact_name.substring(0, 2).toUpperCase();
    }
    if (userProfile?.first_name) {
      return `${userProfile.first_name[0]}${userProfile.last_name?.[0] || ''}`.toUpperCase();
    }
    return 'MB';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Chargement du profil...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Profil boutique</h1>
        <p className="text-muted-foreground">
          {vendorStatus?.is_seller 
            ? "Gérez les informations complètes de votre boutique" 
            : "Complétez votre profil pour devenir vendeur"}
        </p>
        
        {/* Statut vendeur */}
        {vendorStatus && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Statut vendeur:</p>
                <p className="text-sm text-muted-foreground">
                  {vendorStatus.is_seller 
                    ? "✅ Vendeur actif" 
                    : vendorStatus.has_vendor_profile 
                      ? "📝 Profil en cours de complétion" 
                      : "❌ Pas encore de profil vendeur"}
                </p>
              </div>
              {!vendorStatus.is_seller && vendorStatus.has_vendor_profile && profileData.is_completed && (
                <Button onClick={activateVendor}>
                  Activer le statut vendeur
                </Button>
              )}
            </div>
          </div>
        )}
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
                  {avatarPreview && <AvatarImage src={avatarPreview} alt="Logo boutique" />}
                  <AvatarFallback className="text-2xl">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Label htmlFor="avatar-upload">
                    <Button variant="outline" className="gap-2 cursor-pointer" asChild>
                      <span>
                        <Upload className="h-4 w-4" />
                        Changer le logo
                      </span>
                    </Button>
                  </Label>
                  <p className="text-xs text-muted-foreground mt-2">PNG ou JPG, max 2MB</p>
                  {avatarFile && (
                    <p className="text-xs text-green-600 mt-1">
                      Nouvelle image sélectionnée
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="shop_name">Nom de la boutique *</Label>
                  <Input 
                    id="shop_name" 
                    value={profileData.shop_name || ''}
                    onChange={(e) => handleInputChange('shop_name', e.target.value)}
                    placeholder="Entrez le nom de votre boutique"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_email">Email *</Label>
                  <Input 
                    id="contact_email" 
                    type="email" 
                    value={profileData.contact_email || ''}
                    onChange={(e) => handleInputChange('contact_email', e.target.value)}
                    placeholder="email@votreboutique.fr"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contact_name">Nom du contact *</Label>
                  <Input 
                    id="contact_name" 
                    value={profileData.contact_name || ''}
                    onChange={(e) => handleInputChange('contact_name', e.target.value)}
                    placeholder="Votre nom complet"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_phone">Téléphone *</Label>
                  <Input 
                    id="contact_phone" 
                    value={profileData.contact_phone || ''}
                    onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                    placeholder="+223 XX XX XX XX"
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
                    value={profileData.customer_service_name || ''}
                    onChange={(e) => handleInputChange('customer_service_name', e.target.value)}
                    placeholder="Service Client"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer_service_phone">Téléphone</Label>
                  <Input 
                    id="customer_service_phone" 
                    value={profileData.customer_service_phone || ''}
                    onChange={(e) => handleInputChange('customer_service_phone', e.target.value)}
                    placeholder="+223 XX XX XX XX"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer_service_email">Email du service</Label>
                <Input 
                  id="customer_service_email" 
                  type="email"
                  value={profileData.customer_service_email || ''}
                  onChange={(e) => handleInputChange('customer_service_email', e.target.value)}
                  placeholder="service@votreboutique.fr"
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
                    value={profileData.address_line1 || ''}
                    onChange={(e) => handleInputChange('address_line1', e.target.value)}
                    placeholder="Rue, numéro"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address_line2">Adresse ligne 2</Label>
                  <Input 
                    id="address_line2" 
                    value={profileData.address_line2 || ''}
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
                    value={profileData.city || ''}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Bamako"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">Région</Label>
                  <Input 
                    id="region" 
                    value={profileData.region || ''}
                    onChange={(e) => handleInputChange('region', e.target.value)}
                    placeholder="Région"
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
                <Select 
                  value={profileData.account_type || 'individual'} 
                  onValueChange={(value: 'individual' | 'company') => handleInputChange('account_type', value)}
                >
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
                      value={profileData.company_name || ''}
                      onChange={(e) => handleInputChange('company_name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="legal_representative">Représentant légal</Label>
                    <Input 
                      id="legal_representative" 
                      value={profileData.legal_representative || ''}
                      onChange={(e) => handleInputChange('legal_representative', e.target.value)}
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="tax_id">Numéro fiscal (TIN)</Label>
                      <Input 
                        id="tax_id" 
                        value={profileData.tax_id || ''}
                        onChange={(e) => handleInputChange('tax_id', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vat_number">Numéro de TVA</Label>
                      <Input 
                        id="vat_number" 
                        value={profileData.vat_number || ''}
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
                  value={(profileData as any).return_policy || ''}
                  onChange={(e) => handleInputChange('return_policy', e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shipping_policy">Politique de livraison</Label>
                <Textarea
                  id="shipping_policy"
                  value={(profileData as any).shipping_policy || ''}
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

     <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={loadVendorData} disabled={saving}>
          Annuler
        </Button>
        <Button onClick={handleSave} disabled={saving} className="px-8">
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Enregistrement...
            </>
          ) : (
            "Enregistrer les modifications"
          )}
        </Button>
      </div>
    </div>
  );
}