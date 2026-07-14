import apiClient from "./apiClient";
import apiRoutes from "@/config/apiRoutes";

type ApiResponse = {
  success: boolean;
  message: string;
  token?: string;
  user?: unknown;
};

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

export class AuthService {
  static async register(name: string, email: string, password: string): Promise<ApiResponse> {
    const payload: RegisterPayload = { name, email, password };

    const response = await apiClient.post<ApiResponse>(apiRoutes.auth.register, payload);
    return response.data;
  }

  static async login(email: string, password: string): Promise<ApiResponse> {
    const payload: LoginPayload = { email, password };

    const response = await apiClient.post<ApiResponse>(apiRoutes.auth.login, payload);
    return response.data;
  }
}
