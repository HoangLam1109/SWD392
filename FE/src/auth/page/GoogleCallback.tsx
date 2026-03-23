import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/auth/useAuth";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export default function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const userParam = searchParams.get("user");

    if (accessToken && userParam) {
      try {
        const user = JSON.parse(userParam);
        localStorage.setItem("token", accessToken);
        setUser(user);
        toast.success(t("auth.login.loginSuccess"));

        if (user.role === "ADMIN") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      } catch {
        toast.error(t("auth.login.loginFailed") || "Google login failed");
        navigate("/login", { replace: true });
      }
    } else {
      toast.error(t("auth.login.loginFailed") || "Google login failed");
      navigate("/login", { replace: true });
    }
  }, [searchParams, navigate, setUser, t]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#02071C]">
      <div className="text-white text-lg animate-pulse">
        Signing in with Google...
      </div>
    </div>
  );
}
