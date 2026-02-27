## Contexte

L'architecture cible repose sur une communication asynchrone entre services via des événements métier. Il faut choisir un message broker pour le bus d'événements. Le sujet mentionne deux options : Redis et RabbitMQ.

---

## Options

- Redis Pub/Sub : simple mais pas de persistance des messages (messages perdus si un consommateur est déconnecté)
- Redis Streams : persistance, Consumer Groups, acknowledgements, image Docker légère (~30 Mo), librairie ioredis mature
- RabbitMQ : broker AMQP mature avec UI de management, routage avancé, mais image lourde (~200 Mo) et configuration complexe (exchanges, queues, bindings)

---

## Décision

Utiliser Redis Streams comme message broker. Les Consumer Groups garantissent qu'aucun message n'est perdu même si un service redémarre. Le setup Docker est minimal (image redis:7-alpine). La librairie ioredis offre un support natif des Streams. Redis pourra aussi servir pour d'éventuels besoins de cache ou de sessions.

---

## Conséquences

### Positives

- Mise en place rapide du bus d'événements
- Un seul service d'infrastructure à gérer dans Docker Compose
- Possibilité de rejouer les événements passés (debugging)
- Image Docker légère

### Négatives

- Moins de fonctionnalités de routage avancé que RabbitMQ
- L'équipe doit se familiariser avec l'API Redis Streams (XADD, XREADGROUP, XACK)
