import { ServiceItem } from "@/src/types/service.types";
export type BusinessProfile = {
  businessName: string;
  phone: string;
  email: string;
  address: string;
  about: string;
};

export type Vendor = {
  id: string;
  name: string;
  balance: number;
  avatarBg: string;
  avatarEmoji: string;
  vendorType: "Car Wash" | "Laundry";
  profile: BusinessProfile;
  items: ServiceItem[];
};

export type BalanceResponse = {
  balance: number;
};
