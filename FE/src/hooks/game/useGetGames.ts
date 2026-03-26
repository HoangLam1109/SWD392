import type { Game } from "@/types/Game.types";
import { useQuery } from "@tanstack/react-query";
import { gameService } from "@/service/game.service";

/** Không truyền gì → toàn bộ catalog (limit cao). Truyền limit/sort → một trang API có phân trang. */
export type UseGetGamesParams = {
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
};

export const useGetGames = (params?: UseGetGamesParams) => {
    const hasQuery =
        params != null &&
        (params.limit !== undefined ||
            params.sortBy !== undefined ||
            params.sortOrder !== undefined);

    return useQuery<Game[], Error>({
        queryKey: hasQuery
            ? ["games", "query", params!.limit, params!.sortBy, params!.sortOrder]
            : ["games", "catalog"],
        queryFn: async () => {
            if (!hasQuery) {
                return gameService.getGames();
            }
            const res = await gameService.getGamesPaginated({
                limit: params!.limit ?? 10,
                sortBy: params!.sortBy,
                sortOrder: params!.sortOrder,
            });
            return res.data;
        },
    });
};