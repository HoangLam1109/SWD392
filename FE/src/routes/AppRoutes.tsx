import HomePage from "@/pages/home-page"
import { Routes,Route } from "react-router-dom"

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
        </Routes>
    )
}
export default AppRoutes;