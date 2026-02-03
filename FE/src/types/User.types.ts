// User role constants matching backend
export const UserRole = {
    ADMIN: 'Admin',
    MODERATOR: 'Moderator',
    PLAYER: 'Player',
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

// User status constants matching backend
export const UserStatus = {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
} as const;

export type UserStatus = typeof UserStatus[keyof typeof UserStatus];

// Main User interface matching backend UserResponseDto
export interface User {
    id: string;
    email: string;
    fullName: string;
    role: UserRole;
    status: UserStatus;
    avatar?: string;
    createdAt: string;
    updatedAt: string;
}

// CreateUserDTO matching backend CreateUserDto
export interface CreateUserDTO {
    email: string;
    fullName: string;
    password: string;
    role: UserRole;
    avatar?: string;
    status: UserStatus;
}

// UpdateUserDTO matching backend UpdateUserDto
export interface UpdateUserDTO {
    email?: string;
    fullName?: string;
    password?: string;
    role?: UserRole;
    avatar?: string;
    status?: UserStatus;
}

// Pagination options matching backend PaginationOptionsDto
export interface PaginationOptions {
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    cursor?: string;
    search?: string;
    searchField?: string;
}

// Pagination response matching backend PaginationResponseDto
export interface PaginationResponse<T> {
    data: T[];
    hasNextPage: boolean;
    totalCount?: number;
    nextCursor?: string;
}

// User-specific paginated response
export interface UsersResponse {
    users: User[];
    total: number;
    hasNextPage: boolean;
    nextCursor?: string;
}
