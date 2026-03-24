import type { User, CreateUserDTO, UpdateUserDTO, UsersResponse, UserAccountType } from '@/types/User.types';

// Mock data for development
let mockUsers: User[] = [
    {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        accountType: 'admin' as UserAccountType,
        primaryPhone: '+1234567890',
        secondaryPhone: '+1234567891',
        createdAt: new Date('2024-01-15').toISOString(),
        updatedAt: new Date('2024-01-15').toISOString(),
    },
    {
        id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        accountType: 'manager' as UserAccountType,
        primaryPhone: '+1234567892',
        secondaryPhone: '',
        createdAt: new Date('2024-01-16').toISOString(),
        updatedAt: new Date('2024-01-16').toISOString(),
    },
    {
        id: '3',
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob.johnson@example.com',
        accountType: 'player' as UserAccountType,
        primaryPhone: '+1234567893',
        secondaryPhone: '+1234567894',
        createdAt: new Date('2024-01-17').toISOString(),
        updatedAt: new Date('2024-01-17').toISOString(),
    },
    {
        id: '4',
        firstName: 'Alice',
        lastName: 'Williams',
        email: 'alice.williams@example.com',
        accountType: 'player' as UserAccountType,
        primaryPhone: '+1234567895',
        secondaryPhone: '',
        createdAt: new Date('2024-01-18').toISOString(),
        updatedAt: new Date('2024-01-18').toISOString(),
    },
    {
        id: '5',
        firstName: 'Charlie',
        lastName: 'Brown',
        email: 'charlie.brown@example.com',
        accountType: 'manager' as UserAccountType,
        primaryPhone: '+1234567896',
        secondaryPhone: '+1234567897',
        createdAt: new Date('2024-01-19').toISOString(),
        updatedAt: new Date('2024-01-19').toISOString(),
    },
];

// Simulate async delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const userService = {
    // Get all users with pagination, search, and filter
    async getUsers(
        page: number = 1,
        pageSize: number = 10,
        search: string = '',
        accountTypeFilter?: UserAccountType
    ): Promise<UsersResponse> {
        await delay(500); // Simulate network delay

        let filteredUsers = [...mockUsers];

        // Apply search filter
        if (search) {
            const searchLower = search.toLowerCase();
            filteredUsers = filteredUsers.filter(
                user =>
                    user.firstName.toLowerCase().includes(searchLower) ||
                    user.lastName.toLowerCase().includes(searchLower) ||
                    user.email.toLowerCase().includes(searchLower)
            );
        }

        // Apply account type filter
        if (accountTypeFilter) {
            filteredUsers = filteredUsers.filter(user => user.accountType === accountTypeFilter);
        }

        // Calculate pagination
        const total = filteredUsers.length;
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

        return {
            users: paginatedUsers,
            total,
            page,
            pageSize,
        };
    },

    // Get single user by ID
    async getUserById(id: string): Promise<User | null> {
        await delay(300);
        const user = mockUsers.find(u => u.id === id);
        return user || null;
    },

    // Create new user
    async createUser(data: CreateUserDTO): Promise<User> {
        await delay(500);

        const newUser: User = {
            id: (mockUsers.length + 1).toString(),
            ...data,
            primaryPhone: data.primaryPhone || '',
            secondaryPhone: data.secondaryPhone || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        mockUsers.push(newUser);
        return newUser;
    },

    // Update existing user
    async updateUser(id: string, data: UpdateUserDTO): Promise<User | null> {
        await delay(500);

        const userIndex = mockUsers.findIndex(u => u.id === id);
        if (userIndex === -1) return null;

        const updatedUser: User = {
            ...mockUsers[userIndex],
            ...data,
            updatedAt: new Date().toISOString(),
        };

        mockUsers[userIndex] = updatedUser;
        return updatedUser;
    },

    // Delete user (soft delete simulation)
    async deleteUser(id: string): Promise<boolean> {
        await delay(500);

        const userIndex = mockUsers.findIndex(u => u.id === id);
        if (userIndex === -1) return false;

        mockUsers.splice(userIndex, 1);
        return true;
    },
};
