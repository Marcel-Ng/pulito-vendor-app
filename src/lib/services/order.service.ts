import { OrderDetailResponse, OrdersResponse } from "@/src/types/order.types";
import api, { ApiResponse } from "./api";

export const orderService = {
  getOrders: async (vendorId: string): Promise<ApiResponse<OrdersResponse>> => {
    const response = await api.get(`/orders/vendors/${vendorId}`);
    return response.data;
  },

  getOrderById: async (
    orderId: string,
  ): Promise<ApiResponse<OrderDetailResponse>> => {
    const response = await api.get(`/orders/details/${orderId}?view=vendor`);
    return response.data;
  },
};
