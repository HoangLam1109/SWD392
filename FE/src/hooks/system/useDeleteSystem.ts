import { useMutation, useQueryClient } from "@tanstack/react-query";
import { systemService } from "@/service/system.service";
import { toast } from "sonner";

export const useDeleteSystem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => systemService.deleteSystem(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["system-requirements"] });
            toast.success("System requirement deleted successfully");
        },
        onError: (error: any) => {
            console.error("Error deleting system requirement:", error);
            toast.error("Error deleting system requirement");
        },
    });
};

