import { useState } from "react"
import { blogService } from "../service/blog.service"
import { useNavigate } from "react-router-dom"

const NewPostPage = () => {
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [thumbnail, setThumbnail] = useState<File | null>(null)

    const navigate = useNavigate()

    const handleSubmit = async (e: any) => {
        e.preventDefault()


        const formData = new FormData()
        formData.append("title", title)
        formData.append("content", content)

        if (thumbnail) {
            formData.append("thumbnail", thumbnail)
        }

        await blogService.createBlog(formData)

        navigate("/community")


    }

    return (<form onSubmit={handleSubmit}> <h1>Create Blog</h1>

        ```
        <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
        />

        <input
            type="file"
            onChange={(e) =>
                setThumbnail(e.target.files ? e.target.files[0] : null)
            }
        />

        <button type="submit">Post</button>
    </form>


    )
}

export default NewPostPage;
