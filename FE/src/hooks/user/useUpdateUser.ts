import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/service/user.service";
import { toast } from "sonner";
import type { User, UpdateUserDTO } from "@/types/User.types";

export const useUpdateUser = () => {
    const queryClient = useQueryClient();

    return useMutation<User | null, Error, { id: string; data: UpdateUserDTO }>({
        mutationFn: ({ id, data }) => userService.updateUser(id, data),
        onSuccess: (updatedUser) => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            if (updatedUser) {
                const userId = updatedUser._id || updatedUser.id;
                if (userId) {
                    queryClient.setQueryData(['user', userId], updatedUser);
                }
            }
            toast.success("User updated successfully");
        },
        onError: (error) => {
            console.error('Error updating user:', error);
            toast.error("Failed to update user");
        }
    });
};
