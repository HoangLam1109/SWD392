import type { NavigationItem } from "./navigation.types";
import { Users, Gamepad2, Monitor } from "lucide-react";
import type { Role } from "./navigation.types";

/** Base path (prefix) cho từng role (admin layout, moderator layout). */
export const getPathbyRole = (role: Role): string => {
    switch (role) {
        case "ADMIN":
            return "/admin";
        case "MODERATOR":
            return "/moderator";
        case "PLAYER":
            return "/";
        default:
            return "";
    }
};

/** Alias: lấy prefix theo role (dùng để build path con như game-management). */
export const getPrefixByRole = getPathbyRole;

/** Path đầy đủ đến trang Game Management theo role (ADMIN / MODERATOR có quyền). */
export const getGameManagementPathByRole = (role: Role): string => {
    const prefix = getPrefixByRole(role);
    if (!prefix) return "";
    return `${prefix}/game-management`;
};
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
        id: "game-manangement",
        label: "Game Management",
        icon: Gamepad2,
        roles: ["ADMIN","MODERATOR"],
        path: "/game-management",
    },
    // Manager / Moderator navigation
    {
        id: "system-management",
        label: "System Management",
        icon: Monitor,
        roles: ["MODERATOR"],
        path: "/moderator/system-management",
    },
];