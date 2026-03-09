import apiClient from "@/lib/apiClient";
import type { User, CreateUserDTO, UpdateUserDTO, UsersResponse, UserRole } from '@/types/User.types';

export const userService = {
    // Get all users with pagination, search, and filter
    async getUsers(
        cursor?: string,
        pageSize: number = 10,
        search: string = '',
        accountTypeFilter?: UserRole
    ): Promise<UsersResponse> {
        const params = new URLSearchParams({
            limit: pageSize.toString(),
            ...(cursor && { cursor }),
            ...(search && { search }),
            ...(search && { searchField: 'fullName,email' }),
            ...(accountTypeFilter && { role: accountTypeFilter }),
        });

        const response = await apiClient.get(`/users?${params.toString()}`);
        const backendData = response.data as UsersResponse;
        
        // Map backend response to expected format
        return {
            data: backendData.data || [],
            hasNextPage: backendData.hasNextPage || false,
            totalCount: backendData.totalCount,
            nextCursor: backendData.nextCursor,
        };
    },

    // Get single user by ID
    async getUserById(id: string): Promise<User | null> {
        try {
            const response = await apiClient.get(`/users/${id}`);
            return response.data as User;
        } catch (error) {
            console.error('Error fetching user by ID:', error);
            return null;
        }
    },

    // Get current user's info
    async getMe(): Promise<User> {
        const response = await apiClient.get('/users/me');
        return response.data as User;
    },

    // Create new user
    async createUser(data: CreateUserDTO): Promise<User> {
        const response = await apiClient.post('/users', data);
        return response.data as User;
    },

    // Update existing user
    async updateUser(id: string, data: UpdateUserDTO): Promise<User | null> {
        try {
            const response = await apiClient.patch(`/users/${id}`, data);
            return response.data as User;
        } catch (error) {
            console.error('Error updating user:', error);
            return null;
        }
    },

    // Delete user
    async deleteUser(id: string): Promise<boolean> {
        try {
            await apiClient.delete(`/users/${id}`);
            return true;
        } catch (error) {
            console.error('Error deleting user:', error);
            return false;
        }
    },
};
