import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

type EmailFormValues = {
    email: string;
};

type CodeFormValues = {
    code: string;
};

type PasswordFormValues = {
    newPassword: string;
    confirmPassword: string;
};

export default function ForgotPasswordPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [step, setStep] = useState<"email" | "code" | "password">("email");
    const [submittedEmail, setSubmittedEmail] = useState("");
    const [verifiedCode, setVerifiedCode] = useState("");

    const emailForm = useForm<EmailFormValues>({
        defaultValues: {
            email: "",
        },
    });

    const codeForm = useForm<CodeFormValues>({
        defaultValues: {
            code: "",
        },
    });

    const passwordForm = useForm<PasswordFormValues>({
        defaultValues: {
            newPassword: "",
            confirmPassword: "",
        },
    });

    const onEmailSubmit = (data: EmailFormValues) => {
        console.log("Email submitted:", data.email);
        setSubmittedEmail(data.email);
        // Add your API call to send reset code here
        setStep("code");
    };

    const onCodeSubmit = (data: CodeFormValues) => {
        console.log("Code submitted:", data.code);
        setVerifiedCode(data.code);
        // Add your API call to verify code here
        setStep("password");
    };

    const onPasswordSubmit = (data: PasswordFormValues) => {
        if (data.newPassword !== data.confirmPassword) {
            passwordForm.setError("confirmPassword", {
                type: "manual",
                message: t("auth.register.passwordsDoNotMatch"),
            });
            return;
        }
        console.log("Password reset submitted:", { email: submittedEmail, code: verifiedCode, ...data });
        // Add your API call to reset password here
        navigate("/login");
    };

    const handleResendCode = () => {
        console.log("Resending code to:", submittedEmail);
        // Add your API call to resend code here
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#02071C]">
            <div className="w-full max-w-md space-y-6">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <a href="/" className="transition-transform hover:scale-105">
                        <img src="/src/assets/platfun-logo.svg" className="h-12" alt="platfun Logo" />
                    </a>
                </div>

                {/* Card */}
                <Card className="border-0 rounded-2xl shadow-2xl bg-[#0A0F24] shadow-[#000060]">
                    <CardHeader className="space-y-2 text-center pb-6 pt-8">
                        <CardTitle className="text-3xl font-bold tracking-tight text-white">
                            {step === "email" && t("auth.forgotPassword.title")}
                            {step === "code" && t("auth.forgotPassword.verifyCode")}
                            {step === "password" && t("auth.forgotPassword.resetPassword")}
                        </CardTitle>
                        <p className="text-sm text-gray-400">
                            {step === "email" && t("auth.forgotPassword.enterEmailForCode")}
                            {step === "code" && t("auth.forgotPassword.codeSentTo", { email: submittedEmail })}
                            {step === "password" && t("auth.forgotPassword.createNewPassword")}
                        </p>
                    </CardHeader>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center px-6">
                            <div className="bg-[#E5E5E5] h-[0.5px] w-full"></div>
                        </div>
                    </div>
                    <CardContent className="space-y-6 pt-6 pb-8">
                        {step === "email" && (
                            <Form {...emailForm}>
                                <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
                                    {/* Email Field */}
                                    <FormField
                                        control={emailForm.control}
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
                                                <Label htmlFor="email" className="text-sm font-medium text-[#CBD5E1]">
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
                                                <FormMessage className="text-xs text-[#FF6B6B]" />
                                            </FormItem>
                                        )}
                                    />

                                    <Button type="submit" className="w-full h-9 font-semibold text-white rounded-lg bg-[#5865F2] hover:bg-[#4452bb] mt-6 hover:cursor-pointer hover:scale-105 transition-transform duration-300 ease-out">
                                        {t("auth.forgotPassword.sendResetCode")}
                                    </Button>
                                </form>
                            </Form>
                        )}

                        {step === "code" && (
                            <Form {...codeForm}>
                                <form onSubmit={codeForm.handleSubmit(onCodeSubmit)} className="space-y-4">
                                    {/* Verification Code Field */}
                                    <FormField
                                        control={codeForm.control}
                                        name="code"
                                        rules={{
                                            required: t("auth.forgotPassword.codeRequired"),
                                            minLength: {
                                                value: 6,
                                                message: t("auth.forgotPassword.codeMinLength"),
                                            },
                                            maxLength: {
                                                value: 6,
                                                message: t("auth.forgotPassword.codeMaxLength"),
                                            }
                                        }}
                                        render={({ field }) => {
                                            const handleChange = (index: number, value: string) => {
                                                const code = field.value.split('');
                                                code[index] = value;
                                                field.onChange(code.join(''));
                                                
                                                // Move to next input if value is entered
                                                if (value && index < 5) {
                                                    const nextInput = document.getElementById(`code-${index + 1}`);
                                                    nextInput?.focus();
                                                }
                                            };

                                            const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
                                                if (e.key === 'Backspace' && !field.value[index] && index > 0) {
                                                    const prevInput = document.getElementById(`code-${index - 1}`);
                                                    prevInput?.focus();
                                                }
                                            };

                                            const handlePaste = (e: React.ClipboardEvent) => {
                                                e.preventDefault();
                                                const pastedData = e.clipboardData.getData('text').slice(0, 6);
                                                field.onChange(pastedData);
                                            };

                                            return (
                                                <FormItem>
                                                    <Label className="text-sm font-medium text-[#CBD5E1]">
                                                        {t("auth.forgotPassword.verificationCode")}
                                                    </Label>
                                                    <FormControl>
                                                        <div className="flex gap-2 justify-center">
                                                            {[0, 1, 2, 3, 4, 5].map((index) => (
                                                                <Input
                                                                    key={index}
                                                                    id={`code-${index}`}
                                                                    type="text"
                                                                    maxLength={1}
                                                                    value={field.value[index] || ''}
                                                                    onChange={(e) => handleChange(index, e.target.value)}
                                                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                                                    onPaste={index === 0 ? handlePaste : undefined}
                                                                    className="w-12 h-12 text-center text-xl font-bold rounded-lg border-2 border-[#1E293B] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#00E5FF] bg-[#040C26] text-white"
                                                                />
                                                            ))}
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage className="text-xs text-[#FF6B6B]" />
                                                </FormItem>
                                            );
                                        }}
                                    />

                                    <Button type="submit" className="w-full h-9 font-semibold text-white rounded-lg bg-[#5865F2] hover:bg-[#4452bb] hover:cursor-pointer hover:scale-105 transition-transform duration-300 ease-out mt-6">
                                        {t("auth.forgotPassword.verifyCodeButton")}
                                    </Button>

                                    {/* Resend Code */}
                                    <div className="text-center gap-1 flex justify-center items-center">
                                        <span className="text-sm text-[#A1A1AA]">{t("auth.forgotPassword.didntReceiveCode")}</span>
                                        <button
                                            type="button"
                                            onClick={handleResendCode}
                                            className="text-sm text-[#00E5FF] hover:underline hover:text-white"
                                        >
                                            {t("auth.forgotPassword.resend")}
                                        </button>
                                    </div>
                                </form>
                            </Form>
                        )}

                        {step === "password" && (
                            <Form {...passwordForm}>
                                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                                    {/* New Password Field */}
                                    <FormField
                                        control={passwordForm.control}
                                        name="newPassword"
                                        rules={{
                                            required: t("auth.forgotPassword.newPasswordRequired"),
                                            minLength: {
                                                value: 8,
                                                message: t("auth.login.passwordMinLength"),
                                            },
                                        }}
                                        render={({ field }) => (
                                            <FormItem>
                                                <Label htmlFor="newPassword" className="text-sm font-medium text-[#CBD5E1]">
                                                    {t("auth.forgotPassword.newPassword")}
                                                </Label>
                                                <FormControl>
                                                    <Input
                                                        id="newPassword"
                                                        type="password"
                                                        placeholder={t("auth.forgotPassword.newPasswordPlaceholder")}
                                                        className="h-9 w-full rounded-lg border-2 border-[#1E293B] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#00E5FF] bg-[#040C26] text-white"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-xs text-[#FF6B6B]" />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Confirm Password Field */}
                                    <FormField
                                        control={passwordForm.control}
                                        name="confirmPassword"
                                        rules={{
                                            required: t("auth.register.confirmPasswordRequired"),
                                        }}
                                        render={({ field }) => (
                                            <FormItem>
                                                <Label htmlFor="confirmPassword" className="text-sm font-medium text-[#CBD5E1]">
                                                    {t("auth.forgotPassword.confirmNewPassword")}
                                                </Label>
                                                <FormControl>
                                                    <Input
                                                        id="confirmPassword"
                                                        type="password"
                                                        placeholder={t("auth.forgotPassword.confirmNewPassword")}
                                                        className="h-9 w-full rounded-lg border-2 border-[#1E293B] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#00E5FF] bg-[#040C26] text-white"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-xs text-[#FF6B6B]" />
                                            </FormItem>
                                        )}
                                    />

                                    <Button type="submit" className="w-full h-9 font-semibold text-white rounded-lg bg-[#5865F2] hover:bg-[#4452bb] hover:cursor-pointer hover:scale-105 transition-transform duration-300 ease-out mt-6">
                                        {t("auth.forgotPassword.resetPasswordButton")}
                                    </Button>
                                </form>
                            </Form>
                        )}
                    </CardContent>
                </Card>

                {/* Back to Login Link */}
                <p className="text-center text-sm text-[#A1A1AA]">
                    {t("auth.forgotPassword.rememberPassword")}{" "}
                    <a href="/login" className="font-semibold text-[#00E5FF] hover:underline hover:text-white transition-colors">
                        {t("auth.forgotPassword.backToLogin")}
                    </a>
                </p>
            </div>
        </div>
    );
}
