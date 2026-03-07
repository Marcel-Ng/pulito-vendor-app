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
  role: "Owner" | "Manager";
  profile: BusinessProfile;
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
    role: "Owner",
    profile: {
      businessName: "Washerman Laundry Services",
      phone: "000 0000 0000",
      email: "Username@gmail.com",
      address: "No. 7, Afolabi Close, Lagos 11231",
    },
  },
  {
    id: 2,
    name: "FreshPress Cleaners",
    avatarBg: "#3B82F6",
    avatarEmoji: "👗",
    role: "Manager",
    profile: {
      businessName: "FreshPress Cleaners",
      phone: "081 2345 6789",
      email: "freshpress@gmail.com",
      address: "12, Bode Thomas Street, Surulere, Lagos",
    },
  },
  {
    id: 3,
    name: "Sparkle Dry Clean",
    avatarBg: "#10B981",
    avatarEmoji: "✨",
    role: "Owner",
    profile: {
      businessName: "Sparkle Dry Clean",
      phone: "090 8765 4321",
      email: "sparkle@gmail.com",
      address: "5, Allen Avenue, Ikeja, Lagos",
    },
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
