import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { useLogin } from "@/hooks/auth/useLogin";
import { useAuth } from "@/hooks/auth/useAuth";
import { toast } from "sonner";


  type FormValues = {
    email: string;
    password: string;
    showPassword: boolean;
  };

export default function SigninPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const { mutate: login, isPending, error } = useLogin();
    const form = useForm<FormValues>({
      defaultValues: {
        email: "",
        password: "",
        showPassword: false,
      },
    });

    const handleLogin = (data: FormValues) => {
      login(
        { email: data.email, password: data.password },
        {
          onSuccess: (res) => {
            localStorage.setItem("token", res.accessToken);
            toast.success(t("auth.login.loginSuccess"));
            setUser(res.user);
            navigate("/");
          },
        }
      );
    };

    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#02071C]">
        {/*  */}
        <div className="w-full max-w-md space-y-6">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <a href="/" className="transition-transform hover:scale-105">
              <img src="/src/assets/platfun-logo.svg" className="h-12" alt="platfun Logo" />
            </a>
          </div>

          {/* Card */}
          <Card className="border-0 rounded-2xl shadow-2xl bg-[#0A0F24] shadow-[#000060]">
            <CardHeader className="space-y-2 text-center pb-2 pt-8">
              <CardTitle className="text-3xl font-bold tracking-tight text-white">
                {t("auth.login.welcomeBack")}
              </CardTitle>
              <p className="text-sm text-gray-400">
                {t("auth.login.enterCredentials")}
              </p>
              <Button
                variant="outline"
                onClick={() => { }}
                className="w-full h-11 gap-3 border-2 hover:border-[#00E5FF] hover:bg-gray-300 hover:cursor-pointer hover:scale-105 transition-transform duration-300 ease-out"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 48 48"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                  />
                </svg>
                <span>{t("common.continueWithGoogle")}</span>
              </Button>
            </CardHeader>
            <div className="relative">
              <div className="absolute inset-0 flex items-center px-6">
                {/* <Separator className="bg-white" /> */}
                <div className="bg-[#E5E5E5] h-[0.5px] w-full"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#0A0F24] text-[#717182] px-2">
                  {t("common.or")}
                </span>
              </div>
            </div>


            <CardContent className="pb-8">
              {/* Form */}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="email"
                    rules={{
                      required: t("auth.login.emailRequired"),
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: t("auth.login.invalidEmail"),
                      },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="email" className="text-sm font-medium" style={{ color: '#CBD5E1' }}>
                          {t("auth.login.email")}
                        </Label>
                        <FormControl>
                          <Input
                            id="email"
                            type="email"
                            placeholder={t("auth.login.enterEmail")}
                            className="h-9 w-full rounded-lg border-2 border-[#1E293B] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#00E5FF] bg-[#040C26] text-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" style={{ color: '#FF6B6B' }} />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    rules={{
                      required: t("auth.login.passwordRequired"),
                      minLength: {
                        value: 8,
                        message: t("auth.login.passwordMinLength"),
                      },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="password" className="text-sm font-medium" style={{ color: '#CBD5E1' }}>
                          {t("auth.login.password")}
                        </Label>
                        <FormControl>
                          <Input
                            id="password"
                            type={form.watch("showPassword") ? "text" : "password"}
                            placeholder={t("auth.login.enterPassword")}
                            className="h-9 w-full rounded-lg border-2 border-[#1E293B] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#00E5FF] bg-[#040C26] text-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" style={{ color: '#FF6B6B' }} />
                      </FormItem>
                    )}
                  />

                  {error && (
                    <p className="text-sm" style={{ color: "#FF6B6B" }}>
                      {error.message}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    {/* Show Password */}
                    <FormField
                      control={form.control}
                      name="showPassword"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              className="cursor-pointer border-[#1E293B] data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-[#00E5FF] data-[state=checked]:to-[#7C4DFF] data-[state=checked]:border-0"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  field.onChange(!field.value);
                                }
                              }}
                            />
                          </FormControl>
                          <Label
                            className="text-sm font-normal cursor-pointer"
                            style={{ color: '#A1A1AA' }}
                            onClick={() => field.onChange(!field.value)}
                          >
                            {t("auth.login.showPassword")}
                          </Label>
                        </FormItem>
                      )}
                    />
                    <a
                      href="/forgot-password"
                      className="text-sm font-medium transition-colors"
                      style={{ color: '#00E5FF' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#00E5FF';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#ffffff';
                      }}
                    >
                      {t("auth.login.forgotPassword")}
                    </a>
                  </div>

                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full h-9 font-semibold text-white rounded-lg bg-[#5865F2] hover:bg-[#4452bb] mt-6 hover:cursor-pointer hover:scale-105 transition-transform duration-500 ease-out disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isPending ? t("auth.login.loggingIn") : t("auth.login.loginButton")}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Register Link */}
          <p className="text-center text-sm" style={{ color: '#A1A1AA' }}>
            {t("auth.login.noAccount")}{" "}
            <a
              href="/register"
              className="font-semibold transition-colors"
              style={{ color: '#00E5FF' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#00E5FF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#ffffff';
              }}
            >
              {t("auth.login.registerForFree")}
            </a>
          </p>
        </div>
      </div>
    );
  }
