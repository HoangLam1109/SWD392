export const UserRole = {
    PLAYER: 'Player',
    MANAGER: 'Moderator',
    ADMIN: 'Admin',
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export const UserStatus = {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
} as const;

export type UserStatus = typeof UserStatus[keyof typeof UserStatus];

// Keep legacy type for backward compatibility
export type UserAccountType = UserRole;

export interface User {
    _id?: string; // MongoDB ID
    id?: string;  // Alternative ID
    email: string;
    fullName: string;
    role: UserRole;
    avatar?: string;
    status: UserStatus;
    createdAt: string;
    updatedAt: string;
}

export interface CreateUserDTO {
    email: string;
    fullName: string;
    password: string;
    role: UserRole;
    avatar?: string;
    status: UserStatus;
}

export interface UpdateUserDTO {
    email?: string;
    fullName?: string;
    password?: string;
    role?: UserRole;
    avatar?: string;
    status?: UserStatus;
}

export interface UsersResponse {
    data: User[];
    hasNextPage: boolean;
    totalCount?: number;
    nextCursor?: string;
}
