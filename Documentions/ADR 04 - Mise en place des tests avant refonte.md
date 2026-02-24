## Contexte

La refonte implique des modifications structurelles importantes. Il est nécessaire de sécuriser le comportement existant.

---

## Options

- Refactorer directement sans tests
- Ajouter uniquement des tests unitaires
- Ajouter tests E2E + unitaires + intégration

---

## Décision

Mettre en place :

- Tests E2E (Playwright côté frontend)
- Tests unitaires et d’intégration (Jest côté backend)
- Séparation des tests métier et persistance

---

## Conséquences

### Positives

- Sécurisation des fonctionnalités existantes
- Réduction du risque de régression
- Meilleure documentation vivante du projet

### Négatives

- Temps de mise en place important
- Maintenance des tests



Conséquences

Positives

Sécurisation des fonctionnalités existantes

Réduction du risque de régression

Meilleure documentation vivante du projet



Négatives

Temps de mise en place important

Maintenance des tests