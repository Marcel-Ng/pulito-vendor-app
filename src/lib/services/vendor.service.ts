import { BalanceResponse, Vendor } from "@/src/types/vendor.types";
import api, { ApiResponse } from "./api";

export const vendorService = {
  getVendorsByUser: async (): Promise<Vendor[]> => {
    const response = await api.get<ApiResponse<Vendor[]>>("/vendors/me");
    return response.data.data;
  },

  getBalance: async (
    vendorId: string,
  ): Promise<ApiResponse<BalanceResponse>> => {
    const response = await api.get(`/vendors/${vendorId}/balance`);
    return response.data;
  },

  updateBusinessProfile: async (
    vendorId: string,
    profileData: Partial<Vendor["profile"]>,
  ): Promise<void> => {
    await api.patch(`/vendors/${vendorId}`, {
      businessName: profileData.businessName,
      about: profileData.about,
      phone: profileData.phone,
    });
  },

  updateBusinessImage: async (
    vendorId: string,
    imageUri: string,
  ): Promise<void> => {
    const formData = new FormData();
    formData.append("image", {
      uri: imageUri,
      type: "image/jpeg",
      name: "business-image.jpg",
    } as any);

    await api.patch(`/vendors/${vendorId}/image`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  async getReviews(vendorId: string) {
    const result = await api.get(`/vendors/${vendorId}/reviews`);
    return result.data.data;
  },
};
