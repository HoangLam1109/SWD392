// Raw API response from MongoDB
export interface CommentApiResponse {
    _id: string
    content: string
    blogId: string
    userId: string
    parentCommentId: string | null
    isDeleted: boolean
    created_at: string
    updated_at: string
}

// Normalized comment for frontend use
export interface Comment {
    id: string
    content: string
    blogId: string
    userId: string
    parentCommentId: string | null
    isDeleted: boolean
    createdAt: string
    updatedAt: string
}

// Transform API response to frontend Comment
export function transformComment(raw: CommentApiResponse): Comment {
    return {
        id: raw._id,
        content: raw.content,
        blogId: raw.blogId,
        userId: raw.userId,
        parentCommentId: raw.parentCommentId,
        isDeleted: raw.isDeleted,
        createdAt: raw.created_at,
        updatedAt: raw.updated_at,
    }
}