import type { Role } from "@/config/navigation/navigation.types";

export const getPathbyRole = (role: Role): string => {
    switch (role) {
    case "Admin":
            return "/admin";
        case "Manager":
            return "/manager";
        case "Player":
            return "/";
        default:
            return "";
    }
};