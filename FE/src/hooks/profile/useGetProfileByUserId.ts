import { useQuery } from "@tanstack/react-query";
import { profileService } from "@/service/profile.service";
import type { Profile } from "@/types/Profile.types";

export const useGetProfileByUserId = (userId: string | undefined) => {
    return useQuery<Profile, Error>({
        queryKey: ["profile", userId],
        queryFn: () => profileService.getProfileByUserId(userId!),
        enabled: !!userId,
    });
};
