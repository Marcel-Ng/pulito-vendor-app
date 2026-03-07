import { ServiceItem } from "@/src/types/service.types";
import React, { createContext, useContext, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type BusinessProfile = {
  businessName: string;
  phone: string;
  email: string;
  address: string;
};

export type Vendor = {
  id: number;
  name: string;
  avatarBg: string;
  avatarEmoji: string;
  vendorType: "Car Wash" | "Laundry";
  profile: BusinessProfile;
  items: ServiceItem[];
};

type VendorContextType = {
  vendors: Vendor[];
  activeVendor: Vendor;
  setActiveVendor: (vendor: Vendor) => void;
  updateBusinessProfile: (data: Partial<BusinessProfile>) => void;
};

// ─── Mock data (replace with API later) ──────────────────────────────────────

const INITIAL_VENDORS: Vendor[] = [
  {
    id: 1,
    name: "Washerman Laundry Service",
    avatarBg: "#d4a017",
    avatarEmoji: "👔",
    vendorType: "Laundry",
    profile: {
      businessName: "Washerman Laundry Services",
      phone: "000 0000 0000",
      email: "Username@gmail.com",
      address: "No. 7, Afolabi Close, Lagos 11231",
    },
    items: [
      { id: "1", category: "Wash & Iron", name: "Shirts", amount: "400" },
      { id: "2", category: "Wash & Iron", name: "Trousers", amount: "450" },
      { id: "3", category: "Wash & Iron", name: "T-Shirts", amount: "300" },
      { id: "4", category: "Wash & Iron", name: "Dresses", amount: "500" },
      { id: "10", category: "Iron Only", name: "Dress", amount: "250" },
      { id: "11", category: "Iron Only", name: "Shirts", amount: "200" },
      { id: "12", category: "Steam Press", name: "Suits", amount: "1500" },
      { id: "13", category: "Steam Press", name: "Blazers", amount: "1000" },
    ],
  },
  {
    id: 2,
    name: "Zenith Cleaners",
    avatarBg: "#3B82F6",
    avatarEmoji: "🚗",
    vendorType: "Car Wash",
    profile: {
      businessName: "FreshPress Cleaners",
      phone: "081 2345 6789",
      email: "freshpress@gmail.com",
      address: "12, Bode Thomas Street, Surulere, Lagos",
    },
    items: [],
  },
  {
    id: 3,
    name: "Sparkle Dry Clean",
    avatarBg: "#10B981",
    avatarEmoji: "✨",
    vendorType: "Laundry",
    profile: {
      businessName: "Sparkle Dry Clean",
      phone: "090 8765 4321",
      email: "sparkle@gmail.com",
      address: "5, Allen Avenue, Ikeja, Lagos",
    },
    items: [
      { id: "1", category: "Wash & Iron", name: "Shirts", amount: "400" },
      { id: "2", category: "Wash & Iron", name: "Trousers", amount: "450" },
      { id: "3", category: "Wash & Iron", name: "T-Shirts", amount: "300" },
      { id: "4", category: "Wash & Iron", name: "Dresses", amount: "500" },
      { id: "10", category: "Iron Only", name: "Dress", amount: "250" },
      { id: "11", category: "Iron Only", name: "Shirts", amount: "200" },
    ],
  },
];

// ─── Context ──────────────────────────────────────────────────────────────────

const VendorContext = createContext<VendorContextType | null>(null);

export function VendorProvider({ children }: { children: React.ReactNode }) {
  const [vendors, setVendors] = useState<Vendor[]>(INITIAL_VENDORS);
  const [activeVendor, setActiveVendor] = useState<Vendor>(INITIAL_VENDORS[0]);

  const updateBusinessProfile = (data: Partial<BusinessProfile>) => {
    // Update both the vendors list and the activeVendor in sync
    const updated = {
      ...activeVendor,
      profile: { ...activeVendor.profile, ...data },
    };
    setActiveVendor(updated);
    setVendors((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
  };

  return (
    <VendorContext.Provider
      value={{ vendors, activeVendor, setActiveVendor, updateBusinessProfile }}
    >
      {children}
    </VendorContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useVendor() {
  const ctx = useContext(VendorContext);
  if (!ctx) throw new Error("useVendor must be used within a VendorProvider");
  return ctx;
}
