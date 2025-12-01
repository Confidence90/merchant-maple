// pages/profile.tsx
import { useState, useEffect } from "react";
import Profile from "@/pages/vendor/Profile";
import CreateVendorProfile from "@/components/CreateVendorProfile";
import { vendorProfileApi } from "@/services/vendorProfileApi";

export default function ProfilePage() {
  const [hasVendorProfile, setHasVendorProfile] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkVendorProfile();
  }, []);

  const checkVendorProfile = async () => {
    try {
      const status = await vendorProfileApi.checkVendorStatus();
      setHasVendorProfile(status.has_vendor_profile);
    } catch (error) {
      console.error("Erreur vérification profil:", error);
      setHasVendorProfile(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!hasVendorProfile) {
    return <CreateVendorProfile onProfileCreated={checkVendorProfile} />;
  }

  return <Profile />;
}