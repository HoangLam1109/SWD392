import React, { type ComponentType } from "react";
import type { LucideIcon } from "lucide-react";
export type Role = 'admin';

export interface NavigationItem {
    id:string;
    label:string;
    icon: LucideIcon | ComponentType<React.SVGProps<SVGSVGElement>>;
    roles: Role[];
    path?: string;
}