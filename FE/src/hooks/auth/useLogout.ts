import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export const useLogout = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('token_time');
        localStorage.removeItem('auth_user');
        queryClient.setQueryData(['currentUser'], null);
        queryClient.removeQueries({ queryKey: ['currentUser'] });
        navigate('/login', { replace: true });
    }
    return { logout };
}