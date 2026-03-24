import apiClient from "@/lib/apiClient"
import type { Comment, CommentApiResponse } from "@/types/Comment.types"
import { transformComment } from "@/types/Comment.types"

export const commentService = {

    async getCommentsByBlogId(blogId: string): Promise<Comment[]> {
        const res = await apiClient.get<CommentApiResponse[]>(`/comments/blog/${blogId}`)
        return res.data.map(transformComment)
    },

    async getReplies(parentId: string): Promise<Comment[]> {
        const res = await apiClient.get<CommentApiResponse[]>(`/comments/replies/${parentId}`)
        return res.data.map(transformComment)
    },

    async createComment(data: {
        content: string
        blogId: string
        parentCommentId?: string
    }): Promise<Comment> {
        const res = await apiClient.post<CommentApiResponse>("/comments", data)
        return transformComment(res.data)
    },

    async updateComment(id: string, content: string): Promise<Comment> {
        const res = await apiClient.patch<CommentApiResponse>(`/comments/${id}`, { content })
        return transformComment(res.data)
    },

    async deleteComment(id: string) {
        const res = await apiClient.delete(`/comments/${id}`)
        return res.data
    }

}