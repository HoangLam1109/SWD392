import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/auth/useAuth";
import { toast } from "sonner";

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const userParam = searchParams.get("user");

    if (!accessToken || !userParam) {
      toast.error("Google login failed");
      navigate("/login");
      return;
    }

    try {
      const user = JSON.parse(userParam);
      localStorage.setItem("token", accessToken);
      setUser({
        id: user.userId,
        email: user.email,
        fullName: user.fullName,
        avatar: user.avatar,
        role: user.role,
        status: "",
        createdAt: "",
        updatedAt: ""
      });
      toast.success("Login successful");

      if (user.role === "ADMIN") {
        navigate("/admin");
      } else if (user.role === "MODERATOR") {
        navigate("/moderator");
      } else {
        navigate("/");
      }
    } catch {
      toast.error("Google login failed");
      navigate("/login");
    }
  }, [searchParams, navigate, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#02071C]">
      <p className="text-white">Signing in...</p>
    </div>
  );
}
