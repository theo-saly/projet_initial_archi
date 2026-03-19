# Kanban Project Manager — Architecture Microservices

Application de gestion de projet Kanban construite en **microservices** avec **Node.js**, **TypeScript**, **Express 5**, **Redis Streams** et **Docker Compose**.

Évolution d'une TodoList monolithique vers une architecture distribuée event-driven.

---

## Table des matières

1. [Architecture](#architecture)
2. [Services](#services)
3. [API](#api)
4. [Frontend](#frontend)
5. [Persistance](#persistance)
6. [Événements (Redis Streams)](#événements-redis-streams)
7. [Lancement](#lancement)
8. [Variables d'environnement](#variables-denvironnement)
9. [Tests](#tests)
   - [Tests unitaires (Jest)](#tests-unitaires-jest)
   - [Tests d'architecture](#tests-darchitecture)
   - [Tests E2E (Playwright)](#tests-e2e-playwright)
10. [Qualité de code](#qualité-de-code)
11. [ADR](#adr)
12. [Trello](#trello)

---

## Architecture

```
┌──────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   Frontend   │────▶│  project-service │────▶│   task-service   │
│  (Nginx)     │     │     :3002        │     │     :3003        │
│   :3000      │     └────────┬─────────┘     └────────┬─────────┘
│              │              │                        │
│              │────▶┌────────┴─────────┐              │
│              │     │   auth-service   │              │
│              │     │     :3001        │     ┌────────▼─────────┐
└──────────────┘     └──────────────────┘     │   Redis Streams  │
                                              │     :6379        │
                     ┌──────────────────┐     └────────┬─────────┘
                     │notification-serv.│◀─────────────┘
                     │     :3004        │  (écoute événements)
                     └──────────────────┘
```

### Communication inter-services

- **Synchrone (REST)** : le frontend appelle les services via le reverse-proxy Nginx ; le project-service appelle le task-service pour vérifier l'état des tâches avant clôture d'un projet.
- **Asynchrone (Redis Streams)** : le task-service et le project-service publient des événements, le notification-service les consomme et les écrit dans un fichier de log.

---

## Services

| Service | Port | Rôle | Base de données |
|---------|------|------|-----------------|
| **auth-service** | 3001 | Inscription, login JWT, suppression de compte | In-memory |
| **project-service** | 3002 | CRUD projets, clôture avec vérification des tâches | SQLite |
| **task-service** | 3003 | CRUD tâches, publication d'événements Redis | SQLite |
| **notification-service** | 3004 | Écoute événements Redis, écriture log, envoi e-mail SMTP | Fichier de log |
| **redis** | 6379 | Message broker (Redis Streams) | — |
| **frontend** | 3000 | Interface web (Nginx reverse-proxy + React CDN) | — |
| **mysql-tasks** | 3308 | Base MySQL pour les tâches *(profil `mysql`)* | MySQL 8 |
| **mysql-projects** | 3309 | Base MySQL pour les projets *(profil `mysql`)* | MySQL 8 |

---

## API

### Auth Service (`:3001`)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/auth/register` | Inscription (email, password, consent RGPD) |
| POST | `/auth/login` | Connexion — retourne un JWT |
| DELETE | `/auth/profile` | Suppression de compte (droit à l'oubli) |

### Project Service (`:3002`)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/projects` | Liste les projets de l'utilisateur |
| GET | `/projects/:id` | Détail d'un projet |
| POST | `/projects` | Crée un projet |
| PUT | `/projects/:id` | Met à jour / clôture / réouvre un projet |
| DELETE | `/projects/:id` | Supprime un projet |

> La clôture (`status: "cloturé"`) vérifie en REST synchrone que **toutes** les tâches du projet sont terminées. Si ce n'est pas le cas, la requête est rejetée (400).

### Task Service (`:3003`)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/tasks` | Liste toutes les tâches |
| GET | `/tasks/by-project?projectId=xxx` | Tâches d'un projet donné |
| POST | `/tasks` | Crée une tâche |
| PUT | `/tasks/:id` | Met à jour une tâche (status : `à faire` / `en cours` / `terminé`) |
| DELETE | `/tasks/:id` | Supprime une tâche |

### Notification Service (`:3004`)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/health` | Health check |

---

## Frontend

| Aspect | Détail |
|--------|--------|
| **Runtime** | React 19 (CDN) + Babel standalone (pas de build) |
| **Serveur** | Nginx Alpine (reverse-proxy + fichiers statiques) |
| **Routing** | SPA avec `window.history.pushState` (`/login`, `/register`, `/projects`, `/projects/:id`) |
| **Auth** | JWT stocké dans `localStorage`, user ID décodé côté client |
| **Pages** | `LoginPage`, `RegisterPage`, `DashboardPage`, `ProjectPage` |
| **Composants** | `App`, `AuthCard`, `TodoListCard` |
| **Utilitaires** | `navigation.js` — `buildHeaders`, `parseApiResponse`, `getUserIdFromToken`, `normalizePath`, `matchProjectPath` |

### Proxy Nginx

Le fichier `frontend/nginx.conf` route les appels API :

| Pattern URL | Service cible |
|-------------|---------------|
| `/api/projects*` | `http://project-service:3002` |
| `/api/tasks*` | `http://task-service:3003` |
| `/api/auth/*` | `http://auth-service:3001` |

Le préfixe `/api` est retiré avant le forward (`rewrite ^/api(/.*)$ $1 break`).

---

## Persistance

L'application utilise un **pattern Repository** avec 3 implémentations interchangeables :

| Implémentation | Quand | Fichier |
|----------------|-------|---------|
| **In-memory** | `NODE_ENV=test` (tests unitaires) | `persistence/inmemory.ts` |
| **SQLite** | Par défaut en production | `persistence/sqlite.ts` |
| **MySQL** | `DB_TYPE=mysql` | `persistence/mysql.ts` |

La sélection se fait automatiquement dans `persistence/index.ts` :

```typescript
if (process.env.NODE_ENV === 'test') repository = inmemoryRepo;
else if (process.env.DB_TYPE === 'mysql') repository = mysqlRepo;
else repository = sqliteRepo;
```

---

## Événements (Redis Streams)

| Événement | Stream | Producteur | Déclencheur |
|-----------|--------|------------|-------------|
| `TaskCompleted` | `task-events` | task-service | Tâche passe à `terminé` |
| `TaskReopened` | `task-events` | task-service | Tâche quitte `terminé` |
| `ProjectCompleted` | `project-events` | project-service | Projet clôturé avec succès |

Le **notification-service** consomme ces streams en continu et écrit les événements dans un fichier de log (`/app/logs/notifications.log`).

---

## Lancement

### Prérequis

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installé et lancé
- [Node.js](https://nodejs.org/) ≥ 18 (pour les tests en local)
- [pnpm](https://pnpm.io/) ou npm

### Démarrage (SQLite — défaut)

```bash
docker compose up --build
```

### Démarrage avec MySQL

Créer un fichier `.env` à la racine en copiant le fichier `.env.example` :

```env
DB_TYPE=sqlite
```

Puis lancer avec le profil `mysql`, en modifiant la variable d'environnement puis faire :

```bash
docker compose --profile mysql up --build
```

> Les conteneurs `mysql-tasks` (port 3308) et `mysql-projects` (port 3309) démarrent uniquement avec ce profil.

### Accès à l'application

L'application est accessible sur **[http://localhost:3000](http://localhost:3000)**.

### Arrêt

```bash
docker compose down
```

Pour supprimer aussi les données persistées (volumes) :

```bash
docker compose down -v
```

---

## Variables d'environnement

| Variable | Service(s) | Description | Valeur par défaut |
|----------|-----------|-------------|-------------------|
| `DB_TYPE` | project, task | Mode de persistance : `sqlite` ou `mysql` | `sqlite` |
| `JWT_SECRET` | auth, project, task | Clé secrète JWT | `SECRET_KEY` |
| `SQLITE_DB_LOCATION` | project, task | Chemin du fichier SQLite | `/app/data/*.db` |
| `MYSQL_HOST` | project, task | Hôte MySQL | `mysql-projects` / `mysql-tasks` |
| `MYSQL_USER` | project, task | Utilisateur MySQL | `root` |
| `MYSQL_PASSWORD` | project, task | Mot de passe MySQL | `root` |
| `MYSQL_DB` | project, task | Nom de la base MySQL | `projects` / `tasks` |
| `REDIS_HOST` | project, task, notification | Hôte Redis | `redis` |
| `TASK_SERVICE_URL` | project | URL interne du task-service | `http://task-service:3003` |
| `LOG_FILE` | notification | Chemin du fichier de log | `/app/logs/notifications.log` |
| `SMTP_HOST` | notification | Hôte SMTP | — |
| `SMTP_PORT` | notification | Port SMTP | `465` |
| `SMTP_SECURE` | notification | TLS SMTP activé | `true` |
| `SMTP_USER` | notification | Utilisateur SMTP | — |
| `SMTP_PASS` | notification | Mot de passe SMTP | — |
| `SMTP_FROM` | notification | Adresse expéditeur | `SMTP_USER` |
| `SMTP_RECIPIENT` | notification | Adresse destinataire par défaut | `SMTP_USER` |
| `AUTH_SERVICE_URL` | notification | URL auth-service (resolution email utilisateur) | `http://auth-service:3001` |
| `PROJECT_SERVICE_URL` | notification | URL project-service (resolution owner du projet) | `http://project-service:3002` |

| `NODE_ENV` | project, task | `test` → utilise la persistence in-memory | — |

---

## Tests

### Vue d'ensemble

| Type | Framework | Commande | Répertoire |
|------|-----------|----------|------------|
| **Unitaires** | Jest 30 + ts-jest | `npm test` | `services/*/spec/` |
| **Architecture** | Jest 30 | `npm test` | `spec/architecture/` |
| **E2E** | Playwright 1.58 | `npx playwright test` | `tests-e2e/` |

---

### Tests unitaires (Jest)

Les tests unitaires vérifient les **controllers** de chaque service en **mockant la couche persistence** (pattern Repository) et les événements Redis.

#### Lancer tous les tests unitaires + architecture

```bash
npm test
# ou
pnpm test
```

#### Lancer les tests d'un service spécifique

```bash
# project-service uniquement
cd services/project-service; npx jest --verbose

# task-service uniquement
cd services/task-service; npx jest --verbose
```

#### Détail des tests unitaires (27 tests / 12 suites)

**auth-service** (5 tests)

| # | Test | Fichier |
|---|------|---------|
| 1 | Créer un utilisateur avec succès | `user.spec.ts` |
| 2 | Refuser un email déjà utilisé | `user.spec.ts` |
| 3 | Login avec identifiants valides retourne un JWT | `user.spec.ts` |
| 4 | Supprimer un utilisateur existant | `user.spec.ts` |
| 5 | ID unique après suppression et recréation | `user.spec.ts` |

**project-service** (9 tests)

| # | Test | Fichier | Use case |
|---|------|---------|----------|
| 1 | Créer un projet | `addProject.spec.ts` | UC1 |
| 2 | Clôturer un projet (tâches terminées) | `updateProject.spec.ts` | UC4 |
| 3 | Refuser clôture (tâches non terminées) | `updateProject.spec.ts` | UC4 |
| 4 | Refuser clôture (aucune tâche) | `updateProject.spec.ts` | UC4 |
| 5 | Récupérer un projet par ID | `getProject.spec.ts` | — |
| 6 | Retourner 404 si projet inexistant | `getProject.spec.ts` | — |
| 7 | Lister les projets par ownerId | `getProject.spec.ts` | — |
| 8 | Supprimer un projet existant | `deleteProject.spec.ts` | — |
| 9 | Refuser suppression d'un projet inexistant | `deleteProject.spec.ts` | — |

**task-service** (7 tests)

| # | Test | Fichier | Use case |
|---|------|---------|----------|
| 1 | Créer une tâche associée à un projet | `addTask.spec.ts` | UC2 |
| 2 | Marquer une tâche comme terminée | `updateTask.spec.ts` | UC3 |
| 3 | Refuser un status invalide | `updateTask.spec.ts` | UC3 |
| 4 | Lister toutes les tâches | `getTask.spec.ts` | — |
| 5 | Récupérer les tâches d'un projet | `getTasksByProject.spec.ts` | — |
| 6 | Refuser si projectId manquant | `getTasksByProject.spec.ts` | — |
| 7 | Supprimer une tâche | `deleteTask.spec.ts` | — |

**notification-service** (4 tests)

| # | Test | Fichier |
|---|------|---------|
| 1 | TaskCompleted est loggé correctement | `logger.spec.ts` |
| 2 | TaskReopened notifie la réouverture | `logger.spec.ts` |
| 3 | ProjectCompleted notifie la fin du projet | `logger.spec.ts` |
| 4 | Événement inconnu est loggé en JSON | `logger.spec.ts` |

**architecture** (2 tests)

| # | Test | Fichier |
|---|------|---------|
| 1 | Aucun import sqlite3 dans les tests | `no-sqlite-in-tests.spec.ts` |
| 2 | Les controllers mockent la persistence | `no-sqlite-in-tests.spec.ts` |


#### Principes de test

- Chaque test de controller **mocke** `persistence/index` via `jest.mock()` → aucune dépendance à SQLite/MySQL.
- Les événements Redis (`events/publisher`) sont aussi mockés.
- Le project-service mocke `global.fetch` pour simuler les appels au task-service.

---

### Tests d'architecture

Situés dans `spec/architecture/no-sqlite-in-tests.spec.ts`, ces 2 tests vérifient :

| # | Test | Description |
|---|------|-------------|
| 1 | Aucun import sqlite3 dans les tests | Aucun fichier `*.spec.ts` de controller ne doit contenir `require('sqlite3')` ou `from 'sqlite3'` |
| 2 | Les controllers mockent la persistence | Tout test de controller doit contenir `jest.mock(...persistence...)` |

---

### Tests E2E (Playwright)

Les tests end-to-end vérifient le **workflow complet** via le navigateur, de l'inscription à la suppression du compte.

#### Prérequis

1. L'application doit tourner (`docker compose up --build`)
2. Installer les navigateurs Playwright (une seule fois) :

```bash
npx playwright install
```

#### Lancer les tests E2E

```bash
npx playwright test
```

#### Configuration Playwright

| Paramètre | Valeur |
|-----------|--------|
| `testDir` | `./tests-e2e` |
| `baseURL` | `http://localhost:3000` |
| `timeout` | 10 000 ms |
| `headless` | `true` |
| `screenshot` | Sur échec uniquement |
| `video` | Conservé sur échec |
| `retries` | 0 |

#### Détail des tests E2E (13 tests)

| # | Test | Scénario |
|---|------|----------|
| 1 | Inscription | Créer un compte avec email, mot de passe et consentement RGPD |
| 2 | Connexion | S'inscrire puis se connecter — redirection vers le dashboard |
| 3 | Création projet | Créer un nouveau projet depuis le dashboard |
| 4 | Création tâche | Ajouter une tâche à un projet |
| 5 | Complétion tâche | Marquer une tâche comme terminée (bouton "Terminer") |
| 6 | Clôture projet | Clôturer un projet dont toutes les tâches sont terminées |
| 7 | Refus clôture | Tentative de clôture avec tâches non terminées → message d'erreur |
| 8 | Blocage ajout tâche | Impossible d'ajouter une tâche sur un projet clôturé (champs désactivés) |
| 9 | Réouverture projet | Réouvrir un projet clôturé → le formulaire de tâche redevient actif |
| 10 | Suppression tâche | Supprimer une tâche et vérifier qu'elle disparaît |
| 11 | Suppression projet | Supprimer un projet depuis la liste |
| 12 | Suppression utilisateur | Supprimer son compte (droit à l'oubli) → retour au login |
| 13 | Vérification logs notification-service | Vérifie que le notification-service a bien reçu les événements (`EVENT → Tâche terminée :`) |

---

## Qualité de code

| Outil | Commande | Fichier de config |
|-------|----------|-------------------|
| **ESLint** | `npm run lint` | `eslint.config.mjs` |
| **Prettier** | `npm run prettify` | Section `prettier` dans `package.json` |

### Configuration Prettier

```json
{
  "trailingComma": "all",
  "tabWidth": 4,
  "useTabs": false,
  "semi": true,
  "singleQuote": true
}
```

# Voir les logs de notification
```
docker compose logs notification-service
```

---

## Trello

[https://trello.com/b/uRypyONb/projetinitialarchi](https://trello.com/b/uRypyONb/projetinitialarchi)
