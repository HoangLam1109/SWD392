import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "../ui/image-with-fallback";
import { useGetGames } from "@/hooks/game/useGetGames";
import { getImageUrl } from "@/lib/imageUtils";
import { Skeleton } from "@/components/ui/skeleton";

const TOP_COUNT = 10;

function formatPriceVnd(price: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);
}

export function GamesSection() {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: games = [], isLoading, isError } = useGetGames({
    limit: TOP_COUNT,
    sortBy: "releaseDate",
    sortOrder: "desc",
  });

  const list = games.slice(0, TOP_COUNT);

  const scrollStepPx = () => {
    const el = scrollRef.current;
    if (!el) return 320;
    return Math.min(320, el.clientWidth * 0.85);
  };

  const scrollNext = () => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: scrollStepPx(), behavior: "smooth" });
  };

  const scrollPrev = () => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: -scrollStepPx(), behavior: "smooth" });
  };

  return (
    <section className="relative py-10 sm:py-14 lg:py-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight">
            {t("home.games.topNewestTitle")}
          </h2>
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={scrollPrev}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white hover:bg-white/10 transition-colors"
              aria-label={t("home.games.scrollPrev")}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white hover:bg-white/10 transition-colors"
              aria-label={t("home.games.scrollNext")}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scroll-pl-4 sm:scroll-pl-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {isLoading &&
              Array.from({ length: TOP_COUNT }).map((_, i) => (
                <div
                  key={`sk-${i}`}
                  className="shrink-0 w-[148px] sm:w-[168px] snap-start"
                >
                  <Skeleton className="aspect-[2/3] w-full rounded-2xl bg-white/10" />
                  <Skeleton className="h-4 w-full mt-3 bg-white/10" />
                  <Skeleton className="h-3 w-2/3 mt-2 bg-white/10" />
                </div>
              ))}

            {!isLoading && isError && (
              <p className="text-slate-400 text-sm py-8">{t("home.games.loadError")}</p>
            )}

            {!isLoading &&
              !isError &&
              list.map((game, index) => {
                const rank = index + 1;
                const imageUrl =
                  getImageUrl(game.thumbnail) || getImageUrl(game.coverImage) || "";
                const subtitle = game.developer?.trim() || game.publisher?.trim() || "—";
                const releaseLabel = game.releaseDate
                  ? new Date(game.releaseDate).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : "—";
                const discount = game.discount && game.discount > 0 ? Math.round(game.discount) : null;

                return (
                  <Link
                    key={game._id}
                    to={`/store/${game._id}`}
                    draggable={false}
                    className="group shrink-0 w-[148px] sm:w-[168px] snap-start touch-pan-x select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-2xl"
                  >
                    <div className="relative">
                      <div className="relative aspect-[2/3] overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-lg">
                        {imageUrl ? (
                          <ImageWithFallback
                            src={imageUrl}
                            alt={game.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-slate-800 text-slate-500 text-xs">
                            —
                          </div>
                        )}
                        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/85 to-transparent pointer-events-none" />
                        <div className="absolute bottom-2 right-2 flex flex-wrap justify-end gap-1">
                          {discount != null ? (
                            <span className="rounded-md bg-emerald-600/95 px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm">
                              -{discount}%
                            </span>
                          ) : null}
                          <span className="rounded-md bg-black/65 px-2 py-0.5 text-[10px] font-medium text-white/95 backdrop-blur-sm">
                            {formatPriceVnd(game.price)}
                          </span>
                        </div>
                      </div>

                      <span
                        className="absolute -bottom-1 left-0 z-10 translate-y-1/4 font-black leading-[0.85] text-[4.5rem] sm:text-[5rem] text-white select-none pointer-events-none"
                        style={{
                          textShadow:
                            "0 4px 24px rgba(0,0,0,0.9), 0 0 2px rgba(0,0,0,1), -1px -1px 0 rgba(0,0,0,0.5)",
                        }}
                        aria-hidden
                      >
                        {rank}
                      </span>
                    </div>

                    <div className="relative z-20 mt-10 pl-0.5 pr-1">
                      <h3 className="text-sm font-bold text-white leading-snug line-clamp-2 group-hover:text-blue-200 transition-colors">
                        {game.title}
                      </h3>
                      <p className="mt-1 text-xs text-slate-400 line-clamp-1">{subtitle}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[10px] text-slate-500">
                        <span>{releaseLabel}</span>
                        {game.isActive ? (
                          <>
                            <span aria-hidden>·</span>
                            <span>{t("home.games.tagAvailable")}</span>
                          </>
                        ) : null}
                      </div>
                    </div>
                  </Link>
                );
              })}
          </div>

          <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-linear-to-l from-slate-950 to-transparent sm:w-16" />
        </div>
      </div>
    </section>
  );
}
