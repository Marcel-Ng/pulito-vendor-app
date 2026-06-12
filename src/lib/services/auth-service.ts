import api, { ApiResponse } from "./api";

export type loginResponse = {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
};

export const authService = {
  login: async (
    email: string,
    password: string,
  ): Promise<ApiResponse<loginResponse>> => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  requestPasswordReset: async (email: string): Promise<ApiResponse<null>> => {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  },

  verifyOtp: async (
    email: string,
    code: string,
  ): Promise<ApiResponse<null>> => {
    console.log("API call: verifyOtp with email:", email, "code:", code);
    const response = await api.post("/auth/verify-otp", { email, code });
    return response.data;
  },

  resetPassword: async (
    email: string,
    code: string,
    password: string,
  ): Promise<ApiResponse<null>> => {
    const response = await api.post("/auth/reset-password", {
      email,
      code,
      password,
    });
    return response.data;
  },

  async deleteAccount(): Promise<void> {
    await api.delete("/users/delete");
  },
};
