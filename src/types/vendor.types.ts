import { ServiceItem } from "@/src/types/service.types";
export type BusinessProfile = {
  businessName: string;
  phone: string;
  email: string;
  address: string;
};

export type Vendor = {
  id: string;
  name: string;
  avatarBg: string;
  avatarEmoji: string;
  vendorType: "Car Wash" | "Laundry";
  profile: BusinessProfile;
  items: ServiceItem[];
};
