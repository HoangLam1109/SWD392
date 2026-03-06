export interface LoginPayload{
    email: string;
    password: string;
}
export interface LoginResponse{
    accessToken: string;
    refreshToken: string;
    user: User;
}
export interface User{
    id: string;
    email: string;
    fullName: string;
    avatar: string;
    role: string; 
    status: string; 
    createdAt: string;
    updatedAt: string;
}
export interface RegisterPayload{
    email: string;
    fullName: string;
    password: string;
}
export interface RegisterResponse{
    accessToken: string;
    refreshToken: string;
    user: User;
}
export interface CurrentUserResponse{
    _id?: string;
    email: string;
    fullName: string;
    role: string;
    status: string;
    avatar: string;
    createdAt: string;
    updatedAt: string;
}
export interface RefreshTokenResponse{
    refreshToken: string;
    accessToken: string;
    user: User;
}