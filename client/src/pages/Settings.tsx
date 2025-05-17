import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function SettingsPage() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const username = useAuthStore((state) => state.user);
  const email = useAuthStore((state) => state.email);
  const avatarUrl = useAuthStore((state) => state.avatarUrl);

  // Fonction pour gérer la déconnexion
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Paramètres du compte</h1>

      <div className="bg-white rounded-lg shadow dark:bg-gray-800 p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Votre profil</h2>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
          {avatarUrl && (
            <img
              src={avatarUrl}
              alt={username || "Avatar utilisateur"}
              className="w-24 h-24 rounded-full"
            />
          )}

          <div>
            <p className="text-lg font-medium">{username}</p>
            <p className="text-gray-600 dark:text-gray-400">{email}</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              Connecté via Discord
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow dark:bg-gray-800 p-6">
        <h2 className="text-xl font-semibold mb-4 text-red-600 dark:text-red-400">
          Zone de danger
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Les actions suivantes sont irréversibles. Soyez prudent.
        </p>

        <Button
          variant="destructive"
          onClick={handleLogout}
          className="flex items-center"
        >
          <FaSignOutAlt className="mr-2" />
          Supprimer le compte
        </Button>
      </div>
    </div>
  );
}

export default SettingsPage;
