import type { CurrentUserResponse } from "@/types/Auth.types";
import { useQuery } from "@tanstack/react-query";
import { authService } from "@/service/auth.service";
export const useGetCurrentUser = () => {
    return useQuery<CurrentUserResponse, Error>({
        queryKey: ['currentUser'],
        queryFn: authService.getCurrentUser,
        enabled: !!localStorage.getItem('token'),
    });
}