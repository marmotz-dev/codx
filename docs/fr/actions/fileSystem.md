# Action FileSystem

L'action `fileSystem` permet de manipuler des fichiers et des répertoires pendant l'exécution d'une recette. Cette
action est essentielle pour créer, modifier, copier, déplacer ou supprimer des fichiers et de répertoires dans le cadre
de l'automatisation de la configuration de projets.

## Opérations disponibles

L'action `fileSystem` prend en charge [plusieurs opérations](#détail-des-opérations), chacune avec ses propres
paramètres :

1. `copy`: [Copier un fichier ou un répertoire](#copier-un-fichier-ou-un-répertoire)
2. `create`: [Créer un fichier](#créer-un-fichier)
3. `delete`: [Supprimer un fichier ou un répertoire](#supprimer-un-fichier-ou-un-répertoire)
4. `exists`: [Vérifier si un fichier ou un répertoire existe](#vérifier-si-un-fichier-ou-un-répertoire-existe)
5. `mkdir`: [Créer un répertoire](#créer-un-répertoire)
6. `move`: [Déplacer un fichier ou un répertoire](#déplacer-un-fichier-ou-un-répertoire)

## Paramètres communs

| Paramètre   | Type   | Obligatoire | Description                                                                                 |
|-------------|--------|-------------|---------------------------------------------------------------------------------------------|
| `type`      | string | Oui         | Doit être `"fileSystem"`                                                                    |
| `operation` | string | Oui         | L'opération à effectuer (`"create"`, `"delete"`, `"exists"`, `"mkdir"`, `"copy"`, `"move"`) |

## Détails des opérations

### Copier un fichier ou un répertoire

L'opération `copy` permet de copier un fichier ou un répertoire.

#### Paramètres spécifiques

| Paramètre     | Type    | Obligatoire | Valeur par défaut | Description                                                    |
|---------------|---------|-------------|-------------------|----------------------------------------------------------------|
| `operation`   | string  | Oui         | -                 | Doit être `"copy"`                                             |
| `source`      | string  | Oui         | -                 | Le chemin source du fichier ou du répertoire à copier          |
| `destination` | string  | Oui         | -                 | Le chemin de destination où copier le fichier ou le répertoire |
| `overwrite`   | boolean | Non         | `false`           | Si `true`, écrase les fichiers existants à la destination      |

#### Valeur de retour

Cette opération retourne un objet avec les propriétés suivantes :

| Propriété     | Type    | Toujours retourné | Description                                             |
|---------------|---------|-------------------|---------------------------------------------------------|
| `source`      | string  | Oui               | Chemin absolu du fichier ou répertoire à copier         |
| `destination` | string  | Oui               | Chemin absolu du fichier ou répertoire copié            |
| `overwritten` | boolean | Oui               | Indique si le fichier ou répertoire a été écrasé ou non |

#### Exemple

```yaml
- action:
    type: "fileSystem"
    operation: "copy"
    source: "templates/react"
    destination: "src"
    overwrite: true
```

#### Variables et interpolation

Les chemins des `source` et `destination` peuvent utiliser l'interpolation de variables afin de rendre l'action
dynamique.

De plus, vous pouvez utiliser 2 variables internes pour accéder aux répertoires de la recette (`$RECIPE_DIRECTORY`) et
le réoertoire courant du projet (`$PROJECT_DIRECTORY`).

Par exemple, s'il y a des fichiers templates dans le répertoire de votre recette et que vous souhaitez les copier dans
votre projet, vous pouvez faire quelque chose comme cela :

```yaml
- action:
    type: "fileSystem"
    operation: "copy"
    source: "{$RECIPE_DIRECTORY}/templates/.eslintrc.json"
    destination: "{$PROJECT_DIRECTORY}/.eslintrc.json"
    overwrite: true
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
    type: "fileSystem"
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

### Supprimer un fichier ou un répertoire

L'opération `delete` permet de supprimer un fichier ou un répertoire.

#### Paramètres spécifiques

| Paramètre   | Type   | Obligatoire | Description                                       |
|-------------|--------|-------------|---------------------------------------------------|
| `operation` | string | Oui         | Doit être `"delete"`                              |
| `path`      | string | Oui         | Le chemin du fichier ou du répertoire à supprimer |

#### Valeur de retour

Cette opération retourne un objet avec les propriétés suivantes :

| Propriété | Type    | Toujours retourné | Description                                             |
|-----------|---------|-------------------|---------------------------------------------------------|
| `path`    | string  | Oui               | Chemin absolu du fichier supprimé                       |
| `deleted` | boolean | Oui               | Indique si le fichier existait et a été supprimé ou non |

#### Exemple

```yaml
- action:
    type: "fileSystem"
    operation: "delete"
    path: "node_modules"
```

### Vérifier si un fichier ou un répertoire existe

L'opération `exists` permet de vérifier si un fichier ou un répertoire existe.

#### Paramètres spécifiques

| Paramètre   | Type   | Obligatoire | Description                                      |
|-------------|--------|-------------|--------------------------------------------------|
| `operation` | string | Oui         | Doit être `"exists"`                             |
| `path`      | string | Oui         | Le chemin du fichier ou du répertoire à vérifier |

#### Valeur de retour

Cette opération retourne un objet avec les propriétés suivantes :

| Propriété | Type    | Toujours retourné | Description                         |
|-----------|---------|-------------------|-------------------------------------|
| `path`    | string  | Oui               | Chemin absolu du fichier testé      |
| `exists`  | boolean | Oui               | Indique si le fichier existe ou non |

#### Exemple

```yaml
- action:
    type: "fileSystem"
    operation: "exists"
    path: "package.json"
  variable: "PACKAGE_JSON_EXISTS"
```

### Créer un répertoire

L'opération `mkdir` permet de créer un nouveau répertoire.

#### Paramètres spécifiques

| Paramètre   | Type   | Obligatoire | Description                     |
|-------------|--------|-------------|---------------------------------|
| `operation` | string | Oui         | Doit être `"mkdir"`             |
| `path`      | string | Oui         | Le chemin du répertoire à créer |

#### Valeur de retour

Cette opération retourne un objet avec les propriétés suivantes :

| Propriété | Type    | Toujours retourné | Description                                |
|-----------|---------|-------------------|--------------------------------------------|
| `path`    | string  | Oui               | Chemin absolu du répertoire à créer        |
| `created` | boolean | Oui               | Indique si le répertoire a été créé ou non |

#### Exemple

```yaml
- action:
    type: "fileSystem"
    operation: "mkdir"
    path: "src/components"
```

### Déplacer un fichier ou un répertoire

L'opération `move` permet de déplacer un fichier ou un répertoire.

#### Paramètres spécifiques

| Paramètre     | Type    | Obligatoire | Valeur par défaut | Description                                                      |
|---------------|---------|-------------|-------------------|------------------------------------------------------------------|
| `operation`   | string  | Oui         | -                 | Doit être `"move"`                                               |
| `source`      | string  | Oui         | -                 | Le chemin source du fichier ou du répertoire à déplacer          |
| `destination` | string  | Oui         | -                 | Le chemin de destination où déplacer le fichier ou le répertoire |
| `overwrite`   | boolean | Non         | `false`           | Si `true`, écrase les fichiers existants à la destination        |

#### Valeur de retour

Cette opération retourne un objet avec les propriétés suivantes :

| Propriété     | Type    | Toujours retourné | Description                                             |
|---------------|---------|-------------------|---------------------------------------------------------|
| `source`      | string  | Oui               | Chemin absolu du fichier ou répertoire à déplacer       |
| `destination` | string  | Oui               | Chemin absolu du fichier ou répertoire déplacé          |
| `overwritten` | boolean | Oui               | Indique si le fichier ou répertoire a été écrasé ou non |

#### Exemple

```yaml
- action:
    type: "fileSystem"
    operation: "move"
    source: "old-dir"
    destination: "new-dir"
    overwrite: true
```

### Utilisation avec des variables

Tous les chemins des différentes opérations (`path`, `source`, `destination`) peuvent utiliser l'interpolation de
variables afin de rendre dynamique l'action, en utilisant la syntaxe `{VARIABLE_NAME}`.

De plus, vous pouvez utiliser 2 variables internes pour accéder aux répertoires de la recette (`$RECIPE_DIRECTORY`) et
le réoertoire courant du projet (`$PROJECT_DIRECTORY`).

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
    type: "fileSystem"
    operation: "mkdir"
    path: "{PROJECT_NAME}"

- action:
    type: "fileSystem"
    operation: "create"
    path: "{PROJECT_NAME}/README.md"
    content: |
      # {PROJECT_NAME}

      Ce projet a été créé avec Codx.
```

### Gestion des erreurs

Vous pouvez gérer les erreurs qui peuvent survenir lors des opérations sur les fichiers en utilisant les attributs
`onSuccess` et `onFailure` :

```yaml
- name: "Créer le fichier de configuration"
  action:
    type: "fileSystem"
    operation: "create"
    path: ".eslintrc.json"
    content: |
      {
        "extends": ["react-app", "prettier"]
      }
    overwrite: false
  onSuccess:
    - action:
        type: "message"
        content: "Fichier de configuration créé avec succès."
        style: "success"
  onFailure:
    - action:
        type: "message"
        content: "Le fichier existe déjà et ne sera pas écrasé."
        style: "warning"
```

### Bonnes pratiques

- **Vérification préalable** : Utilisez l'opération `exists` pour vérifier si un fichier ou un répertoire existe avant
  de le manipuler.
- **Sauvegarde** : Faites une copie de sauvegarde des fichiers importants avant de les modifier.
- **Chemins relatifs** : Utilisez des chemins relatifs plutôt que des chemins absolus pour une meilleure portabilité.
- **Paramètre overwrite** : Soyez prudent avec le paramètre `overwrite: true`, car il peut écraser des fichiers
  existants sans avertissement.
- **Gestion des erreurs** : Utilisez toujours `onSuccess` et `onFailure` pour gérer les cas où les opérations échouent.

### Cas d'utilisation courants

#### Création d'une structure de projet

```yaml
- action:
    type: "fileSystem"
    operation: "mkdir"
    path: "{PROJECT_NAME}"

- action:
    type: "fileSystem"
    operation: "mkdir"
    path: "{PROJECT_NAME}/src"

- action:
    type: "fileSystem"
    operation: "mkdir"
    path: "{PROJECT_NAME}/public"

- action:
    type: "fileSystem"
    operation: "create"
    path: "{PROJECT_NAME}/src/index.js"
    content: |
      import React from 'react';
      import ReactDOM from 'react-dom';
      import App from './App';

      ReactDOM.render(<App />, document.getElementById('root'));
```

#### Copie de templates

```yaml
- action:
    type: "fileSystem"
    operation: "copy"
    source: "{$RECIPE_DIRECTORY}/templates/react-component"
    destination: "{PROJECT_NAME}/src/components"
```

#### Modification conditionnelle de fichiers

```yaml
- action:
    type: "fileSystem"
    operation: "exists"
    path: "package.json"
  variable: "PACKAGE_JSON_EXISTS"

- condition: "not PACKAGE_JSON_EXISTS"
  action:
    type: "fileSystem"
    operation: "create"
    path: "package.json"
    content: |
      {
        "name": "{PROJECT_NAME}",
        "version": "1.0.0",
        "dependencies": {}
      }
```

[↑ Liste des actions](../actions.md)

[← Command](command.md) ─ [Message →](message.md)
