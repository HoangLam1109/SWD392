import type { NavigationItem } from "./navigation.types";
import { Users,Gamepad2 } from "lucide-react";

export const navigationConfig: NavigationItem[] = [
    {
        id: 'user-management',
        label: 'User Management',
        icon: Users,
        roles: ['ADMIN'],
        path: '/admin/user-management',
    },
    {
        id: 'game-manangement',
        label: 'Game Management',
        icon:Gamepad2,
        roles: ['ADMIN'],
        path: '/admin/game-management',
    }
];