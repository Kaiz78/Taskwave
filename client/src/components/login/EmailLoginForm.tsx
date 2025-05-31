import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IoMail } from "react-icons/io5";
import { RiLockPasswordLine } from "react-icons/ri";

interface EmailLoginFormProps {
  disabled?: boolean;
  onSubmit?: (email: string, password: string, rememberMe: boolean) => void;
}

export function EmailLoginForm({
  disabled = false,
  onSubmit,
}: EmailLoginFormProps) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [rememberMe, setRememberMe] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit && !disabled) {
      onSubmit(email, password, rememberMe);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {disabled && (
        <div className="mt-1 text-center">
          <span className="text-xs font-medium text-amber-600 dark:text-amber-300 border-1 border-amber-600 dark:border-amber-300 rounded-md p-2 bg-amber-50 dark:bg-amber-900/20">
            Connexion par email/mot de passe bientôt disponible
          </span>
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <IoMail className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            id="email"
            type="email"
            className="pl-10 bg-gray-100 cursor-not-allowed hover:cursor-not-allowed"
            placeholder="Email"
            disabled={disabled}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <RiLockPasswordLine className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            id="password"
            type="password"
            className="pl-10 bg-gray-100 cursor-not-allowed hover:cursor-not-allowed"
            placeholder="Mot de passe"
            disabled={disabled}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 cursor-not-allowed hover:cursor-not-allowed"
            disabled={disabled}
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <Label
            htmlFor="remember-me"
            className="ml-2 text-gray-600 dark:text-gray-400 cursor-not-allowed"
          >
            Se souvenir de moi
          </Label>
        </div>
        <button
          type="button"
          className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 cursor-not-allowed hover:cursor-not-allowed"
          disabled={disabled}
        >
          Mot de passe oublié?
        </button>
      </div>

      <Button
        type="submit"
        className="mt-2 w-full py-6"
        variant="outline"
        size="lg"
        disabled={disabled}
      >
        Se connecter avec email
      </Button>
    </form>
  );
}
