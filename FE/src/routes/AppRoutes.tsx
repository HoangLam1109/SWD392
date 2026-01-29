import HomePage from "../pages/HomePage"
import ProfilePage from "../pages/ProfilePage"
import { Routes, Route } from "react-router-dom"

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/profile" element={<ProfilePage />} />
        </Routes>
    )
}
export default AppRoutes;