import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import corsOptions from './config/corsOptions';

// Initialisation
const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Vérification de connexion à la base de données
prisma.$connect()
  .then(() => console.log('Connected to the database'))
  .catch((e:Error) => {
    console.error('Database connection failed:', e);
    process.exit(1);
  });

// Routes
app.get('/health', (_, res) => res.send('API is running'));


// Route 404
app.use((_, res) => {
  res.status(404).send('Route not found');
});

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Gestion de l'arrêt propre
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('Database disconnected');
  process.exit(0);
});

export { prisma };
