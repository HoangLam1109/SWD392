export interface LoginPayload{
    email: string;
    password: string;
}
export interface LoginResponse{
    accessToken: string;
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
    user: User;
}