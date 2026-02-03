import { authService } from "@/service/auth.service";
import type { RegisterPayload, RegisterResponse } from "@/types/Auth.types";
import { useMutation } from "@tanstack/react-query";

export const useRegister = () => {
    return useMutation<RegisterResponse, Error, RegisterPayload>({
        mutationFn: authService.register,
    });
}   