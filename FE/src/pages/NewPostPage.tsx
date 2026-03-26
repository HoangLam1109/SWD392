import { useState } from "react"
import { motion } from "framer-motion"
import type { Variants } from "framer-motion"
import { ArrowLeft, ImagePlus, Send, Loader2, X } from "lucide-react"
import { blogService } from "../service/blog.service"
import { useNavigate, Link } from "react-router-dom"
import { Navbar, Footer } from "@/components/home"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" }
    }
}

const NewPostPage = () => {
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [thumbnail, setThumbnail] = useState<File | null>(null)
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const navigate = useNavigate()

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setThumbnail(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setThumbnailPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const removeThumbnail = () => {
        setThumbnail(null)
        setThumbnailPreview(null)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsSubmitting(true)

        try {
            const formData = new FormData()
            formData.append("title", title)
            formData.append("content", content)

            if (thumbnail) {
                formData.append("thumbnail", thumbnail)
            }

            await blogService.createBlog(formData)
            navigate("/community")
        } catch (err) {
            setError("Failed to create blog post. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500/30">
            {/* Background elements */}
            <div className="fixed inset-0 bg-linear-to-br from-blue-950/20 via-slate-950 to-purple-950/20 pointer-events-none" />
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.1),transparent_50%)] pointer-events-none" />

            <Navbar />

            <main className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
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

                {/* Page Header */}
                <motion.div
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                    className="mb-8"
                >
                    <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                        Create New{" "}
                        <span className="bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            Post
                        </span>
                    </h1>
                    <p className="text-slate-400">
                        Share your gaming experiences, guides, and thoughts with the community.
                    </p>
                </motion.div>

                {/* Form Card */}
                <motion.div
                    variants={sectionVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <Card className="backdrop-blur-xl bg-white/5 border-white/10">
                        <CardHeader>
                            <CardTitle className="text-slate-50">Post Details</CardTitle>
                            <CardDescription className="text-slate-400">
                                Fill in the details for your new blog post
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Error Message */}
                                {error && (
                                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm">
                                        {error}
                                    </div>
                                )}

                                {/* Title */}
                                <div className="space-y-2">
                                    <Label htmlFor="title" className="text-slate-200">
                                        Title
                                    </Label>
                                    <Input
                                        id="title"
                                        placeholder="Enter an engaging title for your post..."
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                        className="bg-slate-900/50 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-blue-500/20"
                                    />
                                </div>

                                {/* Content */}
                                <div className="space-y-2">
                                    <Label htmlFor="content" className="text-slate-200">
                                        Content
                                    </Label>
                                    <Textarea
                                        id="content"
                                        placeholder="Write your post content here..."
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        required
                                        rows={10}
                                        className="bg-slate-900/50 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-blue-500/20 resize-none"
                                    />
                                </div>

                                {/* Thumbnail Upload */}
                                <div className="space-y-2">
                                    <Label className="text-slate-200">
                                        Thumbnail (optional)
                                    </Label>

                                    {thumbnailPreview ? (
                                        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/10">
                                            <img
                                                src={thumbnailPreview}
                                                alt="Thumbnail preview"
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={removeThumbnail}
                                                className="absolute top-3 right-3 p-2 bg-slate-900/80 hover:bg-red-500/80 rounded-full transition-colors"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <label
                                            htmlFor="thumbnail"
                                            className="flex flex-col items-center justify-center w-full aspect-video rounded-xl border-2 border-dashed border-white/10 hover:border-blue-500/50 bg-slate-900/30 cursor-pointer transition-colors group"
                                        >
                                            <div className="flex flex-col items-center justify-center py-6">
                                                <ImagePlus className="w-12 h-12 text-slate-500 group-hover:text-blue-400 transition-colors mb-3" />
                                                <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                                                    Click to upload thumbnail
                                                </p>
                                                <p className="text-xs text-slate-500 mt-1">
                                                    PNG, JPG up to 5MB
                                                </p>
                                            </div>
                                            <input
                                                id="thumbnail"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleThumbnailChange}
                                                className="hidden"
                                            />
                                        </label>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-end gap-4 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => navigate("/community")}
                                        className="border-white/10 text-slate-300 hover:bg-white/5"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting || !title || !content}
                                        className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 disabled:opacity-50"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Publishing...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="h-4 w-4 mr-2" />
                                                Publish Post
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            </main>

            <Footer />
        </div>
    )
}

export default NewPostPage
