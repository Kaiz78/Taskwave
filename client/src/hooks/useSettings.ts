import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

export function useSettings() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const deleteAccount = useAuthStore((state) => state.deleteAccount);
  const user = useAuthStore((state) => state.user);
  const email = useAuthStore((state) => state.email);
  const avatarUrl = useAuthStore((state) => state.avatarUrl);
  
  // États pour le modal de suppression
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fonction pour gérer la déconnexion
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Fonction pour ouvrir/fermer le modal de suppression
  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  // Fonction pour gérer la suppression du compte
  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const success = await deleteAccount();
      if (success) {
        toast.success(
          "Votre compte et toutes vos données ont été supprimés avec succès."
        );
        navigate("/login");
      } else {
        toast.error(
          "Une erreur est survenue lors de la suppression du compte."
        );
      }
    } catch {
      toast.error("Une erreur est survenue lors de la suppression du compte.");
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  return {
    user,
    email,
    avatarUrl,
    isDeleteModalOpen,
    isDeleting,
    handleLogout,
    handleDeleteAccount,
    openDeleteModal,
    closeDeleteModal
  };
}

export default useSettings;