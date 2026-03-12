import type { NavigationItem } from "./navigation.types";
import { Users, CalendarArrowDown, Gamepad2 } from "lucide-react";





export const navigationConfig: NavigationItem[] = [
    // Admin navigation
    {
        id: "user-management",
        label: "User Management",
        icon: Users,
        roles: ["Admin"],
        path: "/admin/user-management",
    },
    {
        id: "game-management-admin",
        label: "Game Management",
        icon: Gamepad2,
        roles: ["Admin"],
        path: "/admin/game-management",
    },
    {
        id: "order-management-admin",
        label: "Order Management",
        icon: CalendarArrowDown,
        roles: ["Admin"],
        path: "/admin/order-management",
    },
    // Manager / Moderator navigation
    {
        id: "game-management-manager",
        label: "Game Management",
        icon: Gamepad2,
        roles: ["Manager"],
        path: "/manager/game-management",
    },
    {
        id: "order-management-manager",
        label: "Order Management",
        icon: CalendarArrowDown,
        roles: ["Manager"],
        path: "/manager/order-management",
    },
    
];