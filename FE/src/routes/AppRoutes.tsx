import HomePage from "@/pages/HomePage";
import { Routes, Route } from "react-router-dom";
import Login from "@/auth/page/Login";
import Temp from "@/auth/page/Temp";
import RegisterPage from "@/auth/page/Register";
import ForgotPasswordPage from "@/auth/page/ForgotPasswordPage";
import ProfilePage from "@/pages/ProfilePage";
import { AdminLayout } from "@/layouts/AdminLayout";
import { LibraryPage, UserManagementPage, StorePage, GameDetailPage, CartPage, WalletPage, PaymentCheckoutPage, PaymentSuccessPage, CommunityPage } from "@/pages";
import { RoleRoute } from "./RoleRoute";
import type { Role } from "@/config/navigation/navigation.types";
import { useGetCurrentUser } from "@/hooks/auth/useGetCurrentUser";
import { GameManagementPage } from "@/pages/GameManagementPage";
import { ManagerLayout } from "@/layouts/ManagerLayout";
import OrderManagementPage from "@/pages/OrderManagementPage";
import BlogDetailPage from "@/pages/BlogDetailPage";
import NewPostPage from "@/pages/NewPostPage";
import BlogModerationPage from "@/pages/admin/BlogModerationPage";
import TransactionHistoryPage from "@/pages/TransactionHistoryPage";
import FlappyBirdPage from "@/pages/FlappyBirdPage";

const AppRoutes = () => {
    const { data: currentUser } = useGetCurrentUser();


    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="login" element={<Login />} />
            <Route path="temp" element={<Temp />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
            <Route path="profile" element={<ProfilePage />} />
            
            <Route path="/store" element={<StorePage />} />
            <Route path="/store/:gameId" element={<GameDetailPage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/transaction-history" element={<TransactionHistoryPage />} />
            <Route path="/payment/checkout/:orderId" element={<PaymentCheckoutPage />} />
            <Route path="/payment/success" element={<PaymentSuccessPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/blogs/:id" element={<BlogDetailPage />} />
            <Route path="/new-post" element={<NewPostPage />} />
            <Route path="/flappy-bird/:libraryGameId" element={<FlappyBirdPage />} />

            {/* ADMIN routes */}
            <Route element={<RoleRoute allowRoles={['Admin']} />}>
                <Route
                    path="/admin"
                    element={
                        <AdminLayout
                            currentUser={currentUser && currentUser._id ? {
                                id: currentUser._id,
                                name: currentUser.fullName,
                                role: currentUser.role as Role,
                            } : undefined}
                            onLogout={() => { }}
                            currentPage={''}
                            onNavigate={() => { }}
                        />
                    }
                >
                    <Route path="user-management" element={<UserManagementPage />} />
                    <Route path="game-management" element={<GameManagementPage />} />
                    <Route path="blogs" element={<BlogModerationPage />} />
                </Route>
            </Route>
            <Route element={<RoleRoute allowRoles={['Manager']} />}>
                <Route
                    path="/manager"
                    element={
                        <ManagerLayout
                            currentUser={currentUser && currentUser._id ? {
                                id: currentUser._id,
                                name: currentUser.fullName,
                                role: currentUser.role as Role,
                            } : undefined}
                            onLogout={() => { }}
                            currentPage={''}
                            onNavigate={() => { }}
                        />
                    }
                >
                    <Route path="game-management" element={<GameManagementPage />} />
                    <Route path="order-management" element={<OrderManagementPage />} />
                </Route>
            </Route>
        </Routes>
    );
};
export default AppRoutes;