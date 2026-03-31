import { OrdersResponse } from "@/src/types/order.types";
import api, { ApiResponse } from "./api";

export const orderService = {
  getOrders: async (vendorId: string): Promise<ApiResponse<OrdersResponse>> => {
    const response = await api.get(`/orders/vendors/${vendorId}`);
    return response.data;
  },
};
