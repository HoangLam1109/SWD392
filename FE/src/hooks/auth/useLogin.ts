import { authService } from "@/service/auth.service";
import type { LoginPayload, LoginResponse } from "@/types/Auth.types";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
export const useLogin = () => {
    const queryClient = useQueryClient();
    return useMutation<LoginResponse, Error, LoginPayload>({
        mutationFn: authService.login,
        onSuccess: (data) => {
            localStorage.setItem("token", data.accessToken);
            queryClient.invalidateQueries({ queryKey: ["currentUser"] });
            queryClient.setQueryData(["currentUser"], data.user);
        },
    });
}