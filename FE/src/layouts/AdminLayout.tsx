import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useSidebarNavigation } from "../hooks/useSidebarNavigation";
import { Sidebar } from "../components/common/Sidebar";
import { TopHeader } from "@/components/common/TopHeader";
import type { Role } from "../config/navigation/navigation.types";

interface AdminLayoutProps {
    currentUser?: {
        id: string;
        name: string;
        role: Role;
    };
    onLogout: () => void;
    currentPage: string;
    onNavigate: (page: string) => void;
}

export function AdminLayout({  currentUser, onLogout, currentPage, onNavigate }: AdminLayoutProps) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const navigationItems = useSidebarNavigation(currentUser?.role || 'admin');
    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar 
                currentUserName={currentUser?.name || "Admin"} 
                currentUserRole="Admin" 
                currentPage={currentPage} 
                sidebarCollapsed={sidebarCollapsed} 
                currentUserAvatar="https://github.com/shadcn.png" 
                setSidebarCollapsed={setSidebarCollapsed} 
                onNavigate={onNavigate} 
                navigationItems={navigationItems} 
                onLogout={onLogout} 
            />
            <div className={`flex-1 flex flex-col overflow-hidden ${sidebarCollapsed ? 'ml-0 md:ml-16 lg:ml-16' : 'ml-0 md:ml-64 lg:ml-64'}`}>
                <TopHeader />
                <div className="flex-1 overflow-y-auto bg-gray-50 p-3 xs:p-4 sm:p-5 md:p-6">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}