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
};
