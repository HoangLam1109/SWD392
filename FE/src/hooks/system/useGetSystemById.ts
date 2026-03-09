import { useQuery } from "@tanstack/react-query";
import { systemService } from "@/service/system.service";
import type { System } from "@/types/System.types";

export const useGetSystemById = (id: string | undefined) => {
    return useQuery<System, Error>({
        queryKey: ["system-requirement", id],
        queryFn: () => systemService.getSystemById(id!),
        enabled: !!id,
    });
};

