// filepath: /home/amine/git/aletwork/Taskwave/client/src/pages/Settings.tsx
import { Button } from "@/components/ui/button";
import { FaSignOutAlt, FaTrash } from "react-icons/fa";
import { CommonModal } from "@/components/common/CommonModal";
import useSettings from "@/hooks/useSettings";

function SettingsPage() {
  const {
    user,
    email,
    avatarUrl,
    isDeleteModalOpen,
    isDeleting,
    handleLogout,
    handleDeleteAccount,
    openDeleteModal,
    closeDeleteModal,
  } = useSettings();

  // Contenu du modal de suppression de compte
  const deleteAccountModalContent = (
    <>
      <div className="py-2">
        <p className="text-red-500 dark:text-red-400 font-semibold">
          Toutes vos données seront supprimées :
        </p>
        <ul className="list-disc list-inside mt-2 text-muted-foreground space-y-2">
          <li>Tous vos tableaux</li>
          <li>Toutes vos colonnes</li>
          <li>Toutes vos tâches</li>
          <li>Votre profil utilisateur</li>
        </ul>
      </div>
    </>
  );

  // Footer personnalisé pour le modal
  const deleteModalFooter = (
    <>
      <Button
        variant="outline"
        onClick={closeDeleteModal}
        disabled={isDeleting}
      >
        Annuler
      </Button>
      <Button
        variant="destructive"
        onClick={handleDeleteAccount}
        disabled={isDeleting}
      >
        {isDeleting ? "Suppression en cours..." : "Confirmer la suppression"}
      </Button>
    </>
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold">Paramètres du compte</h1>
        <p className="text-muted-foreground">
          Gérez les informations et les préférences de votre compte
        </p>
      </div>

      <div className="rounded-md border bg-card p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Votre profil</h2>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-2">
          {avatarUrl && (
            <img
              src={avatarUrl}
              alt={user || "Avatar utilisateur"}
              className="w-24 h-24 rounded-full"
            />
          )}

          <div>
            <p className="text-lg font-medium">{user}</p>
            <p className="text-muted-foreground">{email}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Connecté via Discord
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-md border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4 text-red-600 dark:text-red-400">
          Zone de danger
        </h2>
        <p className="text-muted-foreground mb-4">
          Les actions suivantes sont irréversibles. Soyez prudent.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex items-center"
          >
            <FaSignOutAlt className="mr-2" />
            Se déconnecter
          </Button>

          <Button
            variant="destructive"
            onClick={openDeleteModal}
            className="flex items-center"
          >
            <FaTrash className="mr-2" />
            Supprimer le compte
          </Button>
        </div>
      </div>

      {/* Modal de confirmation de suppression de compte en utilisant CommonModal */}
      <CommonModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        title="Supprimer votre compte"
        description="Cette action supprimera définitivement votre compte et toutes vos données associées. Cette action est irréversible."
        footerContent={deleteModalFooter}
      >
        {deleteAccountModalContent}
      </CommonModal>
    </div>
  );
}

export default SettingsPage;
