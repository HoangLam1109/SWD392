import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileService } from "@/service/profile.service";
import type { UpdateProfileDTO, Profile } from "@/types/Profile.types";
import { toast } from "sonner";

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();

    return useMutation<Profile, Error, UpdateProfileDTO>({
        mutationFn: (data: UpdateProfileDTO) => profileService.updateProfile(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile"] });
            queryClient.refetchQueries({ queryKey: ["profile", "me"] });
            toast.success("Profile updated successfully!");
        },
        onError: (error) => {
            toast.error(`Failed to update profile: ${error.message}`);
        },
    });
};
