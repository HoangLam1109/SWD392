import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { MessageCircle, Send, Loader2 } from "lucide-react"
import type { Comment } from "@/types/Comment.types"
import { commentService } from "@/service/comment.service"
import CommentItem from "./CommentItem"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { buildCommentTree, type CommentNode } from "@/utils/buildCommentTree"

interface Props {
    blogId: string
}

const sectionVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3 }
    }
}

export default function CommentSection({ blogId }: Props) {
    const [comments, setComments] = useState<Comment[]>([])
    const [commentTree, setCommentTree] = useState<CommentNode[]>([])
    const [content, setContent] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const fetchComments = async () => {
        setIsLoading(true)
        try {
            const data = await commentService.getCommentsByBlogId(blogId)
            setComments(data)
            setCommentTree(buildCommentTree(data))
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchComments()
    }, [blogId])

    const handleCreate = async () => {
        if (!content.trim()) return

        setIsSubmitting(true)
        try {
            await commentService.createComment({
                content,
                blogId
            })
            setContent("")
            fetchComments()
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
            handleCreate()
        }
    }

    // Count only non-deleted comments for display
    const visibleCommentsCount = comments.filter(c => !c.isDeleted).length

    return (
        <motion.div
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
        >
            {/* Header */}
            <div className="flex items-center gap-2 mb-6">
                <MessageCircle className="w-5 h-5 text-blue-400" />
                <h2 className="text-xl font-bold">
                    Comments
                    {visibleCommentsCount > 0 && (
                        <span className="ml-2 text-sm font-normal text-slate-400">
                            ({visibleCommentsCount})
                        </span>
                    )}
                </h2>
            </div>

            {/* Comment Input */}
            <div className="flex gap-4 mb-8">
                <Avatar className="w-10 h-10 border border-white/10">
                    <AvatarFallback className="bg-blue-600/20 text-blue-400">
                        U
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                    <Textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Write a comment..."
                        rows={3}
                        className="bg-slate-900/50 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-blue-500/20 resize-none"
                    />
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">
                            Press Ctrl+Enter to submit
                        </span>
                        <Button
                            onClick={handleCreate}
                            disabled={!content.trim() || isSubmitting}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    <Send className="h-4 w-4 mr-2" />
                                    Post Comment
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Comments List */}
            <div className="space-y-1">
                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                    </div>
                ) : commentTree.length === 0 ? (
                    <div className="text-center py-8">
                        <MessageCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                        <p className="text-slate-400">No comments yet</p>
                        <p className="text-sm text-slate-500">Be the first to share your thoughts!</p>
                    </div>
                ) : (
                    commentTree.map(comment => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            refresh={fetchComments}
                        />
                    ))
                )}
            </div>
        </motion.div>
    )
}