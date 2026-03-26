import axios, { type InternalAxiosRequestConfig } from "axios";
import { authService } from "@/service/auth.service";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials:true,
});

apiClient.interceptors.request.use(
    (config) => {
        if (config.url?.includes("auth/refresh")){
            return config;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

let refreshPromise: Promise<void> | null = null;

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        const requestUrl = originalRequest.url ?? "";
        const isAuthCredentialRequest =
            requestUrl.includes("auth/login") ||
            requestUrl.includes("auth/register");

        if (isAuthCredentialRequest && error.response?.status === 401) {
            return Promise.reject(error);
        }

        const isRefreshRequest = requestUrl.includes("auth/refresh");

        if (error.response?.status === 401 && !originalRequest._retry && !isRefreshRequest) {
            originalRequest._retry = true;
            try {
                if (!refreshPromise) {
                    refreshPromise = authService.refreshToken().then(() => undefined);
                }
                await refreshPromise;
                refreshPromise = null;
                return apiClient(originalRequest);
            } catch (refreshError) {
                refreshPromise = null;
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;