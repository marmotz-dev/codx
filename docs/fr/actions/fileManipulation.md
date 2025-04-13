# Action FileManipulation

L'action `fileManipulation` permet de créer et manipuler le contenu des fichiers pendant l'exécution d'une recette.
Cette action est essentielle pour créer des fichiers, ajouter du contenu au début ou à la fin des fichiers, et mettre à
jour le contenu en utilisant des expressions régulières.

## Opérations disponibles

L'action `fileManipulation` prend en charge [plusieurs opérations](#détails-des-opérations), chacune avec ses propres
paramètres :

1. `append`: [Ajouter du contenu à la fin d'un fichier](#ajouter-du-contenu-à-la-fin-dun-fichier)
2. `create`: [Créer un fichier](#créer-un-fichier)
3. `prepend`: [Ajouter du contenu au début d'un fichier](#ajouter-du-contenu-au-début-dun-fichier)
4. `update`: [Mettre à jour le contenu d'un fichier](#mettre-à-jour-le-contenu-dun-fichier)

## Paramètres communs

| Paramètre   | Type   | Obligatoire | Description                                                               |
|-------------|--------|-------------|---------------------------------------------------------------------------|
| `type`      | string | Oui         | Doit être `"fileManipulation"`                                            |
| `operation` | string | Oui         | L'opération à effectuer (`"create"`, `"prepend"`, `"append"`, `"update"`) |

## Détails des opérations

### Ajouter du contenu à la fin d'un fichier

L'opération `append` permet d'ajouter du contenu à la fin d'un fichier existant.

#### Paramètres spécifiques

| Paramètre   | Type   | Obligatoire | Description                                    |
|-------------|--------|-------------|------------------------------------------------|
| `operation` | string | Oui         | Doit être `"append"`                           |
| `path`      | string | Oui         | Le chemin du fichier auquel ajouter du contenu |
| `content`   | string | Oui         | Le contenu à ajouter à la fin du fichier       |

#### Valeur de retour

Cette opération retourne un objet avec les propriétés suivantes :

| Propriété  | Type    | Toujours retourné | Description                                            |
|------------|---------|-------------------|--------------------------------------------------------|
| `path`     | string  | Oui               | Chemin absolu du fichier modifié                       |
| `appended` | boolean | Oui               | Indique si le contenu a été ajouté à la fin du fichier |

#### Exemple

```yaml
- action:
    type: "fileManipulation"
    operation: "append"
    path: "CHANGELOG.md"
    content: |

      ## v1.0.0 (2025-02-13)

      - Version initiale
```

### Créer un fichier

L'opération `create` permet de créer un nouveau fichier avec un contenu spécifié.

#### Paramètres spécifiques

| Paramètre   | Type    | Obligatoire | Valeur par défaut | Description                                   |
|-------------|---------|-------------|-------------------|-----------------------------------------------|
| `operation` | string  | Oui         | -                 | Doit être `"create"`                          |
| `path`      | string  | Oui         | -                 | Le chemin du fichier à créer                  |
| `content`   | string  | Non         | -                 | Le contenu à écrire dans le fichier           |
| `overwrite` | boolean | Non         | `false`           | Si `true`, écrase le fichier s'il existe déjà |

#### Valeur de retour

Cette opération retourne un objet avec les propriétés suivantes :

| Propriété     | Type    | Toujours retourné | Description                               |
|---------------|---------|-------------------|-------------------------------------------|
| `path`        | string  | Oui               | Chemin absolu du nouveau fichier          |
| `overwritten` | boolean | Oui               | Indique si le fichier a été écrasé ou non |

#### Exemple

```yaml
- action:
    type: "fileManipulation"
    operation: "create"
    path: ".eslintrc.json"
    content: |
      {
        "extends": ["react-app", "prettier"],
        "plugins": ["react"],
        "rules": {
          "react/jsx-uses-react": "error",
          "react/jsx-uses-vars": "error"
        }
      }
    overwrite: true
```

### Ajouter du contenu au début d'un fichier

L'opération `prepend` permet d'ajouter du contenu au début d'un fichier existant.

#### Paramètres spécifiques

| Paramètre   | Type   | Obligatoire | Description                                    |
|-------------|--------|-------------|------------------------------------------------|
| `operation` | string | Oui         | Doit être `"prepend"`                          |
| `path`      | string | Oui         | Le chemin du fichier auquel ajouter du contenu |
| `content`   | string | Oui         | Le contenu à ajouter au début du fichier       |

#### Valeur de retour

Cette opération retourne un objet avec les propriétés suivantes :

| Propriété   | Type    | Toujours retourné | Description                                            |
|-------------|---------|-------------------|--------------------------------------------------------|
| `path`      | string  | Oui               | Chemin absolu du fichier modifié                       |
| `prepended` | boolean | Oui               | Indique si le contenu a été ajouté au début du fichier |

#### Exemple

```yaml
- action:
    type: "fileManipulation"
    operation: "prepend"
    path: "README.md"
    content: |
      # Documentation du projet

      Cette documentation a été générée automatiquement.

```

### Mettre à jour le contenu d'un fichier

L'opération `update` permet de remplacer du contenu dans un fichier en utilisant une expression régulière.

#### Paramètres spécifiques

| Paramètre   | Type   | Obligatoire | Description                                            |
|-------------|--------|-------------|--------------------------------------------------------|
| `operation` | string | Oui         | Doit être `"update"`                                   |
| `path`      | string | Oui         | Le chemin du fichier à mettre à jour                   |
| `pattern`   | string | Oui         | L'expression régulière à rechercher                    |
| `content`   | string | Oui         | Le contenu qui remplacera les correspondances trouvées |

#### Valeur de retour

Cette opération retourne un objet avec les propriétés suivantes :

| Propriété | Type    | Toujours retourné | Description                                           |
|-----------|---------|-------------------|-------------------------------------------------------|
| `path`    | string  | Oui               | Chemin absolu du fichier modifié                      |
| `updated` | boolean | Oui               | Indique si du contenu a été mis à jour (motif trouvé) |

#### Exemple

```yaml
- action:
    type: "fileManipulation"
    operation: "update"
    path: "package.json"
    pattern: "\"version\": \"[0-9]+\\.[0-9]+\\.[0-9]+\""
    content: "\"version\": \"1.2.0\""
```

### Utilisation avec des variables

Tous les chemins et contenus des différentes opérations peuvent utiliser l'interpolation de variables afin de rendre l'
action dynamique, en utilisant la syntaxe `{VARIABLE_NAME}`.

De plus, vous pouvez utiliser 2 variables internes pour accéder aux répertoires de la recette (`$RECIPE_DIRECTORY`) et
le répertoire courant du projet (`$PROJECT_DIRECTORY`).

Vous pouvez également utiliser des variables dans le contenu des fichiers :

```yaml
- name: "Saisir le nom du projet"
  action:
    type: "prompt"
    promptType: "text"
    message: "Nom du projet :"
    defaultValue: "mon-projet"
  variable: "PROJECT_NAME"

- action:
    type: "fileManipulation"
    operation: "create"
    path: "README.md"
    content: |
      # {PROJECT_NAME}

      Ce projet a été créé avec Codx.
```

### Gestion des erreurs

Vous pouvez gérer les erreurs qui peuvent survenir lors des opérations sur les fichiers en utilisant les attributs
`onSuccess` et `onFailure` :

```yaml
- name: "Mettre à jour la version dans package.json"
  action:
    type: "fileManipulation"
    operation: "update"
    path: "package.json"
    pattern: "\"version\": \"[0-9]+\\.[0-9]+\\.[0-9]+\""
    content: "\"version\": \"1.2.0\""
  onSuccess:
    - action:
        type: "message"
        content: "Version mise à jour avec succès."
        style: "success"
  onFailure:
    - action:
        type: "message"
        content: "Échec de la mise à jour de la version. Motif non trouvé ou fichier inexistant."
        style: "error"
```

#### Erreurs possibles

Cette action peut lancer les erreurs suivantes :
 
| Type d'erreur                  | Description                                                                                               |
|--------------------------------|-----------------------------------------------------------------------------------------------------------|
| `UnknownOperationCodxError`    | Lancée lorsqu'une opération inconnue est spécifiée.                                                       |
| `FileNotFoundCodxError`        | Lancée lorsque le fichier à manipuler n'existe pas (pour les opérations `append`, `prepend` et `update`). |
| `FileAlreadyExistsCodxError`   | Lancée lors de la tentative de création d'un fichier qui existe déjà sans l'option `overwrite`.           |
| `InvalidRegexPatternCodxError` | Lancée lorsque le modèle d'expression régulière pour l'opération `update` est invalide.                   |

### Bonnes pratiques

- **Existence du fichier** : Pour les opérations `prepend`, `append` et `update`, assurez-vous que le fichier existe
  avant de tenter de le modifier.
- **Sauvegarde** : Faites une copie de sauvegarde des fichiers importants avant de les modifier.
- **Chemins relatifs** : Utilisez des chemins relatifs plutôt que des chemins absolus pour une meilleure portabilité.
- **Paramètre overwrite** : Soyez prudent avec le paramètre `overwrite: true` dans l'opération `create`, car il peut
  écraser des fichiers existants sans avertissement.
- **Expressions régulières** : Testez soigneusement vos expressions régulières pour l'opération `update` afin de vous
  assurer qu'elles correspondent au contenu prévu.
- **Gestion des erreurs** : Utilisez toujours `onSuccess` et `onFailure` pour gérer les cas où les opérations échouent.

### Cas d'utilisation courants

#### Ajout d'en-têtes de licence aux fichiers

```yaml
- action:
    type: "fileManipulation"
    operation: "prepend"
    path: "src/index.js"
    content: |
      /**
       * Copyright (c) 2023 Ma Société
       * Sous licence MIT
       */

```

#### Mise à jour des numéros de version

```yaml
- action:
    type: "fileManipulation"
    operation: "update"
    path: "package.json"
    pattern: "\"version\": \"[0-9]+\\.[0-9]+\\.[0-9]+\""
    content: "\"version\": \"{NOUVELLE_VERSION}\""
```

#### Ajout de contenu à la documentation

```yaml
- action:
    type: "fileManipulation"
    operation: "append"
    path: "CHANGELOG.md"
    content: |

      ## v{VERSION} ({DATE_SORTIE})

      {CONTENU_CHANGELOG}
```

[↑ Liste des actions](../actions.md)

[← Fail](fail.md) ─ [FileSystem →](fileSystem.md) 
