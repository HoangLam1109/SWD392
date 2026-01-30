import HomePage from "../pages/HomePage"
import ProfilePage from "../pages/ProfilePage"
import { Routes, Route } from "react-router-dom"
import { AdminLayout } from "../layouts/AdminLayout"
import { UserManagementPage } from "@/pages/UserManagementPage"
import { LibraryPage } from "@/pages/LibraryPage"

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin" element={<AdminLayout onLogout={() => { }} currentPage={''} onNavigate={() => { }} />}>
                <Route path="user-management" element={<UserManagementPage />} />

            </Route>
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/profile" element={<ProfilePage />} />
        </Routes>
    )
}
export default AppRoutes;