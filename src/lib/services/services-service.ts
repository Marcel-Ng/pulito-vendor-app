/**
 * vendorServicesService.ts
 *
 * All API calls for vendor service items.
 * Uses the shared axios instance from ServicesContext (interceptors + baseURL included).
 * The context calls these functions — screens never import this file directly.
 */
import { ServiceItem, ServiceItemInput } from "@/src/types/service.types";
import api from "./api";
export const vendorServicesService = {
  getAll: async (): Promise<ServiceItem[]> => {
    const { data } = await api.get<ServiceItem[]>("/vendor/service-items");
    return data;
  },

  getById: async (id: string): Promise<ServiceItem> => {
    const { data } = await api.get<ServiceItem>(`/vendor/service-items/${id}`);
    return data;
  },

  create: async (input: ServiceItemInput): Promise<ServiceItem> => {
    const { data } = await api.post<ServiceItem>(
      "/vendor/service-items",
      input,
    );
    return data;
  },

  update: async (id: string, input: ServiceItemInput): Promise<ServiceItem> => {
    const { data } = await api.put<ServiceItem>(
      `/vendor/service-items/${id}`,
      input,
    );
    return data;
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/vendor/service-items/${id}`);
  },
};
