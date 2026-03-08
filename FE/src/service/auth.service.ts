import apiClient from "@/lib/apiClient";
import type { LoginPayload, LoginResponse, RegisterPayload, RegisterResponse, CurrentUserResponse, RefreshTokenResponse } from "@/types/Auth.types";
export const authService = {
    login: async (data: LoginPayload) => {
        const response = await apiClient.post('/auth/login', data);
        return response.data as LoginResponse;
    },
    register: async (data: RegisterPayload) => {
        const response = await apiClient.post('/auth/register', data);
        return response.data as RegisterResponse;
    },
    getCurrentUser: async () => {
        const response = await apiClient.get('/users/me');
        return response.data as CurrentUserResponse;
    },
    refreshToken: async () => {
        const response = await apiClient.post('/auth/refresh');
        return response.data as RefreshTokenResponse;
    },
};