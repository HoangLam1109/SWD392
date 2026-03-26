import type { GamesPaginatedResponse } from "@/types/Game.types";
import { useQuery } from "@tanstack/react-query";
import { gameService } from "@/service/game.service";

export interface UseGetGamesPaginatedParams {
    cursor?: string;
    pageSize?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export const useGetGamesPaginated = ({
    cursor,
    pageSize = 10,
    search = "",
    sortBy,
    sortOrder,
}: UseGetGamesPaginatedParams = {}) => {
    return useQuery<GamesPaginatedResponse, Error>({
        queryKey: ["games", "paginated", cursor, pageSize, search, sortBy, sortOrder],
        queryFn: () =>
            gameService.getGamesPaginated({
                cursor,
                limit: pageSize,
                search,
                sortBy,
                sortOrder,
            }),
    });
};
