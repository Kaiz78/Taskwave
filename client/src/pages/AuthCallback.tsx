
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/api";
import { useAuthStore } from "@/store/useAuthStore";

export default function AuthCallback() {
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);
  const setError = useAuthStore((state) => state.setError);
  const fetchUserProfile = useAuthStore((state) => state.fetchUserProfile);

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Récupérer le token ou l'erreur depuis l'URL
      const { token, error } = authService.getTokenFromCallback();

      // Si une erreur est présente, la stocker et rediriger vers la page de login
      if (error) {
        console.error(`Erreur d'authentification: ${error}`);
        setError(`Échec de l'authentification: ${error}`);
        navigate("/login");
        return;
      }

      // Si le token est présent, le stocker et récupérer le profil utilisateur
      if (token) {
        setToken(token);
        try {
          // Récupérer les informations de l'utilisateur
          await fetchUserProfile();

          // Rediriger vers la page principale
          navigate("/");
        } catch (err: unknown) {
          console.error("Erreur lors de la récupération du profil utilisateur:", err);
          // En cas d'erreur, rediriger vers la page de login
          navigate("/login");
        }
      } else {
        // Si pas de token ni d'erreur, c'est une situation inattendue
        setError("Pas de token reçu de l'authentification");
        navigate("/login");
      }
    };

    handleAuthCallback();
  }, [navigate, setToken, setError, fetchUserProfile]);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Authentification en cours...</h1>
        <p className="mt-2 text-gray-600">
          Veuillez patienter pendant que nous finalisons votre connexion.
        </p>
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div className="h-full w-1/2 animate-[pulse_1.5s_infinite_ease-in-out] rounded-full bg-blue-500"></div>
        </div>
      </div>
    </div>
  );
}
