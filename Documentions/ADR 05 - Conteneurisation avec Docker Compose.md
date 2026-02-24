## Contexte

Le projet doit fonctionner en local et en production avec des dépendances maîtrisées.

---

## Options

- Installation locale manuelle
- Docker uniquement pour la base de données
- Docker Compose pour frontend + backend + base

---

## Décision

Utiliser Docker Compose avec :

- Service backend
- Service frontend
- Service base de données (MySQL en prod)

---

## Conséquences

### Positives

- Environnement reproductible
- Compatible CI/CD
- Simplifie la mise en production

### Négatives

- Courbe d’apprentissage Docker
- Temps de build plus long