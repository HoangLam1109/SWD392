import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { blogService } from "../service/blog.service"
import type { Blog } from "../types/Blog.types"

const BlogDetailPage = () => {
    const { id } = useParams<{ id: string }>()
    const [blog, setBlog] = useState<Blog | null>(null)

    useEffect(() => {
        const fetchBlog = async () => {
            if (!id) return
            const data = await blogService.getBlogById(id)
            setBlog(data)
        }

        fetchBlog()

    }, [id])

    if (!blog) return <p>Loading...</p>

    return (
        <div>
            <h1>{blog.title}</h1>
            {blog.thumbnailUrl &&
                <img src={blog.thumbnailUrl} width="300" />}
            <p>{blog.content}</p>
        </div>
    )
}

export default BlogDetailPage
