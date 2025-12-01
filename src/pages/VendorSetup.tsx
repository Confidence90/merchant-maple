// pages/VendorSetup.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Store, UserCheck, ArrowRight, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function VendorSetup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    shop_name: '',
    account_type: 'individual',
    company_name: '',
    legal_representative: '',
    tax_id: '',
    vendor_type: 'retailer',
    has_existing_shop: 'no',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const createVendorProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/users/vendor/create-profile/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la création du profil');
      }

      const data = await response.json();
      
      toast({
        title: "Succès",
        description: "Profil vendeur créé avec succès !",
      });

      // Passer à l'étape suivante
      setStep(2);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const activateVendorStatus = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/users/vendor/activate/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'activation du statut vendeur');
      }

      toast({
        title: "Félicitations !",
        description: "Vous êtes maintenant vendeur sur E-sugu !",
      });

      navigate('/add-product');
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Store className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle>Devenir vendeur sur E-sugu</CardTitle>
            <CardDescription>
              Complétez votre profil pour commencer à vendre
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Indicateur d'étapes */}
            <div className="flex justify-center mb-8">
              <div className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  1
                </div>
                <div className={`w-12 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  2
                </div>
              </div>
            </div>

            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="shop_name">Nom de votre boutique *</Label>
                  <Input
                    id="shop_name"
                    value={formData.shop_name}
                    onChange={(e) => handleInputChange('shop_name', e.target.value)}
                    placeholder="Ex: Ma Belle Boutique"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="account_type">Type de compte</Label>
                  <Select value={formData.account_type} onValueChange={(value) => handleInputChange('account_type', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Particulier</SelectItem>
                      <SelectItem value="company">Entreprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.account_type === 'company' && (
                  <>
                    <div>
                      <Label htmlFor="company_name">Nom de l'entreprise *</Label>
                      <Input
                        id="company_name"
                        value={formData.company_name}
                        onChange={(e) => handleInputChange('company_name', e.target.value)}
                        placeholder="Ex: SARL Ma Société"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="legal_representative">Représentant légal *</Label>
                      <Input
                        id="legal_representative"
                        value={formData.legal_representative}
                        onChange={(e) => handleInputChange('legal_representative', e.target.value)}
                        placeholder="Nom complet du représentant"
                        className="mt-1"
                      />
                    </div>
                  </>
                )}

                <Button 
                  onClick={createVendorProfile} 
                  disabled={!formData.shop_name || loading}
                  className="w-full"
                >
                  {loading ? 'Création...' : 'Créer mon profil vendeur'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                
                <h3 className="text-xl font-semibold">Profil créé avec succès !</h3>
                <p className="text-gray-600">
                  Votre profil vendeur a été créé. Activez maintenant votre statut vendeur pour commencer à publier des annonces.
                </p>

                <Button 
                  onClick={activateVendorStatus} 
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Activation...' : 'Activer mon statut vendeur'}
                  <UserCheck className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}