import { ServiceItem } from "@/src/types/service.types";
export type BusinessProfile = {
  businessName: string;
  phone: string;
  email: string;
  address: string;
  about: string;
};

export type VendorType = "carwash" | "laundry";

export type Vendor = {
  id: string;
  name: string;
  balance: number;
  avatarBg: string;
  avatarEmoji: string;
  vendorType: VendorType;
  profile: BusinessProfile;
  items: ServiceItem[];
};

export type BalanceResponse = {
  balance: number;
};
