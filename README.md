# Todo App - Architecture Logicielle

Application Todo List avec **Express 5**, **TypeScript**, **React** (CDN) et persistance interchangeable (SQLite / MySQL / In-Memory).

## Architecture

```
HTTP → Express Router → Controller → Repository (persistence) → DB
```

- **Controllers** : logique CRUD (`src/controllers/`)
- **Persistence** : pattern Repository avec 3 implémentations choisies selon l'environnement (`src/persistence/`)
- **Routes** : endpoints CRUD + authentification JWT (`src/routes/`)
- **Frontend** : React via CDN avec Babel in-browser (`src/static/`)

## API

| Méthode  | Endpoint         | Description                |
|----------|------------------|----------------------------|
| GET      | `/items`         | Liste tous les todos       |
| POST     | `/items`         | Crée un todo               |
| PUT      | `/items/:id`     | Met à jour un todo         |
| DELETE   | `/items/:id`     | Supprime un todo           |
| POST     | `/auth/register` | Inscription utilisateur    |
| POST     | `/auth/login`    | Connexion (retourne JWT)   |
| DELETE   | `/auth/profile`  | Suppression de compte      |

## Installation

```bash
npm install
npm install --save-dev ts-jest typescript @types/jest
npm install jsonwebtoken @types/jsonwebtoken bcryptjs @types/bcryptjs
npx playwright install
```

## Commandes

```bash
npm run dev                              # Serveur dev (port 3000)
npx jest                                 # Tests unitaires
npx jest --coverage --coverageReport=html # Tests avec couverture
npx playwright test                      # Tests E2E
npm run lint                             # Linter ESLint
npm run prettify                         # Formatage Prettier
docker compose up --build                # Lancement Docker
```

## Mise à jour des dépendances

```bash
npm outdated
npm install @playwright/test@latest jest@latest mysql2@latest nodemon@latest
npm install playwright@latest prettier@latest sqlite3@latest uuid@latest
npm install wait-port@latest express@latest
npm install eslint --save-dev
npm init @eslint/config
```

## Variables d'environnement

| Variable             | Description                     | Défaut              |
|----------------------|---------------------------------|----------------------|
| `MYSQL_HOST`         | Active la persistance MySQL     | —                    |
| `MYSQL_USER/PASSWORD/DB` | Identifiants MySQL          | —                    |
| `SQLITE_DB_LOCATION` | Chemin du fichier SQLite        | `/etc/todos/todo.db` |
| `NODE_ENV=test`      | Active la persistance In-Memory | —                    |


## ADR

Les ADR se trouvent dans le dossier Documentions (décisions d'architecture)

## Trello

https://trello.com/b/uRypyONb/projetinitialarchi