// filepath: /home/amine/git/aletwork/Taskwave/client/src/pages/AuthCallback.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/useAuthStore";

export default function AuthCallback() {
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);
  const setError = useAuthStore((state) => state.setError);
  const fetchUserProfile = useAuthStore((state) => state.fetchUserProfile);

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Récupérer le code d'autorisation ou l'erreur depuis l'URL
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      const error = urlParams.get("error");

      // Si une erreur est présente, la stocker et rediriger vers la page de login
      if (error) {
        console.error(`Erreur d'authentification: ${error}`);
        setError(`Échec de l'authentification: ${error}`);
        navigate("/login");
        return;
      }

      // Si le code d'autorisation est présent, l'échanger contre le token
      if (code) {
        try {
          // Échanger le code contre le token via l'API
          const response = await authService.exchangeCodeForToken(code);

          if (response.success && response.data.token) {
            setToken(response.data.token);

            // Récupérer les informations de l'utilisateur
            await fetchUserProfile();

            // Rediriger vers la page principale
            navigate("/");
          } else {
            setError("Erreur lors de l'échange du code d'autorisation");
            navigate("/login");
          }
        } catch (err: unknown) {
          console.error(
            "Erreur lors de l'échange du code d'autorisation:",
            err
          );
          setError("Erreur lors de l'authentification");
          // navigate("/login");
        }
      } else {
        // Si pas de code ni d'erreur, c'est une situation inattendue
        setError("Pas de code d'autorisation reçu");
        navigate("/login");
      }
    };

    handleAuthCallback();
  }, [navigate, setToken, setError, fetchUserProfile]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="w-full max-w-md rounded-md border bg-card p-8 text-center">
        <h1 className="text-2xl font-bold">Authentification en cours...</h1>
        <p className="mt-2 text-muted-foreground">
          Veuillez patienter pendant que nous finalisons votre connexion.
        </p>
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div className="h-full w-1/2 animate-[pulse_1.5s_infinite_ease-in-out] rounded-full bg-primary"></div>
        </div>
      </div>
    </div>
  );
}
