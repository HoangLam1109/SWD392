import type { User } from "@/types/User.types";
import { useQuery } from "@tanstack/react-query";
import { userService } from "@/service/user.service";

export const useGetUserById = (id: string, enabled = true) => {
    return useQuery<User | null, Error>({
        queryKey: ['user', id],
        queryFn: () => userService.getUserById(id),
        enabled: !!id && enabled,
    });
};
