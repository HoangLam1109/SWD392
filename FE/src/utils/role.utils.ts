import type { Role } from "@/config/navigation/navigation.types";

export const getPathbyRole = (role: Role): string => {
    switch (role) {
        case "ADMIN":
            return "/admin";
        case "MANAGER":
            return "/manager";
        case "PLAYER":
            return "/";
        default:
            return "";
    }
};