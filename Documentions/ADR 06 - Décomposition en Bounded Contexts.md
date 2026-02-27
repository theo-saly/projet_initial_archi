## Contexte

L'application actuelle est un monolithe gérant une TodoList. Elle doit évoluer vers une application collaborative de type Kanban, distribuée en microservices. Il faut identifier les Bounded Contexts pour guider le découpage en services autonomes.



## Options

Garder un monolithe et ajouter les nouvelles fonctionnalités dans le même service

Découper en 3 Bounded Contexts métier (Projets, Tâches, Notifications)



## Décision

Découper le domaine en 3 Bounded Contexts principaux et 1 contexte de support :

Gestion de Projets  : créer et gérer les projets Kanban, gérer les membres.

Gestion des Tâches : gérer le cycle de vie des tâches (création, assignation, statut)

Gestion des Notifications : réagir aux événements métier et notifier les utilisateurs.



Conséquences

Positives :

Chaque service a une responsabilité unique et claire

Les services peuvent évoluer et être déployés indépendamment

Le découpage suit le domaine métier, facilitant la compréhension

Négatives :

Gestion de la cohérence entre services plus complexe