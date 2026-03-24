export const UserAccountType = {
    PLAYER: 'player',
    MANAGER: 'manager',
    ADMIN: 'admin',
} as const;

export type UserAccountType = typeof UserAccountType[keyof typeof UserAccountType];

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    accountType: UserAccountType;
    primaryPhone: string;
    secondaryPhone: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateUserDTO {
    firstName: string;
    lastName: string;
    email: string;
    accountType: UserAccountType;
    primaryPhone?: string;
    secondaryPhone?: string;
}

export interface UpdateUserDTO {
    firstName?: string;
    lastName?: string;
    email?: string;
    accountType?: UserAccountType;
    primaryPhone?: string;
    secondaryPhone?: string;
}

export interface UsersResponse {
    users: User[];
    total: number;
    page: number;
    pageSize: number;
}
