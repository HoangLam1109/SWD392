import { useTranslation } from "react-i18next"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Mail } from "lucide-react"
import { Link } from "react-router-dom"

const signInWithGoogle = () => {
    // Add your Google sign-in logic here
    console.log("Sign in with Google")
}

export default function InputInvalid() {
    const { t } = useTranslation();
    return (
        <>
            <div className="relative w-64 h-64 bg-gray-200">
                <div className="absolute inset-0 bg-black/40" />

            </div>
            <Button
                variant="outline"
                onClick={signInWithGoogle}
                className="
        w-full mb-4 flex items-center justify-center gap-2
        border-slate-700 bg-transparent text-white

        hover:bg-white/5

        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-cyan-400/70
        focus-visible:ring-offset-0
      "
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

            <Card className="w-[380px] text-center space-y-4">
                <Mail className="mx-auto h-10 w-10" />

                <h2 className="text-xl font-semibold">
                    {t("auth.temp.checkEmail")}
                </h2>

                <p className="text-sm text-muted-foreground">
                    {t("auth.temp.verificationSent")}
                </p>

                <Button disabled className="w-full">
                    {t("auth.temp.resendEmail")}
                </Button>

                <Link to="/login" className="text-sm underline">
                    {t("auth.temp.backToLogin")}
                </Link>
            </Card>

        </>
    )
}
