import type { UsersResponse, UserRole } from "@/types/User.types";
import { useQuery } from "@tanstack/react-query";
import { userService } from "@/service/user.service";

interface UseGetUsersParams {
    cursor?: string;
    pageSize?: number;
    search?: string;
    accountTypeFilter?: UserRole;
}

export const useGetUsers = ({ 
    cursor,
    pageSize = 10, 
    search = '', 
    accountTypeFilter 
}: UseGetUsersParams = {}) => {
    return useQuery<UsersResponse, Error>({
        queryKey: ['users', cursor, pageSize, search, accountTypeFilter],
        queryFn: () => userService.getUsers(cursor, pageSize, search, accountTypeFilter),
    });
};
