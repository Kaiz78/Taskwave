import { createClient } from 'redis';
import { config } from '../config/env';

// Configuration du client Redis
const redisClient = createClient({
  url: `redis://${config.redisHost}:${config.redisPort}`,
});

// Connexion à Redis
(async () => {
  try {
    await redisClient.connect();
    console.log('Connecté à Redis avec succès');
  } catch (err) {
    console.error('Erreur de connexion à Redis:', err);
  }
})();

// Gestion des erreurs de connexion
redisClient.on('error', (err) => {
  console.error('Erreur Redis:', err);
});

// Fonction pour stocker un token dans la liste noire avec un TTL
export const blacklistToken = async (token: string, expiresIn: number): Promise<void> => {
  try {
    // Nous utilisons le token lui-même comme clé pour éviter les collisions
    await redisClient.setEx(`blacklist:${token}`, expiresIn, 'blacklisted');
  } catch (error) {
    console.error('Erreur lors du blacklisting du token:', error);
    throw error;
  }
};

// Fonction pour vérifier si un token est dans la liste noire
export const isTokenBlacklisted = async (token: string): Promise<boolean> => {
  try {
    const result = await redisClient.get(`blacklist:${token}`);
    return result !== null;
  } catch (error) {
    console.error('Erreur lors de la vérification du token blacklisté:', error);
    // En cas d'erreur, nous préférons être prudents et considérer le token comme valide
    // pour éviter de bloquer l'accès à l'utilisateur
    return false;
  }
};

export default redisClient;
