import type { Comment } from "@/types/Comment.types"

export interface CommentNode extends Comment {
  replies: CommentNode[]
}

export function buildCommentTree(comments: Comment[]): CommentNode[] {

  const map = new Map<string, CommentNode>()
  const roots: CommentNode[] = []

  comments.forEach(c => {
    map.set(c.id, { ...c, replies: [] })
  })

  map.forEach(comment => {

    if (comment.parentCommentId) {

      const parent = map.get(comment.parentCommentId)

      if (parent) {
        parent.replies.push(comment)
      }

    } else {
      roots.push(comment)
    }

  })

  return roots
}