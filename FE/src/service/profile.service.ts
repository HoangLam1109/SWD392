import apiClient from "@/lib/apiClient";
import type { Profile, CreateProfileDTO, UpdateProfileDTO } from "@/types/Profile.types";

export const profileService = {
    getMyProfile: async (): Promise<Profile> => {
        const response = await apiClient.get('/profiles/me');
        const body = response.data as any;
        return (body?.data ?? body) as Profile;
    },

    getProfileByUserId: async (userId: string): Promise<Profile> => {
        const response = await apiClient.get(`/profiles/user/${userId}`);
        const body = response.data as any;
        return (body?.data ?? body) as Profile;
    },

    createProfile: async (data: CreateProfileDTO): Promise<Profile> => {
        const response = await apiClient.post('/profiles', data);
        const body = response.data as any;
        return (body?.data ?? body) as Profile;
    },

    updateProfile: async (userId: string, data: UpdateProfileDTO): Promise<Profile> => {
        const response = await apiClient.patch(`/profiles/user/${userId}`, data);
        const body = response.data as any;
        return (body?.data ?? body) as Profile;
    },
};
