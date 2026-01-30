import HomePage from "@/pages/HomePage"
import { Routes,Route } from "react-router-dom"
import Login from "@/auth/page/Login"
import Temp from "@/auth/page/Temp"
import RegisterPage from "@/auth/page/Register"
import ForgotPasswordPage from "@/auth/page/ForgotPasswordPage"
// import Dasboard from "@/pages/user/Dashboard"
import ProfilePage from "@/pages/ProfilePage"
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
        </Routes>
    )
}
export default AppRoutes;