import { useQuery } from "@tanstack/react-query";
import { profileService } from "@/service/profile.service";

export const useGetMyProfile = () => {
    return useQuery({
        queryKey: ["profile", "me"],
        queryFn: () => profileService.getMyProfile(),
    });
};
