## Contexte

Le projet doit pouvoir fonctionner en local (développement, tests) et en production. SQLite est simple à utiliser pour le développement, tandis que MySQL est plus adapté à la production.

---

## Options

- Utiliser uniquement SQLite
- Utiliser uniquement MySQL
- Permettre le choix dynamique entre SQLite et MySQL selon l’environnement

---

## Décision

Permettre le choix dynamique de la persistance via une variable d’environnement. SQLite sera utilisé par défaut, MySQL en production si configuré.

---

## Conséquences

### Positives

- Facilité de développement et de tests
- Adaptabilité à la production

### Négatives

- Complexité de configuration
- Nécessité de maintenir deux implémentations