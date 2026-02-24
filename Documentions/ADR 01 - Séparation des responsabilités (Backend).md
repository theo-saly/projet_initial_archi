## Contexte

Le projet Todo List monolithique mélange la logique métier, la gestion des routes et l’accès à la base de données dans les mêmes modules. Cela rend le code difficile à maintenir, à tester et à faire évoluer.

---

## Options

- Garder la structure actuelle (routes = logique métier + accès DB)
- Séparer la logique métier, la persistance et les routes via des interfaces et des services

---

## Décision

Nous décidons de séparer la logique métier, la persistance (accès DB) et les routes (Express) en modules distincts. La persistance sera injectée dans la couche métier via une interface.

---

## Conséquences

### Positives

- Meilleure testabilité (mock de la persistance)
- Maintenance facilitée
- Préparation à la migration TypeScript et à la séparation front/back

### Négatives

- Refactoring initial nécessaire
- Courbe d’apprentissage pour l’équipe