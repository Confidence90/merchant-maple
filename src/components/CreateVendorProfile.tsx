// components/CreateVendorProfile.tsx
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { vendorProfileApi } from "@/services/vendorProfileApi";

interface CreateVendorProfileProps {
  onProfileCreated: () => void;
}

export default function CreateVendorProfile({ onProfileCreated }: CreateVendorProfileProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    shop_name: "",
    account_type: "individual" as "individual" | "company",
  });

  const handleCreate = async () => {
    if (!formData.shop_name.trim()) {
      toast({
        title: "Nom requis",
        description: "Veuillez entrer un nom pour votre boutique",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await vendorProfileApi.createVendorProfile({
        shop_name: formData.shop_name,
        account_type: formData.account_type,
      });
      toast({
        title: "Profil créé !",
        description: "Votre profil vendeur a été créé avec succès",
      });
      onProfileCreated();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.response?.data?.error || "Impossible de créer le profil",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Devenir vendeur</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="shop_name">Nom de votre boutique *</Label>
          <Input
            id="shop_name"
            value={formData.shop_name}
            onChange={(e) => setFormData(prev => ({ ...prev, shop_name: e.target.value }))}
            placeholder="Ma Super Boutique"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="account_type">Type de compte</Label>
          <Select
            value={formData.account_type}
            onValueChange={(value: "individual" | "company") => 
              setFormData(prev => ({ ...prev, account_type: value }))
            }
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

        <Button onClick={handleCreate} disabled={loading} className="w-full">
          {loading ? "Création..." : "Créer mon profil vendeur"}
        </Button>
      </CardContent>
    </Card>
  );
}