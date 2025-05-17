# Taskwave - Setup du Projet

## Configuration Initiale

Le démarrage du projet Taskwave a nécessité la mise en place d'une infrastructure robuste et modulaire. Cette section décrit le processus d'installation, la configuration et l'architecture technique du projet.

## Installation du Projet

### Prérequis

Pour exécuter Taskwave localement, les outils suivants sont nécessaires :

- Node.js (v16+)
- Docker et Docker Compose
- Git

### Étapes d'Installation

1. **Clonage du dépôt** :

   ```bash
   git clone https://github.com/aletwork/Taskwave.git
   cd Taskwave
   ```


2. **Configuration des variables d'environnement** :

   - Copier les fichiers `.env.example` en `.env` dans les dossiers client et server
   - Configurer les variables d'environnement appropriées (clés API, connexion à la base de données, etc.)

3. **Démarrage avec Docker Compose** :
   ```bash
   cd ..
   docker-compose up
   ```

## Architecture Docker

L'architecture de Taskwave est basée sur des conteneurs Docker pour faciliter le développement, les tests et le déploiement. Docker isole chaque composant de l'application dans son propre environnement, garantissant ainsi la cohérence entre les différentes machines et environnements.

### Docker Compose

Le fichier `docker-compose.yml` coordonne les différents services :

```yaml
version: "3.8"

services:
  # Frontend React
  client:
    build:
      context: ./client/docker
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    volumes:
      - ./client:/app
      - /app/node_modules
    depends_on:
      - server
    environment:
      - VITE_API_URL=http://localhost:5000/api

  # Backend Node.js
  server:
    build:
      context: ./server/docker
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
    volumes:
      - ./server:/app
      - /app/node_modules
    depends_on:
      - mongo
    environment:
      - DATABASE_URL=mongodb://mongo:27017/taskwave
      - PORT=5000
      - NODE_ENV=development

  # Base de données MongoDB
  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
      - ./mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js:ro

volumes:
  mongo_data:
```

### Dockerfiles

#### Client (Frontend)

Le `Dockerfile` pour le client (React/TypeScript) :

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY ./entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/entrypoint.sh"]
```

Avec un script d'entrée pour garantir l'installation des dépendances :

```bash
#!/bin/sh

# Installation des dépendances si node_modules n'existe pas
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Démarrer le serveur de développement
echo "Starting development server..."
npm run dev -- --host 0.0.0.0
```

#### Server (Backend)

Le `Dockerfile` pour le serveur (Node.js/Express) :

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY ./entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 5000

ENTRYPOINT ["/entrypoint.sh"]
```

Avec un script d'entrée similaire :

```bash
#!/bin/sh

# Installation des dépendances si node_modules n'existe pas
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Génération du client Prisma
npx prisma generate

# Démarrer le serveur en mode développement
echo "Starting development server..."
npm run dev
```

## Structure du Projet

### Arborescence Frontend (client)

```
client/
├── components.json       # Configuration des composants Shadcn/UI
├── eslint.config.js      # Configuration ESLint
├── index.html            # Page HTML principale
├── package.json          # Dépendances et scripts npm
├── tsconfig.json         # Configuration TypeScript
├── vite.config.ts        # Configuration Vite
├── public/               # Fichiers statiques
└── src/
    ├── assets/           # Images, polices et autres ressources
    ├── components/       # Composants React réutilisables
    │   ├── common/       # Composants génériques
    │   ├── login/        # Composants liés à l'authentification
    │   └── ui/           # Composants d'interface utilisateur
    ├── constants/        # Constantes de l'application
    ├── hooks/            # Hooks React personnalisés
    ├── lib/              # Bibliothèques et utilitaires
    ├── pages/            # Composants de pages
    ├── services/         # Services API
    ├── store/            # Gestion de l'état global (Zustand)
    ├── types/            # Types TypeScript
    └── utils/            # Fonctions utilitaires
    └── main.tsx         # Point d'entrée de l'application
    └── Router.tsx          # Gestion des routes
    
```

### Arborescence Backend (server)

```
server/
├── package.json          # Dépendances et scripts npm
├── tsconfig.json         # Configuration TypeScript
├── prisma/
│   └── schema.prisma     # Schéma de la base de données Prisma
└── src/
    ├── server.ts         # Point d'entrée de l'application
    ├── config/           # Configuration de l'application
    ├── controllers/      # Contrôleurs des routes
    ├── middleware/       # Middleware Express
    ├── routes/           # Définition des routes API
    ├── services/         # Services métier
    └── utils/            # Fonctions utilitaires
```

## Schéma de la Base de Données

Taskwave utilise MongoDB comme base de données, structurée avec Prisma pour garantir la cohérence des données et faciliter les requêtes.

Voici le schéma Prisma principal :

```prisma
// Schema Prisma pour MongoDB

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id         String    @id @default(auto()) @map("_id") @db.ObjectId
  name       String
  email      String    @unique
  avatarUrl  String?
  provider   Provider  @default(DISCORD)
  boards     Board[]   @relation("BoardOwner")
  tasks      Task[]    @relation("TaskAssignee")
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt
}

model Board {
  id          String    @id @default(auto()) @map("_id") @db.ObjectId
  title       String
  description String?
  owner       User      @relation("BoardOwner", fields: [ownerId], references: [id])
  ownerId     String    @db.ObjectId
  columns     Column[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Column {
  id        String    @id @default(auto()) @map("_id") @db.ObjectId
  title     String
  order     Int
  board     Board     @relation(fields: [boardId], references: [id], onDelete: Cascade)
  boardId   String    @db.ObjectId
  tasks     Task[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model Task {
  id          String    @id @default(auto()) @map("_id") @db.ObjectId
  title       String
  description String?
  priority    Priority  @default(MEDIUM)
  assignee    User?     @relation("TaskAssignee", fields: [assigneeId], references: [id])
  assigneeId  String?   @db.ObjectId
  column      Column    @relation(fields: [columnId], references: [id], onDelete: Cascade)
  columnId    String    @db.ObjectId
  dueDate     DateTime?
  order       Int
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

enum Provider {
  DISCORD
  LOCAL
}

enum Priority {
  LOW
  MEDIUM
  HIGH
  URGENT
}
```

Ce schéma illustre les relations principales entre les utilisateurs, les tableaux kanban (boards), les colonnes et les tâches. Il permet :

- L'attribution de tâches aux utilisateurs
- L'organisation des tâches en colonnes
- La gestion des priorités et des dates d'échéance
- Le suivi des relations de propriété

## Communication entre les Services

La communication entre le frontend et le backend s'effectue via des API RESTful. Le client envoie des requêtes HTTP au serveur, qui traite ces requêtes et renvoie les réponses appropriées.

L'API est organisée selon le principe des contrôleurs RESTful, avec des points de terminaison pour les principales entités :

- `/api/auth` : Authentification et gestion des utilisateurs
- `/api/boards` : Gestion des tableaux
- `/api/columns` : Gestion des colonnes
- `/api/tasks` : Gestion des tâches

## Conclusion

La configuration de ce projet suit les meilleures pratiques modernes de développement web :

- Architecture en microservices avec Docker
- Séparation claire entre frontend et backend
- Base de données avec un schéma bien défini
- Outils de développement modernes facilitant la maintenance

Cette architecture offre plusieurs avantages :

- **Isolation** : Les problèmes dans un service n'affectent pas les autres
- **Scalabilité** : Chaque service peut évoluer indépendamment
- **Développement parallèle** : Les équipes peuvent travailler simultanément sur différentes parties
- **Facilité de déploiement** : L'utilisation de Docker simplifie le déploiement dans différents environnements
