import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { motion } from "framer-motion"
import type { Variants } from "framer-motion"
import { ArrowLeft, Calendar, Eye, Loader2 } from "lucide-react"
import { blogService } from "../service/blog.service"
import type { Blog } from "../types/Blog.types"
import CommentSection from "@/components/comment/CommentSection"
import { Navbar, Footer } from "@/components/home"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" }
    }
}

const BlogDetailPage = () => {
    const { id } = useParams<{ id: string }>()
    const [blog, setBlog] = useState<Blog | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchBlog = async () => {
            if (!id) return
            setIsLoading(true)
            try {
                const data = await blogService.getBlogById(id)
                setBlog(data)
            } catch (err) {
                setError("Failed to load blog post")
            } finally {
                setIsLoading(false)
            }
        }

        fetchBlog()
    }, [id])

    const getStatusBadge = (status: string) => {
        const variants: Record<string, string> = {
            APPROVED: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
            PENDING_APPROVAL: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
            REJECTED: "bg-red-500/20 text-red-400 border-red-500/30",
        }
        return variants[status] || "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-950 text-white">
                <div className="fixed inset-0 bg-linear-to-br from-blue-950/30 via-slate-950 to-purple-950/30 pointer-events-none" />
                <Navbar />
                <div className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                        <p className="text-slate-400">Loading blog post...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (error || !blog) {
        return (
            <div className="min-h-screen bg-slate-950 text-white">
                <div className="fixed inset-0 bg-linear-to-br from-blue-950/30 via-slate-950 to-purple-950/30 pointer-events-none" />
                <Navbar />
                <div className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                    <Link
                        to="/community"
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Community
                    </Link>
                    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
                        <h2 className="text-xl font-semibold mb-2">Blog not found</h2>
                        <p className="text-slate-400 mb-6">
                            {error || "This blog post may have been removed or the link is invalid."}
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500/30">
            {/* Background elements */}
            <div className="fixed inset-0 bg-linear-to-br from-blue-950/20 via-slate-950 to-purple-950/20 pointer-events-none" />
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.1),transparent_50%)] pointer-events-none" />

            <Navbar />

            <main className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                {/* Back Link */}
                <motion.div
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <Link
                        to="/community"
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Community
                    </Link>
                </motion.div>

                {/* Blog Header */}
                <motion.article
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                    className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
                >
                    {/* Thumbnail */}
                    {blog.thumbnailUrl && (
                        <div className="relative w-full aspect-video">
                            <img
                                src={blog.thumbnailUrl}
                                alt={blog.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                        </div>
                    )}

                    <div className="p-6 sm:p-8 lg:p-10">
                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            <Badge className={`${getStatusBadge(blog.status)} border`}>
                                {blog.status.replace("_", " ")}
                            </Badge>
                            <span className="flex items-center gap-1.5 text-slate-400 text-sm">
                                <Eye className="h-4 w-4" />
                                {blog.viewCount} views
                            </span>
                            {blog.created_at && (
                                <span className="flex items-center gap-1.5 text-slate-400 text-sm">
                                    <Calendar className="h-4 w-4" />
                                    {format(new Date(blog.created_at), "MMM d, yyyy")}
                                </span>
                            )}
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 bg-linear-to-r from-white to-slate-300 bg-clip-text text-transparent leading-tight">
                            {blog.title}
                        </h1>

                        {/* Content */}
                        <div className="prose prose-invert prose-lg max-w-none">
                            <p className="text-slate-300 whitespace-pre-wrap leading-relaxed text-lg">
                                {blog.content}
                            </p>
                        </div>
                    </div>
                </motion.article>

                {/* Comment Section */}
                <motion.div
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                    className="mt-8"
                >
                    <CommentSection blogId={blog._id} />
                </motion.div>
            </main>

            <Footer />
        </div>
    )
}

export default BlogDetailPage
