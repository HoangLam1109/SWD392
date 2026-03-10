import { motion } from 'framer-motion';
import {
    Trophy,
    Gamepad2,
    TrendingUp,
    Search,
    Filter,
    PlusCircle,
    MessageCircle,
    ThumbsUp,
    Share2,
    Calendar,
    ChevronRight,
    Loader2
} from 'lucide-react';
import { Navbar, Footer } from '@/components/home';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useBlogs } from '@/hooks/useBlogs';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom = 0) => ({
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            delay: custom * 0.1,
            ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]
        }
    })
};


const mockGroups = [
    { name: 'RPG Enthusiasts', members: '12.4k', icon: Gamepad2, color: 'text-blue-400' },
    { name: 'Competitive League', members: '45.2k', icon: Trophy, color: 'text-purple-400' },
    { name: 'Hardware Geeks', members: '8.1k', icon: TrendingUp, color: 'text-emerald-400' },
    { name: 'Speedrunners', members: '3.5k', icon: Calendar, color: 'text-orange-400' }
];

export default function CommunityPage() {
    const { blogs, isLoading, error } = useBlogs();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500/30">
            {/* Background elements */}
            <div className="fixed inset-0 bg-linear-to-br from-blue-950/20 via-slate-950 to-purple-950/20 pointer-events-none" />
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.1),transparent_50%)] pointer-events-none" />

            <Navbar />

            <main className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Hero Header */}
                <motion.div
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                    className="mb-12"
                >
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
                        Gamers <span className="bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Community</span>
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl">
                        Connect, compete, and share your gaming journey with millions of players worldwide.
                        Join discussions, discover groups, and stay updated.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Control Bar */}
                        <motion.div
                            variants={sectionVariants}
                            initial="hidden"
                            animate="visible"
                            custom={1}
                            className="flex flex-wrap items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xl"
                        >
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="text"
                                    placeholder="Search discussions..."
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-hidden focus:ring-2 ring-blue-500/50"
                                />
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2 bg-slate-900/50 border border-white/10 rounded-xl text-sm hover:bg-white/10 transition-colors">
                                <Filter className="w-4 h-4" />
                                Filter
                            </button>
                            <button onClick={() => navigate('/new-post')} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-blue-600/20">
                                <PlusCircle className="w-4 h-4" />
                                New Post
                            </button>
                        </motion.div>

                        {/* Discussion List */}
                        <div className="space-y-4">
                            <motion.h2
                                variants={sectionVariants}
                                initial="hidden"
                                animate="visible"
                                custom={2}
                                className="text-xl font-bold flex items-center gap-2"
                            >
                                <TrendingUp className="w-5 h-5 text-blue-400" />
                                Trending Blogs
                            </motion.h2>

                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center py-12 gap-4">
                                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                                    <p className="text-slate-400">Loading blogs...</p>
                                </div>
                            ) : error ? (
                                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center">
                                    <p className="text-red-400">{error}</p>
                                </div>
                            ) : blogs.length === 0 ? (
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
                                    <p className="text-slate-400">No blogs found.</p>
                                </div>
                            ) : (
                                blogs.filter((blog) => blog.status === "APPROVED").map((blog, idx) => (
                                    <motion.div
                                        key={blog._id}
                                        onClick={() => navigate(`/blogs/${blog._id}`)}
                                        style={{ cursor: 'pointer', border: "1px solid gray", margin: "10px" }}
                                        variants={sectionVariants}
                                        initial="hidden"
                                        animate="visible"
                                        custom={idx + 3}
                                        className="group bg-white/5 border border-white/10 hover:border-blue-500/50 rounded-2xl overflow-hidden backdrop-blur-xl transition-all duration-300 cursor-pointer"
                                    >
                                        <div className="flex flex-col md:flex-row gap-6 p-5">
                                            {blog.thumbnailUrl && (
                                                <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden flex-shrink-0">
                                                    <img
                                                        src={blog.thumbnailUrl}
                                                        alt={blog.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                </div>
                                            )}

                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-medium border border-blue-500/30">
                                                        Blog
                                                    </span>
                                                    <span className="text-xs text-slate-500">
                                                        • {blog.created_at ? format(new Date(blog.created_at), 'MMM dd, yyyy') : 'Recently'}
                                                    </span>
                                                    <span className="text-xs text-slate-500">• {blog.viewCount} views</span>
                                                </div>
                                                <h3 className="text-xl font-bold group-hover:text-blue-400 transition-colors mb-2 line-clamp-2">
                                                    {blog.title}
                                                </h3>
                                                <p className="text-slate-400 text-sm line-clamp-2 mb-4">
                                                    {blog.content}
                                                </p>
                                                <div className="flex items-center justify-between mt-auto">
                                                    <div className="flex items-center gap-2">
                                                        <Avatar className="w-6 h-6">
                                                            <AvatarFallback className="bg-purple-500 text-[10px]">U</AvatarFallback>
                                                        </Avatar>
                                                        <span className="text-sm text-slate-400">User ID: {blog.userId.substring(0, 8)}...</span>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex items-center gap-1 text-slate-400 hover:text-blue-400 transition-colors">
                                                            <ThumbsUp className="w-4 h-4" />
                                                            <span className="text-sm">Like</span>
                                                        </div>
                                                        <div className="flex items-center gap-1 text-slate-400 hover:text-blue-400 transition-colors">
                                                            <MessageCircle className="w-4 h-4" />
                                                            <span className="text-sm">Comment</span>
                                                        </div>
                                                        <Share2 className="w-4 h-4 text-slate-400 hover:text-white transition-colors" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        <button className="w-full py-4 border border-dashed border-white/10 rounded-2xl text-slate-500 hover:border-blue-500/50 hover:text-blue-400 transition-all">
                            Load more discussions
                        </button>
                    </div>

                    {/* Sidebar Area */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Popular Groups */}
                        <motion.div
                            variants={sectionVariants}
                            initial="hidden"
                            animate="visible"
                            custom={5}
                            className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl"
                        >
                            <h3 className="text-lg font-bold mb-6 flex items-center justify-between">
                                Popular Groups
                                <span className="text-xs text-blue-400 font-normal hover:underline cursor-pointer">View All</span>
                            </h3>
                            <div className="space-y-4">
                                {mockGroups.map((group) => (
                                    <div key={group.name} className="flex items-center gap-3 group cursor-pointer p-2 -m-2 rounded-xl hover:bg-white/5 transition-colors">
                                        <div className={`p-2.5 rounded-xl bg-white/5 ${group.color}`}>
                                            <group.icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-sm font-semibold group-hover:text-blue-400 transition-colors">{group.name}</div>
                                            <div className="text-xs text-slate-500">{group.members} members</div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400" />
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Top Contributors */}
                        <motion.div
                            variants={sectionVariants}
                            initial="hidden"
                            animate="visible"
                            custom={6}
                            className="bg-linear-to-br from-blue-600/20 to-purple-600/20 border border-white/10 rounded-2xl p-6 backdrop-blur-xl"
                        >
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-yellow-400" />
                                Top Contributors
                            </h3>
                            <div className="space-y-4">
                                {[
                                    { name: 'AlexGamer', points: '12.4k', initial: 'AG' },
                                    { name: 'SarahPro', points: '10.2k', initial: 'SP' },
                                    { name: 'MikePlay', points: '8.7k', initial: 'MP' }
                                ].map((user, i) => (
                                    <div key={user.name} className="flex items-center gap-3">
                                        <div className="relative">
                                            <Avatar className="w-10 h-10 border-2 border-white/10">
                                                <AvatarFallback className="bg-slate-800 text-xs">{user.initial}</AvatarFallback>
                                            </Avatar>
                                            <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-slate-950 ${i === 0 ? 'bg-yellow-400 text-black' :
                                                i === 1 ? 'bg-slate-300 text-black' :
                                                    'bg-orange-600 text-white'
                                                }`}>
                                                {i + 1}
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-sm font-bold">{user.name}</div>
                                            <div className="text-xs text-slate-400">{user.points} points</div>
                                        </div>
                                        <button className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs transition-colors">
                                            Follow
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Upcoming Events */}
                        <motion.div
                            variants={sectionVariants}
                            initial="hidden"
                            animate="visible"
                            custom={7}
                            className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl"
                        >
                            <h3 className="text-lg font-bold mb-6">World Events</h3>
                            <div className="relative p-4 rounded-xl bg-linear-to-r from-blue-600 to-indigo-700 overflow-hidden group">
                                <div className="absolute top-0 right-0 p-2 opacity-20 pointer-events-none">
                                    <Gamepad2 className="w-24 h-24 rotate-12" />
                                </div>
                                <div className="relative z-10">
                                    <div className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-1">Live Now</div>
                                    <div className="text-base font-bold mb-3">Summer eSports Championship 2026</div>
                                    <button className="px-4 py-2 bg-white text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-50 transition-colors">
                                        Watch Stream
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
