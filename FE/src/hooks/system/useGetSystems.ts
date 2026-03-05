import { useQuery } from "@tanstack/react-query";
import { systemService } from "@/service/system.service";
import type { System } from "@/types/System.types";

export const useGetSystems = () => {
    return useQuery<System[], Error>({
        queryKey: ["system-requirements"],
        queryFn: systemService.getSystems,
    });
};

