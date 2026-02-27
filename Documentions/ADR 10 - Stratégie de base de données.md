## Contexte

L'application monolithique actuelle utilise une seule base de données (SQLite ou MySQL selon l'environnement). Avec le passage en microservices (project-service, task-service, notification-service, auth-service), il faut décider si les services partagent une base commune ou si chacun possède la sienne.

---

## Options

- Une base de données partagée : tous les services lisent et écrivent dans la même base, chacun ayant ses propres tables. Simple à mettre en place mais crée un couplage fort entre les services.
- Une base de données par service (Database per Service) : chaque service possède sa propre instance de base de données, totalement isolée. Respecte le principe d'autonomie des microservices mais complexifie la gestion des données transverses.
- Une base partagée avec des schémas séparés : compromis entre les deux, mais l'isolation reste partielle et le risque de couplage subsiste.

---

## Décision

Adopter le pattern Database per Service : chaque microservice possède sa propre base de données SQLite isolée. Aucun service n'accède directement à la base d'un autre. Si un service a besoin d'une donnée d'un autre service, il passe par son API REST ou par les événements.

- auth-service : sa base SQLite avec la table users
- project-service : sa base SQLite avec la table projects (un projet appartient à un user via ownerId)
- task-service : sa base SQLite avec la table tasks
- notification-service : pas de base de données, utilise un fichier de log pour consigner les événements reçus (approche simple et suffisante pour des notifications en lecture seule)

SQLite est choisi pour les 3 autres services pour sa simplicité (pas de serveur à gérer, un fichier par service). En production, chaque service pourrait migrer vers PostgreSQL ou MySQL indépendamment.

---

## Conséquences

### Positives

- Isolation totale : un changement de schéma dans un service n'impacte pas les autres
- Chaque service peut évoluer sa base indépendamment (migration, changement de techno)
- Respecte le principe d'autonomie des microservices
- Pas de point de défaillance unique côté base de données

### Négatives

- Impossible de faire des jointures entre services (pas de JOIN tasks + projects)
- Duplication minimale de données nécessaire (ex : le task-service stocke le projectId mais ne connaît pas le nom du projet)
- Cohérence éventuelle (eventual consistency) : les données ne sont pas synchronisées en temps réel entre services
