import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useSidebarNavigation } from "../hooks/useSidebarNavigation";
import { Sidebar } from "../components/common/Sidebar";
import type { Role } from "../config/navigation/navigation.types";

export interface ManagerLayoutProps {
    currentUser?: {
        id: string;
        name: string;
        role: Role;
    };
    onLogout: () => void;
    currentPage: string;
    onNavigate: (page: string) => void;
}

const ManagerLayoutComponent = ({ currentUser, onLogout, currentPage, onNavigate }: ManagerLayoutProps) => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const navigationItems = useSidebarNavigation(currentUser?.role as Role);

    const isAdmin = currentUser?.role === "ADMIN";
    const SidebarComponent =  Sidebar;

    const fallbackName = isAdmin ? "ADMIN" : "MANAGER";
    const roleLabel = isAdmin ? "ADMIN" : "MANAGER";

    return (
        <div className={`flex h-screen bg-slate-900`}>
            <SidebarComponent
                currentUserName={currentUser?.name || fallbackName}
                currentUserRole={roleLabel}
                currentPage={currentPage}
                sidebarCollapsed={sidebarCollapsed}
                currentUserAvatar="https://github.com/shadcn.png"
                setSidebarCollapsed={setSidebarCollapsed}
                onNavigate={onNavigate}
                navigationItems={navigationItems}
                onLogout={onLogout}
            />
            <div
                className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
                    sidebarCollapsed ? "ml-0 md:ml-16 lg:ml-16" : "ml-0 md:ml-64 lg:ml-64"
                }`}
            >
                <div className={`flex-1 overflow-y-auto bg-slate-900 p-4 sm:p-6 md:p-8 text-slate-50`}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export const ManagerLayout = ManagerLayoutComponent;
export default ManagerLayoutComponent;