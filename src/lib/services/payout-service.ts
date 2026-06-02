import api, { ApiResponse } from "./api";

export type RequestPayoutPayload = {
  amount: number;
  bankAccountId: string;
};

export type PayoutResponse = {
  id: string;
  reference: string;
  amount: number;
  status: string;
  bankAccountId: string;
  vendorId: string;
  createdAt: string;
};

export const payoutService = {
  getPayouts: async (
    vendorId: string,
  ): Promise<ApiResponse<PayoutResponse[]>> => {
    const response = await api.get(`/payouts/vendors/${vendorId}`);
    return response.data;
  },

  requestPayout: async (
    vendorId: string,
    payload: RequestPayoutPayload,
  ): Promise<ApiResponse<PayoutResponse>> => {
    const response = await api.post(
      `/payouts/${vendorId}/vendor/request-payout`,
      payload,
    );
    return response.data;
  },
};
