import type { Game } from "@/types/Game.types";
import { GameCard } from "./GameCard";
import { useGetGames } from "@/hooks/game/useGetGames";

type GameListProps = {
    games?: Game[];
    isLoading?: boolean;
    error?: Error | null;
    /** Game IDs the user already owns (library status OWNED) — hide/disable add to cart */
    ownedGameIds?: Set<string>;
};

export function GameList({
    games: externalGames,
    isLoading: externalLoading,
    error: externalError,
    ownedGameIds,
}: GameListProps = {}) {
    const shouldFetch = externalGames === undefined;
    const { data: fetchedGames, isLoading: fetchedLoading, error: fetchedError } = useGetGames();
    const games = shouldFetch ? (fetchedGames ?? []) : externalGames;
    const isLoading = shouldFetch ? fetchedLoading : (externalLoading ?? false);
    const error = shouldFetch ? fetchedError : (externalError ?? null);
    if (isLoading) {
        return (
          <div className="grid grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-80 bg-slate-800 animate-pulse rounded-xl" />
            ))}
          </div>
        );
      }
    if (error) {
        return (
          <div className="text-center py-16">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-12">
              <h3 className="text-xl font-semibold mb-2">Error: {error.message}</h3>
              <p className="text-slate-400">Please try again later.</p>
            </div>
          </div>
        );
      }
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {games?.map((game) => (
                <GameCard
                    key={game._id}
                    game={game}
                    isOwned={Boolean(ownedGameIds?.has(game._id))}
                />
            ))}
        </div>
    );
}