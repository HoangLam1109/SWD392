import { useState, useEffect } from "react";
import { blogService } from "@/service/blog.service";
import type { Blog } from "@/types/Blog.types";

export const useBlogs = () => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                setIsLoading(true);
                const response = await blogService.getBlogs();
                setBlogs(response.data);
                setError(null);
            } catch (err) {
                setError("Failed to fetch blogs");
                console.error("Error fetching blogs:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    return { blogs, isLoading, error };
};
