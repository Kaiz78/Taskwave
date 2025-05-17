import { useAuthStore } from "@/store/useAuthStore";

function App() {
  // Sélectionner individuellement chaque valeur pour éviter les re-rendus excessifs
  const username = useAuthStore((state) => state.user);
  const email = useAuthStore((state) => state.email);
  const avatarUrl = useAuthStore((state) => state.avatarUrl);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  console.log({ username, email, avatarUrl, isAuthenticated });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
      </div>
      <p>Bienvenue sur votre tableau de bord, {username || "Utilisateur"}</p>

      {/* Contenu de l'application ici */}
      <div className="mt-4 p-4 bg-white rounded-lg shadow dark:bg-gray-800">
        <h2 className="text-xl font-semibold mb-2">Votre profil</h2>
        {isAuthenticated && (
          <div className="flex items-center">
            {avatarUrl && (
              <img
                src={avatarUrl}
                alt={username || "Avatar utilisateur"}
                className="w-16 h-16 rounded-full mr-4"
              />
            )}
            <div>
              <p>
                <span className="font-medium">Nom:</span>{" "}
                {username || "Non spécifié"}
              </p>
              <p>
                <span className="font-medium">Email:</span>{" "}
                {email || "Non spécifié"}
              </p>
              <p>
                <span className="font-medium">Méthode de connexion:</span>{" "}
                {"Discord"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
