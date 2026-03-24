import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export const useLogout = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem('token');
        queryClient.setQueryData(['currentUser'], null);
        queryClient.removeQueries({ queryKey: ['currentUser'] });
        navigate('/login', { replace: true });
    }
    return { logout };
}