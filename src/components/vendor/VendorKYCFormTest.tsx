import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface VendorKYCFormTestProps {
  onSuccess?: () => void;
}

export default function VendorKYCFormTest({ onSuccess }: VendorKYCFormTestProps) {
  return (
    <Card className="shadow-md p-4">
      <CardHeader>
        <CardTitle>🔹 Formulaire KYC Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>Le formulaire KYC s’affiche correctement !</p>
        <Button
          onClick={() => {
            console.log("KYC soumis !");
            if (onSuccess) onSuccess();
          }}
        >
          Simuler soumission KYC
        </Button>
      </CardContent>
    </Card>
  );
}
