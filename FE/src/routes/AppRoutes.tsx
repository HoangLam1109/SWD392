import HomePage from "../pages/HomePage"
import { Routes, Route } from "react-router-dom"
import { AdminLayout } from "../layouts/AdminLayout"
import { UserManagementPage } from "@/pages/UserManagementPage"

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin" element={<AdminLayout onLogout={() => {}} currentPage={''} onNavigate={() => {}} />}>
                <Route path="user-management" element={<UserManagementPage />} />
                
            </Route>
        </Routes>
    )
}
export default AppRoutes;