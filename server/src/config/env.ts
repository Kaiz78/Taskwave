import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

// Configuration
export const config = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'your-default-jwt-secret-key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
  environment: process.env.NODE_ENV || 'development',
  
  // Configuration Redis
  redisHost: process.env.REDIS_HOST || 'localhost',
  redisPort: parseInt(process.env.REDIS_PORT || '6379'),
  
  // Configuration OAuth Discord
  discordClientId: process.env.DISCORD_CLIENT_ID,
  discordClientSecret: process.env.DISCORD_CLIENT_SECRET,
  discordCallbackUrl: process.env.DISCORD_CALLBACK_URL,
};

// Vérifier les variables d'environnement critiques
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(env => !process.env[env]);

if (missingEnvVars.length > 0) {
  console.warn(`⚠️ Missing required environment variables: ${missingEnvVars.join(', ')}`);
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Missing required environment variables in production');
  }
}
