import type { ManagerLayoutProps } from "./ManagerLayout";
import { ManagerLayout } from "./ManagerLayout";

export type AdminLayoutProps = ManagerLayoutProps;

export function AdminLayout(props: AdminLayoutProps) {
    return <ManagerLayout {...props} />;
}