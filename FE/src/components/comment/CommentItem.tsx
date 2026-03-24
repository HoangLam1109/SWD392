import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Reply, Trash2, Send, X, CornerDownRight, Loader2, ChevronDown, ChevronRight } from "lucide-react"
import { commentService } from "@/service/comment.service"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import type { CommentNode } from "@/utils/buildCommentTree"

interface Props {
    comment: CommentNode
    refresh: () => void
    isReply?: boolean
    depth?: number
}

export default function CommentItem({ comment, refresh, isReply = false, depth = 0 }: Props) {
    const [replyText, setReplyText] = useState("")
    const [showReplyInput, setShowReplyInput] = useState(false)
    const [showReplies, setShowReplies] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    // Count non-deleted replies recursively
    const countVisibleReplies = (replies: CommentNode[]): number => {
        return replies.reduce((count, reply) => {
            const replyCount = reply.isDeleted ? 0 : 1
            return count + replyCount + countVisibleReplies(reply.replies)
        }, 0)
    }

    const visibleRepliesCount = countVisibleReplies(comment.replies)

    const handleReply = async () => {
        if (!replyText.trim()) return

        setIsSubmitting(true)
        try {
            await commentService.createComment({
                content: replyText,
                blogId: comment.blogId,
                parentCommentId: comment.id
            })
            setReplyText("")
            setShowReplyInput(false)
            setShowReplies(true) // Show replies after posting
            refresh()
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            await commentService.deleteComment(comment.id)
            refresh()
        } finally {
            setIsDeleting(false)
        }
    }

    // Soft deleted comment - show placeholder but allow tree to continue
    if (comment.isDeleted) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${isReply ? "ml-8 mt-3 pl-4 border-l-2 border-slate-700/50" : "py-4 border-b border-white/5 last:border-0"}`}
            >
                <div className="flex gap-3">
                    <Avatar className={`${isReply ? "w-8 h-8" : "w-10 h-10"} border border-white/10 flex-shrink-0 opacity-50`}>
                        <AvatarFallback className="bg-slate-600/20 text-slate-500 text-sm">
                            ?
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                        <div className="bg-slate-800/20 border border-white/5 rounded-xl px-4 py-3">
                            <p className="text-slate-500 italic text-sm">
                                This comment has been deleted
                            </p>
                        </div>

                        {/* Still show replies for deleted comments if they exist */}
                        {comment.replies.length > 0 && (
                            <div className="mt-2 ml-1">
                                <button
                                    onClick={() => setShowReplies(!showReplies)}
                                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-blue-400 transition-colors"
                                >
                                    {showReplies ? (
                                        <ChevronDown className="w-3.5 h-3.5" />
                                    ) : (
                                        <ChevronRight className="w-3.5 h-3.5" />
                                    )}
                                    {showReplies
                                        ? "Hide replies"
                                        : `View ${visibleRepliesCount} ${visibleRepliesCount === 1 ? "reply" : "replies"}`}
                                </button>
                            </div>
                        )}

                        {/* Nested Replies Tree */}
                        <AnimatePresence>
                            {showReplies && comment.replies.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mt-2 overflow-hidden"
                                >
                                    {comment.replies.map((reply) => (
                                        <CommentItem
                                            key={reply.id}
                                            comment={reply}
                                            refresh={refresh}
                                            isReply={true}
                                            depth={depth + 1}
                                        />
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${isReply ? "ml-8 mt-3 pl-4 border-l-2 border-slate-700/50" : "py-4 border-b border-white/5 last:border-0"}`}
        >
            <div className="flex gap-3">
                <Avatar className={`${isReply ? "w-8 h-8" : "w-10 h-10"} border border-white/10 flex-shrink-0`}>
                    <AvatarFallback className="bg-purple-600/20 text-purple-400 text-sm">
                        U
                    </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                    {/* Comment Content */}
                    <div className="bg-slate-800/30 border border-white/5 rounded-xl px-4 py-3">
                        <p className="text-slate-200 text-sm leading-relaxed break-words">
                            {comment.content}
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 mt-2 ml-1">
                        <button
                            onClick={() => setShowReplyInput(!showReplyInput)}
                            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-blue-400 transition-colors"
                        >
                            <Reply className="w-3.5 h-3.5" />
                            Reply
                        </button>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <button
                                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-400 transition-colors"
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                        <Trash2 className="w-3.5 h-3.5" />
                                    )}
                                    Delete
                                </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-slate-900 border-slate-700">
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="text-slate-50">Delete Comment</AlertDialogTitle>
                                    <AlertDialogDescription className="text-slate-400">
                                        Are you sure you want to delete this comment? This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700">
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDelete}
                                        className="bg-red-600 hover:bg-red-500 text-white"
                                    >
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        {/* View Replies Button */}
                        {comment.replies.length > 0 && visibleRepliesCount > 0 && (
                            <button
                                onClick={() => setShowReplies(!showReplies)}
                                className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                            >
                                {showReplies ? (
                                    <ChevronDown className="w-3.5 h-3.5" />
                                ) : (
                                    <ChevronRight className="w-3.5 h-3.5" />
                                )}
                                {showReplies
                                    ? "Hide replies"
                                    : `View ${visibleRepliesCount} ${visibleRepliesCount === 1 ? "reply" : "replies"}`}
                            </button>
                        )}
                    </div>

                    {/* Reply Input */}
                    <AnimatePresence>
                        {showReplyInput && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-3 overflow-hidden"
                            >
                                <div className="flex gap-3">
                                    <div className="flex items-start pt-2">
                                        <CornerDownRight className="w-4 h-4 text-slate-600" />
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <Textarea
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            placeholder="Write a reply..."
                                            rows={2}
                                            className="bg-slate-900/50 border-white/10 text-white text-sm placeholder:text-slate-500 focus:border-blue-500/50 resize-none"
                                        />
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={handleReply}
                                                disabled={!replyText.trim() || isSubmitting}
                                                size="sm"
                                                className="bg-blue-600 hover:bg-blue-500 text-white text-xs h-8"
                                            >
                                                {isSubmitting ? (
                                                    <Loader2 className="w-3 h-3 animate-spin" />
                                                ) : (
                                                    <>
                                                        <Send className="w-3 h-3 mr-1.5" />
                                                        Send
                                                    </>
                                                )}
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    setShowReplyInput(false)
                                                    setReplyText("")
                                                }}
                                                size="sm"
                                                variant="ghost"
                                                className="text-slate-400 hover:text-slate-300 text-xs h-8"
                                            >
                                                <X className="w-3 h-3 mr-1.5" />
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Nested Replies Tree */}
                    <AnimatePresence>
                        {showReplies && comment.replies.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-2 overflow-hidden"
                            >
                                {comment.replies.map((reply) => (
                                    <CommentItem
                                        key={reply.id}
                                        comment={reply}
                                        refresh={refresh}
                                        isReply={true}
                                        depth={depth + 1}
                                    />
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    )
}