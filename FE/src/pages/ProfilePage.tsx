import { Navbar, Footer } from '@/components/home';
import {
    Settings,
    LogOut,
    Gamepad2,
    Trophy,
    Clock,
    Users,
    Calendar,
    ChevronRight,
    Star
} from 'lucide-react';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';

export default function ProfilePage() {
    const stats = [
        { label: 'Games Owned', value: '124', icon: Gamepad2, color: 'text-blue-400' },
        { label: 'Hours Played', value: '1,240', icon: Clock, color: 'text-purple-400' },
        { label: 'Achievements', value: '842', icon: Trophy, color: 'text-yellow-400' },
        { label: 'Friends', value: '42', icon: Users, color: 'text-emerald-400' },
    ];

    const recentGames = [
        {
            title: 'Cyberpunk 2077',
            lastPlayed: '2 hours ago',
            progress: 85,
            image: 'https://images.unsplash.com/photo-1605898960710-9aa877994792?q=80&w=400&auto=format&fit=crop',
        },
        {
            title: 'Elden Ring',
            lastPlayed: 'Yesterday',
            progress: 42,
            image: 'https://images.unsplash.com/photo-1612285329112-0a183e20e89d?q=80&w=400&auto=format&fit=crop',
        },
        {
            title: 'Destiny 2',
            lastPlayed: '3 days ago',
            progress: 100,
            image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=400&auto=format&fit=crop',
        }
    ];

    const activities = [
        { type: 'achievement', title: 'Legendary Finisher', game: 'Elden Ring', time: '5 hours ago' },
        { type: 'purchase', title: 'Baldur\'s Gate 3', game: 'Store', time: '1 day ago' },
        { type: 'friend', title: 'New friend added: ShadowRunner', game: 'Network', time: '2 days ago' },
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
            {/* Animated background gradient */}
            <div className="fixed inset-0 bg-linear-to-br from-blue-950/30 via-slate-950 to-purple-950/30 pointer-events-none" />
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)] pointer-events-none" />

            <Navbar />

            <main className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
                <div className="space-y-8 lg:space-y-12">

                    {/* Profile Header */}
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-linear-to-r from-blue-500/20 to-purple-600/20 rounded-3xl blur-3xl opacity-50 transition-opacity group-hover:opacity-70" />
                        <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-2xl overflow-hidden">
                            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                                {/* Avatar */}
                                <div className="relative">
                                    <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-50 animate-pulse" />
                                    <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-2xl border-2 border-white/20 overflow-hidden">
                                        <ImageWithFallback
                                            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop"
                                            alt="User Avatar"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-slate-900 shadow-lg" />
                                </div>

                                {/* User Info */}
                                <div className="flex-1 text-center lg:text-left space-y-4">
                                    <div className="space-y-1">
                                        <h1 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-white to-slate-400 bg-clip-text text-transparent">
                                            Alex "NexusPrime" Johnson
                                        </h1>
                                        <div className="flex items-center justify-center lg:justify-start gap-3 text-slate-400">
                                            <span className="flex items-center gap-1.5 text-sm sm:text-base">
                                                <Calendar className="w-4 h-4 text-blue-400" />
                                                Member since 2022
                                            </span>
                                            <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                                            <span className="text-sm sm:text-base font-medium text-blue-300">Pro Member</span>
                                        </div>
                                    </div>

                                    <p className="text-slate-400 text-sm sm:text-base max-w-2xl leading-relaxed">
                                        Passionate gamer and technology enthusiast. Currently tackling Elden Ring and exploring the cyberpunk neon streets. Always looking for new squads to join.
                                    </p>

                                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                                        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 transition-all text-sm font-medium shadow-lg shadow-blue-500/20">
                                            <Settings className="w-4 h-4" />
                                            Edit Profile
                                        </button>
                                        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-sm font-medium">
                                            <LogOut className="w-4 h-4 text-red-400" />
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {stats.map((stat) => (
                            <div key={stat.label} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 transition-transform hover:scale-105">
                                <div className="flex items-center justify-between mb-3 sm:mb-4">
                                    <div className={`p-2 sm:p-3 rounded-xl bg-white/5 ${stat.color}`}>
                                        <stat.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                                    </div>
                                    <Star className="w-4 h-4 text-white/10" />
                                </div>
                                <div className="text-2xl sm:text-3xl font-bold">{stat.value}</div>
                                <div className="text-xs sm:text-sm text-slate-500 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Main Content Sections */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">

                        {/* Library Section */}
                        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-3">
                                    <Gamepad2 className="w-6 h-6 text-blue-400" />
                                    Recent Library
                                </h2>
                                <button className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
                                    View All <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {recentGames.map((game) => (
                                    <div key={game.title} className="group relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 flex items-center gap-4 sm:gap-6 hover:bg-white/10 transition-all">
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border border-white/10">
                                            <img src={game.image} alt={game.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="font-bold sm:text-lg">{game.title}</div>
                                                <div className="text-xs text-slate-500">{game.lastPlayed}</div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <div className="flex items-center justify-between text-xs sm:text-sm">
                                                    <span className="text-slate-400">Completion</span>
                                                    <span className="font-medium text-blue-400">{game.progress}%</span>
                                                </div>
                                                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-linear-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-1000"
                                                        style={{ width: `${game.progress}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Activity Feed */}
                        <div className="space-y-6 sm:space-y-8">
                            <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-3">
                                <Star className="w-6 h-6 text-purple-400" />
                                Recent Activity
                            </h2>

                            <div className="space-y-6">
                                {activities.map((activity, idx) => (
                                    <div key={idx} className="relative pl-6 border-l-2 border-white/5 space-y-1">
                                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-900 border-2 border-purple-500" />
                                        <div className="text-sm font-bold text-slate-300">{activity.title}</div>
                                        <div className="text-xs text-slate-500 flex items-center gap-2">
                                            <span>{activity.game}</span>
                                            <div className="w-1 h-1 rounded-full bg-white/10" />
                                            <span>{activity.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Decorative Banner */}
                            <div className="relative mt-8 rounded-2xl overflow-hidden aspect-video">
                                <img
                                    src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=400&auto=format&fit=crop"
                                    className="w-full h-full object-cover"
                                    alt="Nexus"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-slate-950 to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4">
                                    <div className="text-xs font-bold text-blue-400 mb-1">RECOMMENDED</div>
                                    <div className="text-sm font-medium leading-tight">Join the new Community Challenge this weekend!</div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
