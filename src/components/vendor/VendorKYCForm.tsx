import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { vendorApi } from "@/services/vendorApi";

type AccountType = "individual" | "company";

interface VendorKYCFormProps {
  accountType?: AccountType;
  onSuccess?: () => void;
}

export default function VendorKYCForm({ accountType = "individual", onSuccess }: VendorKYCFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [idType, setIdType] = useState<"carte-identite" | "passeport" | "permis-conduire">("carte-identite");
  const [idNumber, setIdNumber] = useState("");
  const [idFront, setIdFront] = useState<File | null>(null);
  const [idBack, setIdBack] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);
  const [proofAddress, setProofAddress] = useState<File | null>(null);
  const [businessRegistration, setBusinessRegistration] = useState<File | null>(null);

  const validate = () => {
    if (!idNumber || !idFront || !selfie) {
      toast({
        title: "Champs manquants",
        description: "Veuillez fournir au minimum le numéro d'identité, la face avant et le selfie.",
        variant: "destructive",
      });
      return false;
    }

    if (accountType === "company" && !businessRegistration) {
      toast({
        title: "Document manquant",
        description: "Le document d’enregistrement de l’entreprise est obligatoire.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await vendorApi.submitKYC({
        id_type: idType,
        id_number: idNumber,
        id_front: idFront!,
        id_back: idBack || undefined,
        selfie_with_id: selfie!,
        proof_of_address: proofAddress || undefined,
        business_registration: businessRegistration || undefined,
      });

      toast({
        title: "KYC envoyé",
        description: "Vos documents sont en cours de vérification.",
      });

      onSuccess?.();
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err.response?.data?.error || "Échec de l’envoi du KYC",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Vérification d’identité (KYC)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Type de document</Label>
          <Select value={idType} onValueChange={(v) => setIdType(v as any)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="carte-identite">Carte d'identité</SelectItem>
              <SelectItem value="passeport">Passeport</SelectItem>
              <SelectItem value="permis-conduire">Permis de conduire</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Numéro du document</Label>
          <Input value={idNumber} onChange={(e) => setIdNumber(e.target.value)} />
        </div>

        <FileInput label="Document – Face avant *" onChange={setIdFront} />
        <FileInput label="Document – Face arrière (optionnel)" onChange={setIdBack} />
        <FileInput label="Selfie avec document *" onChange={setSelfie} />
        <FileInput label="Justificatif de domicile (optionnel)" onChange={setProofAddress} />

        {accountType === "company" && (
          <FileInput
            label="Document d’enregistrement de l’entreprise *"
            onChange={setBusinessRegistration}
          />
        )}

        <Button onClick={handleSubmit} disabled={loading} className="w-full">
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Envoyer le KYC
        </Button>
      </CardContent>
    </Card>
  );
}

function FileInput({ label, onChange }: { label: string; onChange: (file: File | null) => void }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        type="file"
        accept="image/*,.pdf"
        onChange={(e) => onChange(e.target.files?.[0] || null)}
      />
    </div>
  );
}
