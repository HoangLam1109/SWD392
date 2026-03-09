import { systemService } from "@/service/system.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { System } from "@/types/System.types";
import { toast } from "sonner";

export const useCreateSystem = () => {
    const queryClient = useQueryClient();
    return useMutation<System, Error, System>({
        mutationFn: systemService.createSystem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['system-requirements'] });
            toast.success('System requirement created successfully');
        },
        onError: (error) => {
            console.error('Error creating system requirement:', error);
            toast.error('Error creating system requirement');
        },
    });
}   