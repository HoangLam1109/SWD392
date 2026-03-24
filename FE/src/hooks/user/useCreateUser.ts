import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/service/user.service";
import { toast } from "sonner";
import type { User, CreateUserDTO } from "@/types/User.types";
import { AxiosError } from "axios";

export const useCreateUser = () => {
    const queryClient = useQueryClient();

    return useMutation<User, Error, CreateUserDTO>({
        mutationFn: userService.createUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success('User created successfully');
        },
        onError: (error) => {
            console.error('Error creating user:', error);
            
            // Extract error message from backend response
            if (error instanceof AxiosError) {
                const backendMessage = error.response?.data?.message;
                const statusCode = error.response?.status;
                
                if (Array.isArray(backendMessage)) {
                    // Validation errors
                    toast.error(`Validation Error: ${backendMessage.join(', ')}`);
                } else if (backendMessage) {
                    toast.error(`Error: ${backendMessage}`);
                } else {
                    toast.error(`Error ${statusCode}: Failed to create user`);
                }
            } else {
                toast.error('Error creating user');
            }
        },
    });
};
