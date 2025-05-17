import { Footer } from "@/components/common/Footer";
import { Logo } from "@/components/common/Logo";
import { Divider } from "@/components/common/Divider";
import { EmailLoginForm } from "@/components/login/EmailLoginForm";
import { OAuthButton } from "@/components/login/OAuthButton";
import { useAuthStore } from "@/store/useAuthStore";
import { FaDiscord } from "react-icons/fa";

export default function LoginPage() {
  const loginWithDiscord = useAuthStore((state) => state.loginWithDiscord);
  const error = useAuthStore((state) => state.error);
  return (
    <div className="pt-6 pb-6 flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      {/* Logo et branding */}
      <Logo />

      {/* Card de login */}
      <div className="w-full max-w-md space-y-6 rounded-xl border border-gray-200 bg-white p-8 shadow-lg dark:border-gray-700 dark:bg-gray-800">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Bienvenue
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
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
            <div className="mt-2 rounded-md bg-red-50 p-2 text-center text-sm text-red-500 dark:bg-red-900/20 dark:text-red-400">
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
