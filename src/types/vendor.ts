export type AccountType = "individual" | "company";

export interface VendorProfile {
  id?: number;
  shop_name: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;

  customer_service_name?: string;
  customer_service_phone?: string;
  customer_service_email?: string;

  address_line1?: string;
  address_line2?: string;
  city?: string;
  region?: string;

  account_type: AccountType;
  company_name?: string;
  legal_representative?: string;
  tax_id?: string;
  vat_number?: string;

  shipping_zone?: string;
  shipping_address_line1?: string;
  shipping_address_line2?: string;
  shipping_city?: string;
  shipping_state?: string;
  shipping_zip?: string;

  return_address_line1?: string;
  return_address_line2?: string;
  return_city?: string;
  return_state?: string;
  return_zip?: string;

  has_existing_shop?: "yes" | "no";
  vendor_type?: "retailer" | "wholesaler" | "manufacturer" | "distributor" | "individual";

  is_completed?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface VendorStatus {
  is_seller: boolean;
  is_seller_pending: boolean;
  has_vendor_profile: boolean;
  vendor_profile_completed: boolean;
  role: "buyer" | "seller" | "admin";
  requires_kyc: boolean;
  can_create_listing: boolean;
}

export interface VendorKYCData {
  id_type: "carte-identite" | "passeport" | "permis-conduire";
  id_number: string;
  id_front: File;
  id_back?: File;
  selfie_with_id: File;
  proof_of_address?: File;
  business_registration?: File;
}
