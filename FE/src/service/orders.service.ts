import apiClient from "@/lib/apiClient";
import type { UpdateOrderDTO } from "@/types/Orders.types";

export const ordersService = {
    getOrders: async (params?: { cursor?: string; pageSize?: number; search?: string }) => {
        const response = await apiClient.get('/orders', { params });
        return response.data;
    },
    getOrderById: async (id: string) => {
        const response = await apiClient.get(`/orders/${id}`);
        return response.data;
    },
    getOrdersByUserId: async (userId: string) => {
        const response = await apiClient.get(`/orders/user/${userId}`);
        return response.data;
    },
    createOrder: async (order: Record<string, unknown>) => {
        const response = await apiClient.post('/orders', order);
        return response.data;
    },
    updateOrder: async (id: string, order: UpdateOrderDTO) => {
        const response = await apiClient.patch(`/orders/${id}`, order);
        return response.data;
    },
    cancelOrder: async (id: string) => {
        const response = await apiClient.patch(`/orders/${id}`, {
            paymentStatus: 'CANCELLED',
        });
        return response.data;
    },
    checkoutOrder: async () => {
        const response = await apiClient.post('/orders/checkout');
        return response.data;
    },
};
    