import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import { cn } from "@/lib/utils";

const LANGUAGES = [
  { code: "vi", label: "Tiếng Việt" },
  { code: "en", label: "English" },
] as const;

interface LanguageSwitchButtonProps {
  className?: string;
}

export function LanguageSwitchButton({ className }: LanguageSwitchButtonProps) {
  const { i18n } = useTranslation();

  const currentLang = i18n.language?.startsWith("vi") ? "vi" : "en";
  const nextLang = currentLang === "vi" ? "en" : "vi";

  const handleSwitch = () => {
    i18n.changeLanguage(nextLang);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleSwitch}
      className={cn("gap-2", className)}
      aria-label={`Switch to ${LANGUAGES.find((l) => l.code === nextLang)?.label}`}
    >
      <Languages className="size-4" />
      <span>{LANGUAGES.find((l) => l.code === currentLang)?.label}</span>
    </Button>
  );
}
