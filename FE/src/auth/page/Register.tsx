import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { useRegister } from "@/hooks/auth/useRegister.ts";
import { useAuth } from "@/hooks/auth/useAuth.ts";
import { toast } from "sonner";
type FormValues = {
    email: string;
    password: string;
    confirmPassword: string;
    termsAccepted: boolean;
    fullName: string;
};

export default function RegisterPage() {
    const navigate = useNavigate();
    const { setUser } = useAuth();
    const { mutate: register, isPending, error } = useRegister();
    const form = useForm<FormValues>({
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
            termsAccepted: false,
            fullName: "",
        },
    });

    const handleRegister = async (data: FormValues) => {
        if (data.password !== data.confirmPassword) {
            form.setError("confirmPassword", {
                type: "manual",
                message: "Passwords do not match",
            });
            return;
        }
        register({ email: data.email, fullName: data.fullName, password: data.password }, {
            onSuccess: (res) => {
                toast.success("Account created successfully, please login to continue");
                setUser(res.user);
                navigate("/login");
            },
            onError: (error) => {
                toast.error(error.message);
            },
        });
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
                        <CardTitle className="text-3xl font-bold tracking-tight text-white">Create an account</CardTitle>
                        <p className="text-sm text-gray-400">
                            Register to get started
                        </p>
                    </CardHeader>

                    <CardContent className="pb-8">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleRegister)} className="space-y-5">
                                {/* Email Field */}
                                <FormField
                                    control={form.control}
                                    name="email"
                                    rules={{
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid email address",
                                        },
                                    }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label htmlFor="email" className="text-sm font-medium text-[#CBD5E1]">
                                                Email
                                            </Label>
                                            <FormControl>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    placeholder="Enter your email"
                                                    className="h-9 w-full rounded-lg border-2 border-[#1E293B] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#00E5FF] bg-[#040C26] text-white"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs text-[#FF6B6B]" />
                                        </FormItem>
                                    )}
                                />

                                {/* Full Name Field */}
                                <FormField
                                    control={form.control}
                                    name="fullName"
                                    rules={{
                                        required: "Full name is required",
                                    }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label htmlFor="fullName" className="text-sm font-medium text-[#CBD5E1]">
                                                Full Name
                                            </Label>
                                            <FormControl>
                                                <Input
                                                    id="fullName"
                                                    type="text"
                                                    placeholder="Enter your full name"
                                                    className="h-9 w-full rounded-lg border-2 border-[#1E293B] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#00E5FF] bg-[#040C26] text-white"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs text-[#FF6B6B]" />
                                        </FormItem>
                                    )}
                                />
                                {/* Password Field */}
                                <FormField
                                    control={form.control}
                                    name="password"
                                    rules={{
                                        required: "Password is required",
                                        
                                        minLength: {
                                            value: 8,
                                            message: "Password must be at least 8 characters",
                                        },
                                        validate: (value: string) => {
                                            const failed: string[] = [];
                                            if (!/[A-Z]/.test(value)) {
                                                failed.push("one uppercase letter");
                                            }
                                            if (!/[a-z]/.test(value)) {
                                                failed.push("one lowercase letter");
                                            }
                                            if (!/[!@#$%^&*(),.?\":{}|<>_\\\-\\\/[\]=;`~]/.test(value)) {
                                                failed.push("one special character");
                                            }
                                            if (failed.length > 0) {
                                                return `Password must contain at least ${failed.join(", ")}`;
                                            }
                                            return true;
                                        },
                                    }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label htmlFor="password" className="text-sm font-medium text-[#CBD5E1]">
                                                Password
                                            </Label>
                                            <FormControl>
                                                <Input
                                                    id="password"
                                                    type="password"
                                                    placeholder="Create a password"
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
                                    control={form.control}
                                    name="confirmPassword"
                                    rules={{
                                        required: "Please confirm your password",
                                    }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label htmlFor="confirmPassword" className="text-sm font-medium text-[#CBD5E1]">
                                                Confirm Password
                                            </Label>
                                            <FormControl>
                                                <Input
                                                    id="confirmPassword"
                                                    type="password"
                                                    placeholder="Confirm your password"
                                                    className="h-9 w-full rounded-lg border-2 border-[#1E293B] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#00E5FF] bg-[#040C26] text-white"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs text-[#FF6B6B]" />
                                        </FormItem>
                                    )}
                                />

                                {/* Terms & Conditions Checkbox */}
                                <FormField
                                    control={form.control}
                                    name="termsAccepted"
                                    rules={{
                                        required: "You must accept the terms and conditions",
                                    }}
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                            <FormControl>
                                                <Checkbox
                                                    className="cursor-pointer border-[#1E293B] data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-[#00E5FF] data-[state=checked]:to-[#7C4DFF] data-[state=checked]:border-0 mt-1"
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <Label className="text-sm font-normal cursor-pointer" style={{ color: '#A1A1AA' }}>
                                                    I agree to the{" "}
                                                    <a href="/terms-and-conditions" className="transition-colors underline" style={{ color: '#00E5FF' }}>
                                                        terms and conditions
                                                    </a>
                                                </Label>
                                                <FormMessage className="text-xs text-[#FF6B6B]" />
                                            </div>
                                        </FormItem>
                                    )}
                                />
                                {error && (
                                    <p className="text-xs text-[#FF6B6B]">{error.message}</p>
                                )}
                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    className="w-full h-9 font-semibold text-white rounded-lg bg-[#5865F2] hover:bg-[#4452bb] hover:cursor-pointer hover:scale-105 transition-transform duration-500 ease-out mt-6"
                                    disabled={isPending}
                                >
                                    {isPending ? "Creating account..." : "Create account"}
                                </Button>
                            </form>
                        </Form>

                        {/* Social Login Separator */}
                        <div className="relative mt-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="bg-[#E5E5E5] h-[0.5px] w-full"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-[#0A0F24] text-[#717182] px-2">
                                    Or
                                </span>
                            </div>
                        </div>

                        {/* Google Sign In */}
                        <div className="mt-6">
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
                                    <path fill="none" d="M0 0h48v48H0z" />
                                </svg>
                                <span>Continue with Google</span>
                            </Button>
                        </div>

                    </CardContent>
                </Card>

                {/* Login Link */}
                <p className="text-center text-sm text-[#A1A1AA]">
                    Already have an account?{" "}
                    <a
                        href="/login"
                        className="font-semibold transition-colors text-[#00E5FF] hover:underline hover:cursor-pointer hover:text-white"
                    >
                        Sign in
                    </a>
                </p>
            </div>
        </div>
    );
}
