import { vendorService } from "@/src/lib/services/vendor.service";
import { BusinessProfile, Vendor } from "@/src/types/vendor.types";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

// ─── Types ───────────────────────────────────────────────────────────────────
type VendorContextType = {
  vendors: Vendor[];
  activeVendor: Vendor | null; // null until API responds
  isLoading: boolean;
  setActiveVendor: (vendor: Vendor) => void;
  updateBusinessProfile: (data: Partial<BusinessProfile>) => void;
  refreshVendors: () => Promise<void>; // expose for manual refetch
};

const VendorContext = createContext<VendorContextType | null>(null);

// ─── Context ─────────────────────────────────────────────────────────────────
export function VendorProvider({ children }: { children: React.ReactNode }) {
  const [vendors, setVendors] = useState<Vendor[]>([]); // no mock data
  const [activeVendor, setActiveVendor] = useState<Vendor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { logOut } = useAuth();

  const mapApiToVendor = (v: any): Vendor => ({
    id: v.id,
    name: v.businessName, // was v.name
    balance: v.balance ?? 0,
    avatarBg: "#3B82F6",
    avatarEmoji: "🏪",
    vendorType: v.type, // was v.vendorType
    profile: {
      businessName: v.businessName,
      phone: v.phone || "",
      email: v.email || "",
      address: v.serviceArea || "", // closest match
      about: v.about || "",
    },
    items: v.items || [],
  });

  const fetchVendors = async () => {
    setIsLoading(true);
    try {
      const data = await vendorService.getVendorsByUser();

      if (!data || data.length === 0) {
        console.warn("No vendors found for user");
        logOut();
        return;
      }
      const mapped = data.map(mapApiToVendor);
      setVendors(mapped);
      if (mapped.length > 0) {
        setActiveVendor((prev) =>
          // keep current active if still in list, else default to first
          prev
            ? (mapped.find((v) => v.id === prev.id) ?? mapped[0])
            : mapped[0],
        );
      }
    } catch (err) {
      console.error("Failed to fetch vendors:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const updateBusinessProfile = (data: Partial<BusinessProfile>) => {
    if (!activeVendor) return;
    const updated = {
      ...activeVendor,
      profile: { ...activeVendor.profile, ...data },
    };
    setActiveVendor(updated);
    setVendors((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
  };

  return (
    <VendorContext.Provider
      value={{
        vendors,
        activeVendor,
        isLoading,
        setActiveVendor,
        updateBusinessProfile,
        refreshVendors: fetchVendors,
      }}
    >
      {children}
    </VendorContext.Provider>
  );
}

export function useVendor() {
  const ctx = useContext(VendorContext);
  if (!ctx) throw new Error("useVendor must be used within a VendorProvider");
  return ctx;
}
