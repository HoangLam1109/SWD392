import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileService } from "@/service/profile.service";
import type { UpdateProfileDTO, Profile } from "@/types/Profile.types";
import { toast } from "sonner";

export const useUpdateProfile = (userId: string | undefined) => {
    const queryClient = useQueryClient();

    return useMutation<Profile, Error, UpdateProfileDTO>({
        mutationFn: (data: UpdateProfileDTO) => profileService.updateProfile(userId!, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile", userId] });
            toast.success("Profile updated successfully!");
        },
        onError: (error) => {
            toast.error(`Failed to update profile: ${error.message}`);
        },
    });
};
