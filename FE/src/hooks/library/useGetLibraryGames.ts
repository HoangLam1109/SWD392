import { useQuery } from '@tanstack/react-query';
import { libraryGameService } from '@/service/library-game.service';
import type { LibraryGameView } from '@/types/LibraryGame.types';

export const useGetLibraryGames = (userId?: string) => {
    return useQuery<LibraryGameView[], Error>({
        queryKey: ['library-games', userId],
        queryFn: () => libraryGameService.getMyLibraryGames(userId!),
        enabled: Boolean(userId),
    });
};
