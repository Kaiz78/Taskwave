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
  }
};