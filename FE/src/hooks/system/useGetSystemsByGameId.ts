import { useQuery } from "@tanstack/react-query";
import { systemService } from "@/service/system.service";
import type { System } from "@/types/System.types";

export const useGetSystemsByGameId = (gameId: string | undefined) => {
    return useQuery<System[], Error>({
        queryKey: ["system-requirements", "game", gameId],
        queryFn: () => systemService.getSystemsByGameId(gameId!),
        enabled: !!gameId,
    });
};

