import { Footer } from "@/components/Footer";
import { Logo } from "@/components/common/Logo";
import { Divider } from "@/components/common/Divider";
import { EmailLoginForm } from "@/components/login/EmailLoginForm";
import { OAuthButton } from "@/components/login/OAuthButton";
import { useAuthStore } from "@/store/useAuthStore";
import { FaDiscord } from "react-icons/fa";

export default function LoginPage() {
  const VITE_API_URL = import.meta.env.VITE_API_URL;

  console.log(VITE_API_URL);
  const loginWithDiscord = useAuthStore((state) => state.loginWithDiscord);
  const error = useAuthStore((state) => state.error);
  return (
    <div className="mt-8 flex min-h-screen w-full flex-col items-center justify-center bg-background">
      {/* Logo et branding */}
      <Logo />

      {/* Card de login */}
      <div className="w-full max-w-md space-y-6 rounded-md border bg-card p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Bienvenue</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Connectez-vous pour accéder à votre espace de travail
          </p>
        </div>

        <div className="mt-6 space-y-6">
          {/* Discord Button */}
          <OAuthButton
            provider="discord"
            label="Se connecter avec Discord"
            icon={<FaDiscord className="h-5 w-5" />}
            onClick={() => {
              loginWithDiscord();
            }}
          />

          {/* Affichage des erreurs d'authentification */}
          {error && (
            <div className="mt-2 rounded-md bg-destructive/10 p-3 text-center text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Séparateur */}
          <Divider label="ou" />

          {/* Formulaire (bientôt disponible) */}
          <EmailLoginForm disabled={true} />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
