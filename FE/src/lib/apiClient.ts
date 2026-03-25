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
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

let refreshPromise: Promise<string> | null = null;

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

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                if (!refreshPromise) {
                    refreshPromise = authService.refreshToken().then((data) => {
                        if (data?.accessToken) {
                            localStorage.setItem("token", data.accessToken);
                            return data.accessToken;
                        }
                        throw new Error("No access token");
                    });
                }
                const newToken = await refreshPromise;
                refreshPromise = null;
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                refreshPromise = null;
                localStorage.removeItem("token");
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;