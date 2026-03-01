import type { NavigationItem } from "./navigation.types";
import { Users } from "lucide-react";

export const navigationConfig: NavigationItem[] = [
    {
        id: 'user-management',
        label: 'User Management',
        icon: Users,
        roles: ['ADMIN'],
        path: '/admin/user-management',
    },
];