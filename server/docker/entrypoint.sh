#!/bin/bash

# npm install --no-audit --no-fund
npm install


# Génération du client Prisma
npx prisma generate

# Démarrer le serveur en mode développement
echo "Starting development server..."
npm run dev