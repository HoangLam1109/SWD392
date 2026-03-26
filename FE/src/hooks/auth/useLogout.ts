import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export const useLogout = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('token_time');
        localStorage.removeItem('auth_user');
        queryClient.removeQueries({ queryKey: ['myCart'] });
        queryClient.removeQueries({ queryKey: ['myCart', 'withItems'] });
        queryClient.removeQueries({ queryKey: ['carts'] });
        queryClient.removeQueries({ queryKey: ['cart'] });
        queryClient.setQueryData(['currentUser'], null);
        queryClient.removeQueries({ queryKey: ['currentUser'] });
        navigate('/login', { replace: true });
    }
    return { logout };
}