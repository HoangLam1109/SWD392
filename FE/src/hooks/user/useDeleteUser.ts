import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/service/user.service";
import { toast } from "sonner";

export const useDeleteUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => userService.deleteUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success('User deleted successfully');  
        },
        onError: (error) => {
            console.error('Error deleting user:', error);
            toast.error('Error deleting user: ' + error.message);
        },
    });
};
