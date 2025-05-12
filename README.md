# TaskWave



> Une application Kanban open-source pour organiser ses projets de manière visuelle, avec gestion de boards, colonnes, tâches et fonctionnalités drag & drop.

## 📋 Table des matières

- [À propos](#à-propos)
- [Architecture](#architecture)
- [Stack technique](#stack-technique)
- [Fonctionnalités](#fonctionnalités)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Configuration de MongoDB](#configuration-de-mongodb)
- [API Documentation](#api-documentation)
- [Feuille de route](#feuille-de-route)
- [Contribuer](#contribuer)
- [Licence](#licence)

## 🚀 À propos

TaskWave est une application de gestion de projets de type Kanban qui vous permet d'organiser vos tâches de manière visuelle et intuitive. Le projet est construit avec une architecture moderne et évolutive.

### Objectifs du projet

- Démontrer une architecture fullstack propre (React + Node.js + MongoDB)
- Offrir une expérience utilisateur fluide et intuitive
- Proposer un socle facilement extensible pour d'autres projets
- Montrer mon expertise technique dans un contexte build-in-public

## 🏗️ Architecture

L'application est construite sur une architecture microservices avec trois composants principaux:

1. **Client (Frontend)**: Application React responsive
2. **Serveur (Backend)**: API RESTful avec Express
3. **Base de données**: MongoDB avec réplication

### Architecture générale

client/ (React)
server/ (Express + Node.js)
  docker/ (Docker + Docker Compose)
  src/ (Code source)
    config/ (Configuration de l'application)
    controllers/ (Logique métier)
    middlewares/ (Middleware de sécurité)
    routes/ (Routes API)
    services/ (Services externes)
    utils/ (Fonctions utilitaires)
    server.ts (Point d'entrée de l'application)
  prisma/ (Prisma ORM)
    schema.prisma (Schéma de la base de données)
  .env (Variables d'environnement)
.env
docker-compose.yml
mongo-init.js
README.md

## 💻 Stack technique

### Frontend

- **Framework**: React + TypeScript
- **Build**: Vite
- **State Management**: Zustand
- **Styling**: TailwindCSS
- **Drag & Drop**: @dnd-kit/core

### Backend

- **Framework**: Node.js + Express + TypeScript
- **ORM**: Prisma
- **Authentication**: OAuth2 (Discord)
- **Architecture**: MVC Pattern

### Base de données

- **Type**: MongoDB (NoSQL)
- **Réplication**: ReplicaSet (rs0)

### Infrastructure

- **Conteneurisation**: Docker + Docker Compose
- **Environnement**: Variables d'environnement personnalisables

## 🔥 Fonctionnalités

### MVP (Version actuelle)

- ✅ Authentification via Discord
- ✅ Création de boards personnalisés
- ✅ Création de colonnes (To do, In Progress, Done…)
- ✅ Ajout, modification et suppression de tâches
- ✅ Drag & drop entre colonnes
- ✅ Sauvegarde en base de données
- ✅ Responsive design

### Roadmap

- 🔜 Multi-utilisateur (inviter des membres sur un board)
- 🔜 Notifications
- 🔜 Délais / deadlines
- 🔜 Génération automatique de tâches via IA (ChatGPT)
- 🔜 Intégration calendrier
- 🔜 Authentification email / mot de passe

## 📦 Installation

### Prérequis

- Docker et Docker Compose
- Git

### Cloner le dépôt

```bash
git clone git@github.com:AletWork/Taskwave.git
cd Taskwave
```

### Lancement avec Docker Compose

```bash
# Créer les fichiers d'environnement
cp client/.env.example client/.env
cp server/.env.example server/.env

# Modifier les variables d'environnement selon vos besoins

# Lancer l'application
docker-compose up -d
```

L'application sera disponible aux adresses:

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- MongoDB: localhost:27018

## 🖱️ Utilisation

### Interface Kanban

1. **Connexion**: Authentifiez-vous via Discord
2. **Boards**: Créez un nouveau board ou sélectionnez un existant
3. **Colonnes**: Ajoutez différentes colonnes pour organiser votre flux de travail
4. **Tâches**: Créez des tâches avec titre, description et priorité
5. **Organisation**: Déplacez les tâches entre les colonnes par glisser-déposer

### Mode développement

Pour travailler sur le projet localement avec hot-reloading:

```bash
# Frontend (client)
cd client
npm install
npm run dev

# Backend (server)
cd server
npm install
npm run dev
```

## 🔧 Configuration de MongoDB

Pour initialiser le replica set MongoDB (nécessaire pour Prisma):

```bash
# Accéder au shell MongoDB
docker exec -it taskwave_mongodb mongosh

# Vérifier le statut du replica set
rs.status()

# Si besoin, initialiser le replica set
rs.initiate({
  _id: "rs0",
  members: [{ _id: 0, host: "localhost:27017" }]
})
```


## 🛣️ Feuille de route

Voir la section [Fonctionnalités](#fonctionnalités) pour les futures évolutions prévues.

## 🤝 Contribuer

Les contributions sont les bienvenues ! Pour contribuer:

1. Forkez le projet
2. Créez votre branche (`git checkout -b feature/amazing-feature`)
3. Committez vos changements (`git commit -m 'Ajout d'une fonctionnalité'`)
4. Poussez vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une Pull Request

### Standards de code

- TypeScript strict mode
- ESLint + Prettier
- Tests unitaires et d'intégration

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](server/LICENSE) pour plus de détails.
