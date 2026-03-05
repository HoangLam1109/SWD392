import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileService } from "@/service/profile.service";
import type { CreateProfileDTO, Profile } from "@/types/Profile.types";
import { toast } from "sonner";

export const useCreateProfile = () => {
    const queryClient = useQueryClient();

    return useMutation<Profile, Error, CreateProfileDTO>({
        mutationFn: (data: CreateProfileDTO) => profileService.createProfile(data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["profile", data.userId] });
            toast.success("Profile created successfully!");
        },
        onError: (error) => {
            toast.error(`Failed to create profile: ${error.message}`);
        },
    });
};
