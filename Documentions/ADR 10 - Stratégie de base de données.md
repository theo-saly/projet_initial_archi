## Contexte

L'application monolithique actuelle utilise une seule base de données (SQLite ou MySQL selon l'environnement). Avec le passage en microservices, il faut décider si les services partagent une base commune ou si chacun possède la sienne


## Options

Une base de données partagée : tous les services lisent et écrivent dans la même base, chacun ayant ses propres tables. Simple à mettre en place mais crée un couplage fort entre les services.

Une base de données par service (Database per Service) : chaque service possède sa propre instance de base de données, totalement isolée. Respecte le principe d'autonomie des microservices mais complexifie la gestion des données transverses.



## Décision

Chaque microservice possède sa propre base de données SQLite isolée. Aucun service n'accède directement à la base d'un autre. Si un service a besoin d'une donnée d'un autre service, il passe par son API REST ou par les événements.

SQLite est choisi pour les 3 autres services pour sa simplicité (pas de serveur à gérer, un fichier par service). En production, chaque service pourrait migrer vers PostgreSQL ou MySQL indépendamment.



## Conséquences

Positives

Chaque service peut évoluer sa base indépendamment (migration, changement de techno)

Respecte le principe d'autonomie des microservices



## Négatives

Impossible de faire des jointures entre services (pas de JOIN tasks + projects)

Duplication minimale de données nécessaire (ex : le task-service stocke le projectId mais ne connaît pas le nom du projet)