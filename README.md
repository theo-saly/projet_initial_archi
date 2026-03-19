# Kanban Project Manager - Architecture Microservices

Application de gestion de projet Kanban construite en **microservices** avec **Node.js**, **TypeScript**, **Express 5**, **Redis Streams** et **Docker Compose**.

Évolution d'une TodoList monolithique vers une architecture distribuée event-driven.

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

### Services

| Service | Port | Rôle | Base de données |
|---------|------|------|-----------------|
| **auth-service** | 3001 | Inscription, login JWT, suppression de compte | In-memory |
| **project-service** | 3002 | CRUD projets, clôture avec vérification des tâches | SQLite |
| **task-service** | 3003 | CRUD tâches, publication d'événements Redis | SQLite |
| **notification-service** | 3004 | Écoute événements Redis, écriture log | Fichier de log |
| **redis** | 6379 | Message broker (Redis Streams) | — |
| **frontend** | 3000 | Interface web (Nginx + React CDN) | — |

### Communication inter-services

- **Synchrone (REST)** : le frontend appelle les services via Nginx, le project-service appelle le task-service pour vérifier les tâches avant clôture
- **Asynchrone (Redis Streams)** : le task-service et le project-service publient des événements, le notification-service les consomme

### Événements

| Événement | Producteur | Déclencheur |
|-----------|------------|-------------|
| `TaskCompleted` | task-service | Tâche passe à "terminé" |
| `TaskReopened` | task-service | Tâche quitte "terminé" |
| `ProjectCompleted` | project-service | Projet clôturé |

## API

### Auth Service (`:3001`)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/auth/register` | Inscription (email, password, consent) |
| POST | `/auth/login` | Connexion (retourne JWT) |
| DELETE | `/auth/profile` | Suppression de compte (droit à l'oubli) |

### Project Service (`:3002`)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/projects` | Liste les projets |
| GET | `/projects/:id` | Détail d'un projet |
| POST | `/projects` | Crée un projet |
| PUT | `/projects/:id` | Met à jour / clôture un projet |
| DELETE | `/projects/:id` | Supprime un projet |

### Task Service (`:3003`)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/tasks` | Liste toutes les tâches |
| GET | `/tasks/by-project?projectId=xxx` | Tâches d'un projet |
| POST | `/tasks` | Crée une tâche |
| PUT | `/tasks/:id` | Met à jour une tâche |
| DELETE | `/tasks/:id` | Supprime une tâche |

## Lancement

### Prérequis

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installé et lancé

### Démarrage

```bash
docker compose up --build
```

L'application est accessible sur `http://localhost:3000`.

### Arrêt

```bash
docker compose down
```

Pour supprimer aussi les données persistées :

```bash
docker compose down -v
```

## Tests

```bash
# Tous les tests depuis la racine
pnpm test ou npm test

# Tests d'un service spécifique
cd services/task-service && npx jest --verbose
cd services/project-service && npx jest --verbose

# Tests e2e
npx playwright test
```

### Couverture des tests (9 tests)

| Test | Service | Use case |
|------|---------|----------|
| Créer un projet | project-service | UC1 |
| Créer une tâche associée à un projet | task-service | UC2 |
| Marquer une tâche comme terminée | task-service | UC3 |
| Refuser un status invalide | task-service | UC3 |
| Clôturer un projet (tâches terminées) | project-service | UC4 |
| Refuser clôture (tâches non terminées) | project-service | UC4 |
| Refuser clôture (aucune tâche) | project-service | UC4 |
| Aucun test n'importe sqlite3 directement | architecture | Isolation |
| Tests de controllers mockent la persistence | architecture | Isolation |

## Structure du projet

```
projet_initial_archi/
├── services/
│   ├── auth-service/          # Authentification JWT
│   │   ├── src/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── Dockerfile
│   ├── project-service/       # Gestion de projets
│   │   ├── src/
│   │   ├── spec/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── Dockerfile
│   ├── task-service/          # Gestion de tâches
│   │   ├── src/
│   │   ├── spec/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── Dockerfile
│   └── notification-service/  # Consommateur d'événements
│       ├── src/
│       ├── package.json
│       ├── tsconfig.json
│       └── Dockerfile
├── frontend/                  # Interface web (Nginx)
├── spec/                      # Tests d'architecture
├── Documentions/              # ADR (décisions d'architecture)
├── docker-compose.yml
└── README.md
```

## Variables d'environnement

| Variable | Service | Description | Défaut |
|----------|---------|-------------|--------|
| `JWT_SECRET` | auth, project, task | Clé secrète JWT | `SECRET_KEY` |
| `SQLITE_DB_LOCATION` | project, task | Chemin fichier SQLite | `/etc/*/_.db` |
| `REDIS_HOST` | task, project, notification | Hôte Redis | `localhost` |
| `TASK_SERVICE_URL` | project | URL du task-service | — |
| `LOG_FILE` | notification | Chemin du fichier de log | `/app/logs/notifications.log` |

## Tester le backend manuellement

```bash
# Créer un projet
curl -X POST http://localhost:3002/projects \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Mon projet\",\"description\":\"Test kanban\"}"

# Créer une tâche
curl -X POST http://localhost:3003/tasks \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Ma tâche\",\"status\":\"à faire\",\"projectId\":\"<ID_PROJET>\"}"

# Marquer la tâche comme terminée (déclenche TaskCompleted)
curl -X PUT http://localhost:3003/tasks/<ID_TACHE> \
  -H "Content-Type: application/json" \
  -d "{\"status\":\"terminé\"}"

# Clôturer le projet (déclenche ProjectCompleted)
curl -X PUT http://localhost:3002/projects/<ID_PROJET> \
  -H "Content-Type: application/json" \
  -d "{\"status\":\"terminé\"}"

# Voir les logs de notification
docker compose logs notification-service
```

## ADR

Les décisions d'architecture sont documentées dans le dossier `Documentions/`.

## Trello

https://trello.com/b/uRypyONb/projetinitialarchi
