import { Navigate, Outlet } from "react-router-dom";
import { useGetCurrentUser } from "@/hooks/auth/useGetCurrentUser";
import type { Role } from "@/config/navigation/navigation.types";

interface RoleRouteProps {
  allowRoles: Role[];
}

export function RoleRoute({ allowRoles }: RoleRouteProps) {
  const { data: currentUser, isLoading } = useGetCurrentUser();
  console.log(currentUser);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const userRole = currentUser.role  as Role;

  if (!allowRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

