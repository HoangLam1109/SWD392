import HomePage from "@/pages/HomePage"
import { Routes, Route } from "react-router-dom"
import Login from "@/auth/page/Login"
import Temp from "@/auth/page/Temp"
import RegisterPage from "@/auth/page/Register"
import ForgotPasswordPage from "@/auth/page/ForgotPasswordPage"
// import Dasboard from "@/pages/user/Dashboard"
import ProfilePage from "@/pages/ProfilePage"
import { UserManagementPage } from "@/pages"
import { AdminLayout } from "@/layouts/AdminLayout"
import { LibraryPage } from "@/pages/LibraryPage"
const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="login" element={<Login />} />
            <Route path="temp" element={<Temp />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
            {/* <Route path="dashboard" element={<Dasboard />} /> */}
            <Route path="profile" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminLayout onLogout={() => { }} currentPage={''} onNavigate={() => { }} />}>
                <Route path="user-management" element={<UserManagementPage />} />

            </Route>
            <Route path="/library" element={<LibraryPage />} />
        </Routes>
    )
}
export default AppRoutes;