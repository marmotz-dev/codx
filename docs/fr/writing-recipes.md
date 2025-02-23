# Rédaction de recettes Codx

Ce guide explique comment écrire des recettes pour Codx.

## Structure de la recette

Les recettes sont écrites au format YAML et suivent cette structure de base :

```yaml
recipe:
  - action1:
    # paramètres de l'action
  - action2:
    # paramètres de l'action
```

## Emplacement des recettes

Les recettes peuvent être :

1. Publiées comme des packages npm
2. Stockées localement dans votre projet
3. Stockées dans un dépôt central

## Exemple de recette

Voici un exemple complet montrant comment :

* Installer des dépendances
* Copier des fichiers de configuration
* Afficher des informations

```yaml
recipe:
  - console.info:
      - text: "Début de l'exécution de la recette"

  # Installer les packages
  - packages.install:
      dependencies:
        - "date-fns"
        - "chalk@^5.4.0"
        - name: express
          exact: true
      devDependencies:
        - prettier
        - "@types/bun@^1.2.0",
        - name: "@types/express"
          exact: true

  # Copier des fichiers de configuration
  - fs.copy:
      - from: prettierignore
        to: .prettierignore
      - from: config/test.json
        to: config/test.json

  - console.success:
      - text: "Exécution de la recette terminée"
```

## Tester les recettes

Avant de publier ou de partager votre recette :

1. Testez-la dans un répertoire de projet vierge.
2. Vérifiez que tous les fichiers sont copiés correctement.
3. Assurez-vous que toutes les dépendances sont installées.
4. Vérifiez que toutes les actions s'exécutent avec succès.

## Validation des recettes

Codx valide votre recette avant son exécution pour s'assurer que :

* Tous les paramètres requis sont présents.
* Les chemins des fichiers sont valides.
* Les actions sont correctement formatées.

Si la validation échoue, Codx affichera un message d'erreur expliquant le problème.