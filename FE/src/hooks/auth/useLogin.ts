import { authService } from "@/service/auth.service";
import type { LoginPayload, LoginResponse } from "@/types/Auth.types";
import { useMutation } from "@tanstack/react-query";

export const useLogin = () => {
    return useMutation<LoginResponse, Error, LoginPayload>({
        mutationFn: authService.login,
    });
}