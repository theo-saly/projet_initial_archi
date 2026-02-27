## Contexte

L'application actuelle est un monolithe Express/TypeScript gérant une TodoList simple (CRUD). Elle doit évoluer vers une application collaborative de type Kanban, distribuée en microservices. Il faut identifier les sous-domaines métier (Bounded Contexts au sens DDD) pour guider le découpage en services autonomes.

---

## Options

- Garder un monolithe et ajouter les nouvelles fonctionnalités dans le même service
- Découper en 2 services (Tâches + Notifications)
- Découper en 3 Bounded Contexts métier + 1 contexte de support (Projets, Tâches, Notifications, Auth)

---

## Décision

Découper le domaine en 3 Bounded Contexts principaux et 1 contexte de support :

- Gestion de Projets (project-service) : créer et gérer les projets Kanban. Chaque projet appartient à un utilisateur (relation 1 user → N projets). Entité : Project (id, name, ownerId).
- Gestion des Tâches (task-service) : gérer le cycle de vie des tâches dans un projet (création, changement de statut Kanban). Entité : Task (id, projectId, title, status). Émet les événements métier (TaskCompleted, TaskReopened, etc.).
- Gestion des Notifications (notification-service) : réagir aux événements métier et les consigner dans un fichier de log. Pas de base de données, le service écrit les notifications dans un fichier log structuré (une ligne par événement reçu).
- Auth / Identité (auth-service, contexte de support) : gestion des comptes, JWT, conformité RGPD. Extraction du module auth existant avec persistance en base de données (plus en mémoire).

Chaque service métier possède sa propre base de données (sauf le notification-service qui utilise un fichier de log). La communication Tâches → Notifications se fait par événements asynchrones. Le JWT est émis par auth-service et validé de manière autonome par chaque service.

---

## Conséquences

### Positives

- Chaque service a une responsabilité unique et claire
- Les services peuvent évoluer et être déployés indépendamment
- Le découpage suit le domaine métier, facilitant la compréhension

### Négatives

- Gestion de la cohérence entre services plus complexe (eventual consistency)
- Complexité opérationnelle accrue (plusieurs services, bases, broker dans Docker Compose)
- Duplication minimale de données nécessaire entre services
