## Contexte

Le projet est actuellement en JavaScript. L’introduction de TypeScript est demandée pour fiabiliser le code, améliorer la maintenabilité et préparer la séparation front/back.

---

## Options

- Rester en JavaScript
- Migrer progressivement vers TypeScript avec "allowJs"
- Refondre tout le code d’un coup en TypeScript

---

## Décision

Migrer progressivement vers TypeScript, en activant "allowJs" pour permettre la cohabitation JS/TS et en corrigeant uniquement les erreurs bloquantes.

---

## Conséquences

### Positives

- Migration progressive, sans blocage
- Amélioration de la qualité du code

### Négatives

- Nécessite une double gestion JS/TS temporaire
- Risque d’incohérences pendant la transition