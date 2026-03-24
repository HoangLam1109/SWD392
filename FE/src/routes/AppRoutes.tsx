import HomePage from "@/pages/HomePage";
import { Routes, Route } from "react-router-dom";
import Login from "@/auth/page/Login";
import GoogleCallback from "@/auth/page/GoogleCallback";
import Temp from "@/auth/page/Temp";
import RegisterPage from "@/auth/page/Register";
import ForgotPasswordPage from "@/auth/page/ForgotPasswordPage";
import ProfilePage from "@/pages/ProfilePage";
import { AdminLayout } from "@/layouts/AdminLayout";
import { LibraryPage, UserManagementPage, StorePage, GameDetailPage, CartPage } from "@/pages";
import { RoleRoute } from "./RoleRoute";
import type { Role } from "@/config/navigation/navigation.types";
import { useGetCurrentUser } from "@/hooks/auth/useGetCurrentUser";
import { GameManagementPage } from "@/pages/GameManagementPage";
import OAuthCallback from "@/auth/page/OAuthCallback";

const AppRoutes = () => {
    const { data: currentUser } = useGetCurrentUser();
    

    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="login" element={<Login />} />
            <Route path="auth/google/callback" element={<GoogleCallback />} />
            <Route path="temp" element={<Temp />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
            <Route path="oauth/callback" element={<OAuthCallback />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="/store" element={<StorePage />} />
            <Route path="/store/:gameId" element={<GameDetailPage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/cart" element={<CartPage />} />
            {/* ADMIN routes */}
            <Route element={<RoleRoute allowRoles={['ADMIN']} />}>
                <Route
                    path="/admin"
                    element={
                        <AdminLayout
                            currentUser={currentUser && {
                                id: currentUser.id,
                                name: currentUser.fullName,
                                role: currentUser.role as Role,
                            }}
                            onLogout={() => { }}
                            currentPage={''}
                            onNavigate={() => { }}
                        />
                    }
                >
                    <Route path="user-management" element={<UserManagementPage />} />
                    <Route path="game-management" element={<GameManagementPage/>}/>
                </Route>
            </Route>
        </Routes>
    );
};
export default AppRoutes;