# Écriture de recettes Codx

Ce guide vous explique comment écrire vos propres recettes Codx pour automatiser l'installation et la configuration de
bibliothèques et d'outils dans vos projets.

## Structure d'une recette

Une recette Codx est un fichier YAML qui contient les éléments suivants :

- **description** : Une description de ce que fait la recette
- **author** : L'auteur de la recette
- **steps** : Une liste d'étapes à exécuter

Voici un exemple de structure de base :

```yaml
description: "Configuration d'un projet React avec Tailwind CSS"
author: "Votre Nom"

steps:
  - action:
      type: "message"
      content: "Bienvenue dans l'assistant d'installation de React avec Tailwind CSS !"
      style: "header"

  # Autres étapes...
```

## Étapes d'une recette

Chaque étape d'une recette peut contenir les éléments suivants :

- **name** (optionnel) : Un nom pour l'étape
- **condition** (optionnel) : Une condition pour exécuter l'étape
- **action** (obligatoire) : L'action à exécuter
- **onSuccess** (optionnel) : Une liste d'actions à exécuter en cas de succès
- **onFailure** (optionnel) : Une liste d'actions à exécuter en cas d'échec
- **finally** (optionnel) : Une liste d'actions à exécuter dans tous les cas
- **workingDirectory** (optionnel) : Le chemin d'exécution de l'étape
- **variable** (optionnel) : Le nom de la variable où stocker le résultat de l'action

Les propriétés `onSuccess` et `onFailure` fonctionnent comme un bloc try/catch en programmation :
- Si l'action s'exécute avec succès, les actions dans `onSuccess` sont exécutées, mais pas celles dans `onFailure`.
- Si l'action échoue et qu'il y a un bloc `onFailure`, les actions dans `onFailure` sont exécutées, puis l'exécution continue avec l'étape suivante.
- Si l'action échoue et qu'il n'y a pas de bloc `onFailure`, l'erreur est propagée et l'exécution de la recette s'arrête.
- Si une erreur se produit dans l'exécution des actions `onSuccess` ou `onFailure`, cette erreur est propagée.

Exemple d'étape :

```yaml
- name: "Installation d'ESLint"
  condition: '"eslint" in PACKAGES_TO_INSTALL'
  action:
    type: "package"
    operation: "install"
    packages:
      - "eslint"
      - "eslint-plugin-react"
    dev: true
  onSuccess:
    - action:
        type: "message"
        content: "ESLint installé avec succès !"
        style: "success"
  onFailure:
    - action:
        type: "message"
        content: "Échec de l'installation d'ESLint."
        style: "error"
  workingDirectory: front
```

## Variables et interpolation

Vous pouvez utiliser des variables dans vos recettes pour stocker et réutiliser des valeurs. Les variables sont définies
avec l'attribut `variable` dans une étape.

Pour utiliser une variable dans une chaîne de caractères, utilisez la syntaxe `{VARIABLE_NAME}` :

```yaml
- name: "Saisir le nom du projet"
  action:
    type: "prompt"
    promptType: "text"
    message: "Nom du projet :"
    defaultValue: "mon-projet"
  variable: "PROJECT_NAME"

- name: "Créer le répertoire du projet"
  action:
    type: "fileSystem"
    operation: "mkdir"
    path: "{PROJECT_NAME}"
```

Pour plus d'informations sur ce sujet, consultez
la [documentation sur les variables et l'interpolation](variables-et-interpolation.md).

## Conditions

Vous pouvez utiliser des conditions pour exécuter des étapes conditionnellement. Les conditions sont des expressions
JavaScript évaluées comme vrai ou faux.

Exemples de conditions :

```yaml
condition: 'PROJECT_TYPE == "react"'
condition: '"eslint" in SELECTED_TOOLS'
condition: 'INSTALL_TAILWIND == true'
```

Pour plus d'informations sur ce sujet, consultez la [documentation des conditions](conditions.md).

## Actions

Les actions permettent d'agir sur votre projet, de vous demander des informations, d'exécuter des commandes, etc...

Pour plus d'informations sur ce sujet, consultez la [documentation des actions](actions.md).

## Publication

Si vous souhaitez partager votre recette, vous devez publier un paquet sur npmjs dont le nom se termine par "
-codx-recipe". Assurez-vous également d'ajouter le mot-clé `codx-recipe` dans les keywords du fichier `package.json` de
votre paquet.

Cela permettra à la recette d'être reconnue et utilisable par Codx, tout en étant aisément trouvable grâce à la commande
`codx search`.

[← Installation et utilisation](utilisation.md) ─ [Variables et interpolation →](variables-et-interpolation.md)
