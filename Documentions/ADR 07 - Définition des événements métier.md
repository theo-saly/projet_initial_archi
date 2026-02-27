## Contexte

L'architecture microservices repose sur une communication asynchrone via un bus d'événements (Event-Driven Architecture). Il faut définir le catalogue des événements métier, leur structure et les contrats entre producteurs et consommateurs. Le sujet impose au minimum TaskCompleted et TaskReopened.

---

## Options

- Implémenter uniquement les 2 événements imposés (TaskCompleted, TaskReopened)
- Définir un catalogue complet d'événements couvrant tous les cas d'usage métier
- Ajouter les événements au fur et à mesure des besoins (sans catalogue préalable)

---

## Décision

Définir un catalogue structuré d'événements avec un format standardisé :

Événements obligatoires :
- TaskCompleted (task-service → notification-service) : tâche marquée "terminée"
- TaskReopened (task-service → notification-service) : tâche réouverte

Chaque événement suit le format : { eventId, eventType, timestamp, source, payload }. Les noms sont en PascalCase au passé (fait accompli). Les streams Redis sont nommés par contexte : tasks:events, projects:events. Le notification-service consomme ces événements et les écrit dans un fichier de log.

---

## Conséquences

### Positives

- Contrat clair entre services (chaque équipe sait ce qu'elle émet et consomme)
- Le format standardisé facilite le debugging et le tracing
- Fort découplage : le task-service ne connaît pas le notification-service

### Négatives

- Eventual consistency : une notification peut arriver avec un léger délai
- Si le format d'un événement change, il faut gérer la compatibilité
