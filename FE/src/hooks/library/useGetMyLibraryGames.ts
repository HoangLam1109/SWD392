import { useGetCurrentUser } from '@/hooks/auth/useGetCurrentUser';
import { useGetLibraryGames } from '@/hooks/library/useGetLibraryGames';

export const useGetMyLibraryGames = () => {
    const currentUserQuery = useGetCurrentUser();
    const libraryGamesQuery = useGetLibraryGames(currentUserQuery.data?._id);

    return {
        ...libraryGamesQuery,
        currentUser: currentUserQuery.data,
        isLoading: currentUserQuery.isLoading || libraryGamesQuery.isLoading,
        isError: currentUserQuery.isError || libraryGamesQuery.isError,
        error: currentUserQuery.error ?? libraryGamesQuery.error,
    };
};
