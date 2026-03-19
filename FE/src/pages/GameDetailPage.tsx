import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Building2, ExternalLink, Cpu, HardDrive, ShoppingCart, Check } from 'lucide-react';
import { Navbar } from '@/components/home';
import { useGetGameById } from '@/hooks/game/useGetGamebyId';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { getImageUrl } from '@/lib/imageUtils';
import { Button } from '@/components/ui/button';
import { useGetSystemsByGameId } from '@/hooks/system/useGetSystemsByGameId';
import { useAddGameToCart } from '@/hooks/cart/useAddGameToCart';
import { useIsGameInCart } from '@/hooks/cart/useIsGameInCart';
import { useGetCategoryById } from '@/hooks/category/useGetCategories';

function formatPrice(price: number) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(price);
}

function formatDate(value: string | undefined): string {
    if (!value) return '—';
    try {
        const date = new Date(value);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    } catch {
        return String(value);
    }
}

export default function GameDetailPage() {
    const { gameId } = useParams<{ gameId: string }>();
    const { data: game, isLoading, error } = useGetGameById(gameId);
    const {
        data: systemRequirements = [],
        isLoading: isLoadingSystems,
        error: systemsError,
    } = useGetSystemsByGameId(gameId);

    const { data: category } = useGetCategoryById(game?.categoryId);
    
    // Cart functionality
    const { isInCart } = useIsGameInCart(gameId);
    const addToCartMutation = useAddGameToCart();

    const handleAddToCart = async () => {
        if (!gameId) return;
        
        try {
            await addToCartMutation.mutateAsync(gameId);
        } catch (error) {
            console.error('Failed to add game to cart:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-950 text-white">
                <div className="fixed inset-0 bg-linear-to-br from-blue-950/30 via-slate-950 to-purple-950/30 pointer-events-none" />
                <Navbar />
                <div className="relative w-full px-4 sm:px-6 lg:px-8 py-12">
                    <div className="h-8 w-48 bg-slate-800 rounded animate-pulse mb-8" />
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="aspect-video bg-slate-800 rounded-2xl animate-pulse" />
                        <div className="lg:col-span-2 space-y-4">
                            <div className="h-10 bg-slate-800 rounded animate-pulse w-3/4" />
                            <div className="h-6 bg-slate-800 rounded animate-pulse w-1/2" />
                            <div className="h-32 bg-slate-800 rounded animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !game) {
        return (
            <div className="min-h-screen bg-slate-950 text-white">
                <div className="fixed inset-0 bg-linear-to-br from-blue-950/30 via-slate-950 to-purple-950/30 pointer-events-none" />
                <Navbar />
                <div className="relative w-full px-4 sm:px-6 lg:px-8 py-12">
                    <Link
                        to="/store"
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Store
                    </Link>
                    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
                        <h2 className="text-xl font-semibold mb-2">Game not found</h2>
                        <p className="text-slate-400 mb-6">
                            {error?.message ?? 'This game may have been removed or the link is invalid.'}
                        </p>
                        <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
                            <Link to="/store">Back to Store</Link>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const coverImageUrl = getImageUrl(game.coverImage) || '';
    const thumbnailUrl = getImageUrl(game.thumbnail) || '';
    const cardImageUrl = thumbnailUrl || coverImageUrl;
    const finalPrice = game.discount != null && game.discount > 0
        ? game.price * (1 - game.discount / 100)
        : game.price;

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <div className="fixed inset-0 bg-linear-to-br from-blue-950/30 via-slate-950 to-purple-950/30 pointer-events-none" />
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)] pointer-events-none" />

            <Navbar />

            <div className="relative w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <Link
                    to="/store"
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Store
                </Link>

                {/* Cover image banner - ưu tiên coverImage */}
                {coverImageUrl ? (
                    <div className="relative w-full aspect-[21/9] sm:aspect-[3/1] rounded-2xl overflow-hidden border border-white/10 bg-slate-900/50 mb-8">
                        <ImageWithFallback
                            src={coverImageUrl}
                            alt={`${game.title} cover`}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
                    </div>
                ) : null}

                <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
                    {/* Thumbnail / ảnh phụ (khi có coverImage thì dùng thumbnail ở đây) */}
                    <div className="lg:col-span-1">
                        <div className="aspect-video rounded-2xl overflow-hidden border border-white/10 bg-slate-900/50">
                            {cardImageUrl ? (
                                <ImageWithFallback
                                    src={cardImageUrl}
                                    alt={game.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-500">
                                    No image
                                </div>
                            )}
                        </div>
                        {game.discount != null && game.discount > 0 && (
                            <div className="mt-3 inline-block bg-red-500/90 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                -{game.discount}% off
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-linear-to-r from-white to-slate-300 bg-clip-text text-transparent">
                                {game.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-3">
                                {category?.categoryName && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-100">
                                        {category.categoryName}
                                    </span>
                                )}
                                <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                                        game.isActive
                                            ? 'bg-emerald-500/20 text-emerald-400'
                                            : 'bg-slate-500/20 text-slate-400'
                                    }`}
                                >
                                    {game.isActive ? 'Available' : 'Unavailable'}
                                </span>
                                {game.releaseDate && (
                                    <span className="flex items-center gap-1.5 text-slate-400 text-sm">
                                        <Calendar className="h-4 w-4" />
                                        {formatDate(game.releaseDate)}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-3 flex-wrap">
                            {game.discount != null && game.discount > 0 && (
                                <span className="text-slate-500 line-through text-lg">
                                    {formatPrice(game.price)}
                                </span>
                            )}
                            <span className="text-2xl font-bold text-white">
                                {game.price === 0 ? 'Free' : formatPrice(finalPrice)}
                            </span>
                            {game.discount != null && game.discount > 0 && (
                                <span className="text-slate-400 text-sm">({game.discount}% off)</span>
                            )}
                        </div>

                        {/* Description */}
                        {game.description && (
                            <div>
                                <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-2">
                                    About
                                </h2>
                                <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                                    {game.description}
                                </p>
                            </div>
                        )}

                        {/* Meta */}
                        <div className="grid sm:grid-cols-2 gap-4 pt-2">
                            {game.developer && (
                                <div className="flex items-start gap-3">
                                    <Building2 className="h-5 w-5 text-slate-500 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Developer
                                        </p>
                                        <p className="text-slate-300">{game.developer}</p>
                                    </div>
                                </div>
                            )}
                            {game.publisher && (
                                <div className="flex items-start gap-3">
                                    <Building2 className="h-5 w-5 text-slate-500 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Publisher
                                        </p>
                                        <p className="text-slate-300">{game.publisher}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Game URL */}
                        {game.url && (
                            <a
                                href={game.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm"
                            >
                                <ExternalLink className="h-4 w-4" />
                                Official link
                            </a>
                        )}

                        {/* CTA */}
                        <div className="pt-4">
                            <Button
                                size="lg"
                                onClick={handleAddToCart}
                                disabled={addToCartMutation.isPending || isInCart}
                                className="bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {addToCartMutation.isPending ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                        Adding...
                                    </>
                                ) : isInCart ? (
                                    <>
                                        <Check className="w-5 h-5 mr-2" />
                                        Added to Cart
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart className="w-5 h-5 mr-2" />
                                        Add to Cart
                                    </>
                                )}
                            </Button>
                            {addToCartMutation.isError && (
                                <p className="text-red-400 text-sm mt-2">
                                    {addToCartMutation.error instanceof Error 
                                        ? addToCartMutation.error.message 
                                        : 'Failed to add game to cart. Please try again.'}
                                </p>
                            )}
                            {isInCart && (
                                <Link
                                    to="/cart"
                                    className="inline-block mt-3 text-blue-400 hover:text-blue-300 transition-colors text-sm"
                                >
                                    View Cart →
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* System requirements */}
                <div className="mt-10">
                    <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                        <Cpu className="h-5 w-5 text-slate-400" />
                        System Requirements
                    </h2>

                    {isLoadingSystems ? (
                        <p className="text-sm text-slate-400">Loading system requirements...</p>
                    ) : systemsError ? (
                        <p className="text-sm text-red-400">Failed to load system requirements.</p>
                    ) : Array.isArray(systemRequirements) && systemRequirements.length > 0 ? (
                        <div className="grid md:grid-cols-2 gap-4">
                            {systemRequirements.map((sys) => (
                                <div
                                    key={(sys as any).id ?? (sys as any)._id ?? `${sys.gameId}-${sys.requirementType}`}
                                    className="border border-white/10 rounded-xl bg-slate-900/60 p-4 space-y-2"
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-xs font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-slate-800 text-slate-100">
                                            {sys.requirementType}
                                        </span>
                                        <span className="text-xs text-slate-400 truncate max-w-[60%]">
                                            {sys.os}
                                        </span>
                                    </div>
                                    <div className="space-y-1 text-xs text-slate-300">
                                        <div className="flex items-center gap-2">
                                            <Cpu className="h-3 w-3 text-slate-400" />
                                            <span className="font-medium">CPU:</span>
                                            <span className="text-slate-200">{sys.processor}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="inline-flex h-3 w-3 rounded-full bg-emerald-400/80" />
                                            <span className="font-medium">RAM:</span>
                                            <span className="text-slate-200">{sys.memory}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="inline-flex h-3 w-3 rounded-full bg-indigo-400/80" />
                                            <span className="font-medium">GPU:</span>
                                            <span className="text-slate-200">{sys.graphics}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <HardDrive className="h-3 w-3 text-slate-400" />
                                            <span className="font-medium">Storage:</span>
                                            <span className="text-slate-200">{sys.storage}</span>
                                        </div>
                                        {sys.additionalNotes && (
                                            <p className="pt-1 text-[11px] text-slate-400">
                                                {sys.additionalNotes}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-slate-400">
                            System requirements have not been provided for this game yet.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
