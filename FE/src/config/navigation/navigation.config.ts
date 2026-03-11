import type { NavigationItem } from "./navigation.types";
import { Users, Gamepad2 } from "lucide-react";





export const navigationConfig: NavigationItem[] = [
    // Admin navigation
    {
        id: "user-management",
        label: "User Management",
        icon: Users,
        roles: ["ADMIN"],
        path: "/admin/user-management",
    },
    {
        id: "game-management-admin",
        label: "Game Management",
        icon: Gamepad2,
        roles: ["ADMIN"],
        path: "/admin/game-management",
    },
    // Manager / Moderator navigation
    {
        id: "game-management-manager",
        label: "Game Management",
        icon: Gamepad2,
        roles: ["MANAGER"],
        path: "/manager/game-management",
    },
    {
        id: "order-management-manager",
        label: "Order Management",
        icon: Users,
        roles: ["MANAGER"],
        path: "/manager/order-management",
    },
    
];