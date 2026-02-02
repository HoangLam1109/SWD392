import apiClient from "@/lib/apiClient";
import type { LoginPayload, LoginResponse, RegisterPayload, RegisterResponse } from "@/types/Auth.types";
export const authService = {
    login: async (data: LoginPayload) => {
        const response = await apiClient.post('/auth/login', data);
        return response.data as LoginResponse;
    },
    register: async (data: RegisterPayload) => {
        const response = await apiClient.post('/auth/register', data);
        return response.data as RegisterResponse;
    },
};