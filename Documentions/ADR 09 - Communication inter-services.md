## Contexte

Avec le découpage en microservices, les services doivent communiquer entre eux. Deux modes existent : synchrone (REST/HTTP) où l'appelant attend la réponse, et asynchrone (événements via Redis Streams) où l'émetteur publie et continue sans attendre.

---

## Options

- Tout en synchrone (REST entre tous les services)
- Tout en asynchrone (event-driven pur)
- Communication mixte : REST pour les requêtes nécessitant une réponse immédiate, événements pour les notifications inter-services

---

## Décision

Adopter une communication mixte :

- Synchrone (REST) : le frontend appelle directement chaque service via des URLs Docker internes (auth-service:3001, project-service:3002, task-service:3003, notification-service:3004). Pas d'API Gateway (trop complexe pour 3 semaines).
- Asynchrone (événements) : le task-service et le project-service émettent des événements sur Redis Streams, le notification-service les consomme via Consumer Groups.
- Authentification : JWT émis par auth-service, validé de manière autonome par chaque service (clé secrète partagée via variable d'environnement). Les événements internes contiennent le userId dans le payload (pas de JWT).

---

## Conséquences

### Positives

- Séparation claire entre requêtes (synchrone) et réactions (asynchrone)
- Le notification-service est totalement découplé
- Validation JWT décentralisée, pas de point de défaillance unique

### Négatives

- Sans API Gateway, le frontend doit connaître les URLs de chaque service
- Les appels synchrones entre services introduisent un couplage temporel
- Clé JWT partagée : acceptable pour un projet pédagogique, pas pour la production
