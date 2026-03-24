import { useEffect, useState } from "react"
import { blogService } from "@/service/blog.service"
import type { Blog } from "@/types/Blog.types"

const BlogModerationPage = () => {

    const [blogs, setBlogs] = useState<Blog[]>([])

    const fetchBlogs = async () => {
        const data = await blogService.getPendingBlogs()
        setBlogs(data.data)
    }

    useEffect(() => {
        fetchBlogs()
    }, [])

    const handleApprove = async (id: string) => {
        await blogService.approveBlog(id)
        fetchBlogs()
    }

    const handleReject = async (id: string) => {
        await blogService.rejectBlog(id)
        fetchBlogs()
    }

    return (<div> <h1 className="text-2xl font-bold mb-6">Blog Approval</h1>


        {blogs.length === 0 && <p>No pending blogs</p>}

        {blogs.map(blog => (
            <div key={blog._id} className="border border-slate-700 p-4 mb-4 rounded">

                <h2 className="text-lg font-semibold">{blog.title}</h2>

                <p className="text-sm text-slate-400 mb-3">
                    {blog.content.slice(0, 150)}...
                </p>

                {blog.thumbnailUrl && (
                    <img src={blog.thumbnailUrl} className="w-60 mb-3 rounded" />
                )}

                <div className="flex gap-3">

                    <button
                        onClick={() => handleApprove(blog._id)}
                        className="bg-green-600 px-4 py-2 rounded"
                    >
                        Approve
                    </button>

                    <button
                        onClick={() => handleReject(blog._id)}
                        className="bg-red-600 px-4 py-2 rounded"
                    >
                        Reject
                    </button>

                </div>

            </div>
        ))}

    </div>


    )
}

export default BlogModerationPage
