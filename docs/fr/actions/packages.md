# Référence des Actions liées à la gestion des paquets

Ce document détaille toutes les actions disponibles, liées à la gestion des paquets, qui peuvent être utilisées dans les
recettes Codx.

## Installation de paquet (install)

Installe des paquets npm en tant que dépendances ou devDépendances.

### Paramètres

* dependencies : Tableau de paquets à installer comme dépendances
* devDependencies : Tableau de paquets à installer comme devDépendances

Chaque paquet peut être spécifié de deux façons :

1. Sous forme de chaîne simple : "nom-du-paquet"
2. Sous forme d'objet avec les propriétés suivantes :

* name : Nom du paquet (requis), optionnellement avec une version
* exact : Booléen pour forcer une version exacte (optionnel)

Exemple :

```yaml
recipe:
  - packages.install:
    dependencies:
      - react
      - date-fns@^4.0.0
      - name: express
        exact: true
    devDependencies:
      - "@types/lodash"
      - "@types/express@4.17.17"
```

installe :

* `react` dans sa dernière version dans les dépendences et acceptera les mises à jour futures automatiques (exemple :
  react@^19.0.0) ;
* `date-fns` à la version "^4.0.0" dans les dépendences ;
* `express` dans sa dernière version exactement dans les dépendences et n'acceptera pas les mises à jour futures
  automatiques (exemple : express@4.21.2) ;