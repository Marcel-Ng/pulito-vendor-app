import { Vendor } from "@/src/types/vendor.types";
import api, { ApiResponse } from "./api";

export const vendorService = {
  getVendorsByUser: async (): Promise<Vendor[]> => {
    const response = await api.get<ApiResponse<Vendor[]>>("/vendors/me");
    return response.data.data;
  },
};
