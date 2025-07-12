// API service for authentication

// API Base URL - à remplacer par la valeur réelle de votre environnement
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Service pour l'authentification
 */
export const authService = {


  /**
   * Redirige vers l'authentification Discord
   */
  discordLogin() {
    console.log(API_BASE_URL);
    // Rediriger vers l'endpoint d'authentification Discord du serveur
    window.location.href = `${API_BASE_URL}/auth/discord`;
  },

  /**
   * Récupère le token JWT de l'URL de callback après authentification
   */
  getTokenFromCallback() {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token');
    const error = queryParams.get('error');

    return { token, error };
  },

  /**
   * Récupère le profil utilisateur
   * @param token JWT token
   */
  async getProfile(token: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Échec de la récupération du profil');
      }


      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      throw error;
    }
  },
  
  /**
   * Supprime le compte utilisateur et toutes les données associées
   * @param token JWT token
   */
  async deleteAccount(token: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/account`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Échec de la suppression du compte');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la suppression du compte:', error);
      throw error;
    }
  },

  /**
   * Échange le code d'autorisation contre un token JWT
   * @param code Code d'autorisation reçu après l'authentification Discord
   */
  async exchangeCodeForToken(code: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/exchange-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de l\'échange du code');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de l\'échange du code:', error);
      throw error;
    }
  }
};