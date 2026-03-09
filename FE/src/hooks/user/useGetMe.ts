import type { User } from "@/types/User.types";
import { useQuery } from "@tanstack/react-query";
import { userService } from "@/service/user.service";

export const useGetMe = (enabled = true) => {
    return useQuery<User, Error>({
        queryKey: ['user', 'me'],
        queryFn: userService.getMe,
        enabled,
    });
};
