import apiClient from '@/lib/apiClient';
import type {
    LibraryGameApiGame,
    LibraryGameQueryParams,
    LibraryGamesResponse,
    LibraryGameRecord,
    LibraryGameView,
} from '@/types/LibraryGame.types';

const DEFAULT_LIBRARY_LIMIT = 100;
const DEFAULT_GAMES_LIMIT = 500;
const FALLBACK_GENRE = 'Uncategorized';

const getGameId = (game: LibraryGameApiGame): string => game._id ?? game.id ?? '';

const normalizeGames = (
    body: { data?: LibraryGameApiGame[] } | LibraryGameApiGame[]
): LibraryGameApiGame[] => {
    return Array.isArray(body) ? body : (body.data ?? []);
};

const mapLibraryGameToView = (
    libraryGame: LibraryGameRecord,
    game?: LibraryGameApiGame
): LibraryGameView => {
    const gameId = game ? getGameId(game) : libraryGame.game_id;

    return {
        id: gameId || libraryGame._id,
        libraryGameId: libraryGame._id,
        gameId: gameId || libraryGame.game_id,
        title: game?.title ?? 'Unknown game',
        genre: game?.categoryId ?? FALLBACK_GENRE,
        thumbnail: game?.thumbnail,
        description: game?.description,
        developer: game?.developer,
        publisher: game?.publisher,
        releaseDate: game?.releaseDate,
        url: game?.url,
        price: game?.price,
        discount: game?.discount,
        isActive: game?.isActive,
        status: libraryGame.status,
        highestScore: libraryGame.highest_score,
        totalPlaytime: libraryGame.total_playtime,
        lastPlayedAt: libraryGame.last_played_at,
        acquiredAt: libraryGame.acquired_at,
    };
};

export const libraryGameService = {
    async getLibraryGames(
        params: LibraryGameQueryParams = {}
    ): Promise<LibraryGamesResponse> {
        const response = await apiClient.get('/library-game', {
            params: {
                limit: params.limit ?? DEFAULT_LIBRARY_LIMIT,
                sortBy: params.sortBy ?? 'acquired_at',
                sortOrder: params.sortOrder ?? 'desc',
                ...(params.cursor ? { cursor: params.cursor } : {}),
                ...(params.userId ? { user_id: params.userId } : {}),
            },
        });

        const body = response.data as Partial<LibraryGamesResponse>;

        return {
            data: body.data ?? [],
            hasNextPage: body.hasNextPage ?? false,
            totalCount: body.totalCount,
            nextCursor: body.nextCursor,
        };
    },

    async getMyLibraryGames(userId: string): Promise<LibraryGameView[]> {
        const [libraryResponse, gamesResponse] = await Promise.all([
            this.getLibraryGames({ userId }),
            apiClient.get('/games', {
                params: {
                    limit: DEFAULT_GAMES_LIMIT,
                    sortBy: 'title',
                    sortOrder: 'asc',
                },
            }),
        ]);

        const games = normalizeGames(
            gamesResponse.data as { data?: LibraryGameApiGame[] } | LibraryGameApiGame[]
        );
        const gamesById = new Map(
            games
                .map((game) => [getGameId(game), game] as const)
                .filter(([id]) => Boolean(id))
        );

        return libraryResponse.data.map((libraryGame) =>
            mapLibraryGameToView(libraryGame, gamesById.get(libraryGame.game_id))
        );
    },
};
