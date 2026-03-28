import { vendorService } from "@/src/lib/services/vendor.service";
import { BusinessProfile, Vendor } from "@/src/types/vendor.types";
import React, { createContext, useContext, useEffect, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

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

  // ─── 🔥 MAP API → UI ─────────────────────────────────────────────
  const mapApiToVendor = (v: any): Vendor => ({
    id: v.id,
    name: v.name,
    avatarBg: v.avatarBg || "#3B82F6",
    avatarEmoji: v.avatarEmoji || "🏪",
    vendorType: v.vendorType || "Laundry",

    profile: {
      businessName: v.businessName,
      phone: v.phone,
      email: v.email,
      address: v.address,
    },

    items: v.items || [],
  });

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const data = await vendorService.getVendorsByUser();

        console.log("API vendors:", data);

        const mapped = data.map(mapApiToVendor);

        setVendors(mapped);

        if (mapped.length > 0) {
          setActiveVendor(mapped[0]);
        }
      } catch (err) {
        console.error("Failed to fetch vendors:", err);
      }
    };

    fetchVendors();
  }, []);

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
