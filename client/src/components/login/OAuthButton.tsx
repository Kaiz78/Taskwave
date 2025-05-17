
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

// Type for provider config
type ProviderConfig = {
  bgColor: string;
  hoverColor: string;
  darkBgColor: string;
  darkHoverColor: string;
  textColor?: string;
  borderColor?: string;
};

// Configurations des providers OAuth
const PROVIDERS_CONFIG: Record<string, ProviderConfig> = {
  discord: {
    bgColor: "bg-[#5865F2]",
    hoverColor: "hover:bg-[#4752c4]",
    darkBgColor: "dark:bg-[#5865F2]/90",
    darkHoverColor: "dark:hover:bg-[#5865F2]",
  },
  google: {
    bgColor: "bg-white",
    hoverColor: "hover:bg-gray-50",
    darkBgColor: "dark:bg-gray-700",
    darkHoverColor: "dark:hover:bg-gray-600",
    textColor: "text-gray-800",
    borderColor: "border border-gray-300",
  },
  github: {
    bgColor: "bg-gray-900",
    hoverColor: "hover:bg-gray-800",
    darkBgColor: "dark:bg-gray-800",
    darkHoverColor: "dark:hover:bg-gray-700",
  },
};

type ProviderType = keyof typeof PROVIDERS_CONFIG;

interface OAuthButtonProps {
  provider: ProviderType;
  label: string;
  icon: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function OAuthButton({
  provider,
  label,
  icon,
  onClick,
  className,
}: OAuthButtonProps) {
  const config = PROVIDERS_CONFIG[provider] || PROVIDERS_CONFIG.discord;

  const buttonClasses = cn(
    "flex w-full items-center justify-center gap-2 py-6 text-base font-medium",
    config.bgColor,
    config.hoverColor,
    config.darkBgColor,
    config.darkHoverColor,
    config.textColor || "text-white",
    config.borderColor || "",
    className
  );

  return (
    <Button
      className={buttonClasses}
      size="lg"
      onClick={onClick || (() => console.log(`Login with ${provider}`))}
    >
      {icon}
      {label}
    </Button>
  );
}
