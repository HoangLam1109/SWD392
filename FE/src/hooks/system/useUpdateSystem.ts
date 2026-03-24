import { useMutation, useQueryClient } from "@tanstack/react-query";
import { systemService } from "@/service/system.service";
import type { System } from "@/types/System.types";
import { toast } from "sonner";

export const useUpdateSystem = () => {
    const queryClient = useQueryClient();

    return useMutation<System, Error, { id: string; data: System }>({
        mutationFn: ({ id, data }) => systemService.updateSystem(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["system-requirements"] });
            toast.success("System requirement updated successfully");
        },
        onError: (error) => {
            console.error("Error updating system requirement:", error);
            toast.error("Error updating system requirement");
        },
    });
};

