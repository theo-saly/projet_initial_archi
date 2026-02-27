## Contexte

L'architecture repose sur une communication asynchrone entre services via des événements métier. Il faut choisir un message broker pour le bus d'événements.

## Options

Redis : persistance, Consumer Groups, acknowledgements, image Docker légère (~30 Mo), librairie `ioredis` mature

RabbitMQ : broker AMQP mature avec UI de management, routage avancé, mais image lourde (~200 Mo) et configuration complexe (exchanges, queues, bindings)

## Décision

Utiliser Redis comme message broker. Les Consumer Groups garantissent qu'aucun message n'est perdu même si un service redémarre.

Conséquences

## Positives :

Mise en place rapide du bus d'événements

Un seul service d'infrastructure à gérer dans Docker Compose

Image Docker légère

## Négatives :

Moins de fonctionnalités de routage avancé que RabbitMQ