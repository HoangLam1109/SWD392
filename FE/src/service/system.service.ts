import apiClient from "@/lib/apiClient";
import type { System } from "@/types/System.types";

type SystemPayload = Omit<System, "id">;

export const systemService = {
    createSystem: async (data: SystemPayload) => {
        const response = await apiClient.post('/system-requirements', data);
        return response.data as System;
    },
    getSystems: async () => {
        const response = await apiClient.get('/system-requirements');
        return response.data;
    },
    getSystemsByGameId: async (gameId: string) => {
        const response = await apiClient.get(`/system-requirements/game/${gameId}`);
        return response.data as System[];
    },
    getSystemById: async (id: string) => {
        const response = await apiClient.get(`/system-requirements/${id}`);
        return response.data as System;
    },
    updateSystem: async (id: string, data: SystemPayload) => {
        const response = await apiClient.put(`/system-requirements/${id}`, data);
        return response.data as System;
    },
    deleteSystem: async (id: string) => {
        const response = await apiClient.delete(`/system-requirements/${id}`);
        return response.data;
    },
}