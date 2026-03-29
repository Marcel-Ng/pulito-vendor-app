import api, { ApiResponse } from "./api";

export type BankAccount = {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName?: string;
  vendorId: string;
};

export type AddBankAccountPayload = {
  bankName: string;
  accountNumber: string;
  accountName?: string;
};

export const bankAccountService = {
  addBankAccount: async (
    vendorId: string,
    payload: AddBankAccountPayload,
  ): Promise<ApiResponse<BankAccount>> => {
    const response = await api.post(
      `/vendors/${vendorId}/bank-accounts`,
      payload,
    );
    return response.data;
  },

  getBankAccounts: async (
    vendorId: string,
  ): Promise<ApiResponse<BankAccount[]>> => {
    const response = await api.get(`/vendors/${vendorId}/bank-accounts`);
    return response.data;
  },
};
