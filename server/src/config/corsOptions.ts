import { CorsOptions } from 'cors';

const corsOptions: CorsOptions = {
  origin: process.env.CLIENT_URL || '*', // Autorise uniquement le domaine spécifié ou tous si non défini
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Méthodes HTTP autorisées
  allowedHeaders: ['Content-Type', 'Authorization'], // En-têtes autorisés
  credentials: true, // Autorise l'envoi de cookies
};

export default corsOptions;