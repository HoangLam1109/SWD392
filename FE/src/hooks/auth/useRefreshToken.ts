import type { RefreshTokenResponse } from "@/types/Auth.types";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/service/auth.service";

export const useRefreshToken = () => {
    return useMutation<RefreshTokenResponse, Error>({
        mutationFn: authService.refreshToken,
    });
}