import apiClient from "@/lib/apiClient";
import type { CreateOrderDetailDTO, UpdateOrderDetailDTO } from "@/types/Orders.types";

export const orderDetailService = {
    getOrderDetails: async (params?: { cursor?: string; limit?: number; search?: string; searchField?: string }) => {
        const response = await apiClient.get('/order-detail', { params });
        return response.data;
    },
    getOrderDetailById: async (id: string) => {
        const response = await apiClient.get(`/order-detail/${id}`);
        return response.data;
    },
    getOrderDetailsByOrderId: async (orderId: string) => {
        const response = await apiClient.get(`/order-detail/order/${orderId}`);
        return response.data;
    },
    createOrderDetail: async (data: CreateOrderDetailDTO) => {
        const response = await apiClient.post('/order-detail', data);
        return response.data;
    },
    updateOrderDetail: async (id: string, data: UpdateOrderDetailDTO) => {
        const response = await apiClient.patch(`/order-detail/${id}`, data);
        return response.data;
    },
    deleteOrderDetail: async (id: string) => {
        const response = await apiClient.delete(`/order-detail/${id}`);
        return response.data;
    },
    deleteOrderDetailsByOrderId: async (orderId: string) => {
        const response = await apiClient.delete(`/order-detail/order/${orderId}`);
        return response.data;
    },
};
