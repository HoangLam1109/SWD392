import apiClient from "@/lib/apiClient";
import type { System } from "@/types/System.types";

export const systemService = {
    createSystem: async (data: System) => {
        const response = await apiClient.post('/system-requirements', data);
        return response.data;
    },
    getSystems: async () => {
        const response = await apiClient.get('/system-requirements');
        return response.data;
    },
    getSystemById: async (id: string) => {
        const response = await apiClient.get(`/system-requirements/${id}`);
        return response.data;
    },
    updateSystem: async (id: string, data: System) => {
        const response = await apiClient.put(`/system-requirements/${id}`, data);
        return response.data;
    },
    deleteSystem: async (id: string) => {
        const response = await apiClient.delete(`/system-requirements/${id}`);
        return response.data;
    },
}