import { useQuery } from '@tanstack/react-query';
import { libraryGameService } from '@/service/library-game.service';
import type { LibraryGameRecord } from '@/types/LibraryGame.types';

export const useGetLeaderboardHighestScore = (params?: {
    gameId?: string;
    limit?: number;
}) => {
    return useQuery<LibraryGameRecord[], Error>({
        queryKey: ['library-game', 'leaderboard', 'highest-score', params],
        queryFn: () => libraryGameService.getLeaderboardHighestScore(params),
    });
};

export const useGetUserHighestScore = () => {
    return useQuery<LibraryGameRecord, Error>({
        queryKey: ['library-game', 'user', 'highest-score'],
        queryFn: () => libraryGameService.getHighestScoreByUser(),
    });
}

