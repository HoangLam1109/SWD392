import { useMemo } from "react";
import type { Role } from "../config/navigation/navigation.types";
import type { NavigationItem } from "../config/navigation/navigation.types";
import { navigationConfig } from "../config/navigation/navigation.config";
export function useSidebarNavigation(userRole: Role) {
    return useMemo<NavigationItem[]>(() => {
        return navigationConfig
        .filter((item: NavigationItem) => item.roles.includes(userRole))
        .map((item: NavigationItem) => ({
            id: item.id,
            label: item.label,
            icon: item.icon ,
            path: item.path,
            roles: item.roles,
        }));
    }, [userRole]);
}

