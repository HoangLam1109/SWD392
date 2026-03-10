import type { NavigationItem } from "./navigation.types";
import { Users, Gamepad2, FileText } from "lucide-react";





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
    {
        id: "blog-moderation",
        label: "Blog Moderation",
        path: "/admin/blogs",
        icon: FileText,
        roles: ["ADMIN"]
    },

    // Manager / Moderator navigation
    {
        id: "game-management-moderator",
        label: "Game Management",
        icon: Gamepad2,
        roles: ["MODERATOR"],
        path: "/moderator/game-management",
    },

];