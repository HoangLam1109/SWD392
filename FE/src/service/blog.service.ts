import apiClient from "@/lib/apiClient";
import type { Blog, BlogsResponse } from "@/types/Blog.types";

export const blogService = {

    async getBlogs(): Promise<BlogsResponse> {
        const response = await apiClient.get<BlogsResponse>("/blogs");
        return response.data;
    },

    async getBlogById(id: string): Promise<Blog> {
        const response = await apiClient.get<Blog>(`/blogs/${id}`);
        return response.data;
    },

    async createBlog(data: FormData) {
        const response = await apiClient.post("/blogs", data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });


        return response.data;


    },

    async getPendingBlogs(): Promise<BlogsResponse> {
        const res = await apiClient.get<BlogsResponse>("/blogs?status=PENDING_APPROVAL");
        return res.data;
    },

    async approveBlog(id: string): Promise<Blog> {
        const res = await apiClient.patch(`/blogs/${id}/status`, {
            status: "APPROVED"
        });
        return res.data;
    },

    async rejectBlog(id: string): Promise<Blog> {
        const res = await apiClient.patch(`/blogs/${id}/status`, {
            status: "REJECTED"
        });
        return res.data;
    }
};
