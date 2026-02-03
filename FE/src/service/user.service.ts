import apiClient from '@/lib/apiClient';
import type {
    User,
    CreateUserDTO,
    UpdateUserDTO,
    UsersResponse,
    PaginationOptions,
    PaginationResponse,
} from '@/types/User.types';

export const userService = {
    /**
     * Get all users with pagination and optional filters
     * @param options - Pagination and filter options
     * @returns Promise with users data and pagination info
     */
    async getUsers(options: PaginationOptions = {}): Promise<UsersResponse> {
        try {
            const params = new URLSearchParams();

            // Add pagination parameters
            if (options.limit) params.append('limit', options.limit.toString());
            if (options.sortBy) params.append('sortBy', options.sortBy);
            if (options.sortOrder) params.append('sortOrder', options.sortOrder);
            if (options.cursor) params.append('cursor', options.cursor);
            if (options.search) params.append('search', options.search);
            if (options.searchField) params.append('searchField', options.searchField);

            const response = await apiClient.get<PaginationResponse<User>>(
                `/users?${params.toString()}`
            );

            // Transform backend pagination response to frontend format
            return {
                users: response.data.data,
                total: response.data.totalCount || response.data.data.length,
                hasNextPage: response.data.hasNextPage,
                nextCursor: response.data.nextCursor,
            };
        } catch (error) {
            console.error('Error fetching users:', error);
            throw new Error('Failed to fetch users. Please try again later.');
        }
    },

    /**
     * Get a single user by ID
     * @param id - User ID
     * @returns Promise with user data or null if not found
     */
    async getUserById(id: string): Promise<User | null> {
        try {
            const response = await apiClient.get<User>(`/users/${id}`);
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 404) {
                return null;
            }
            console.error(`Error fetching user ${id}:`, error);
            throw new Error('Failed to fetch user details. Please try again later.');
        }
    },

    /**
     * Create a new user
     * @param data - User creation data
     * @returns Promise with created user data
     */
    async createUser(data: CreateUserDTO): Promise<User> {
        try {
            const response = await apiClient.post<User>('/users', data);
            return response.data;
        } catch (error: any) {
            console.error('Error creating user:', error);

            // Handle validation errors
            if (error.response?.status === 400) {
                const message = error.response?.data?.message || 'Invalid user data';
                throw new Error(message);
            }

            throw new Error('Failed to create user. Please try again later.');
        }
    },

    /**
     * Update an existing user
     * @param id - User ID
     * @param data - User update data
     * @returns Promise with updated user data or null if not found
     */
    async updateUser(id: string, data: UpdateUserDTO): Promise<User | null> {
        try {
            const response = await apiClient.patch<User>(`/users/${id}`, data);
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 404) {
                return null;
            }

            console.error(`Error updating user ${id}:`, error);

            // Handle validation errors
            if (error.response?.status === 400) {
                const message = error.response?.data?.message || 'Invalid user data';
                throw new Error(message);
            }

            throw new Error('Failed to update user. Please try again later.');
        }
    },

    /**
     * Delete a user
     * @param id - User ID
     * @returns Promise with boolean indicating success
     */
    async deleteUser(id: string): Promise<boolean> {
        try {
            await apiClient.delete(`/users/${id}`);
            return true;
        } catch (error: any) {
            if (error.response?.status === 404) {
                return false;
            }

            console.error(`Error deleting user ${id}:`, error);
            throw new Error('Failed to delete user. Please try again later.');
        }
    },
};
