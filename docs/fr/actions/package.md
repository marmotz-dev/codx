# Action Package

L'action `package` permet de gérer les dépendances et les paquets dans votre projet. Cette action est essentielle pour
automatiser l'installation, la suppression, la mise à jour et la vérification des paquets, ainsi que pour exécuter des
paquets.

## Opérations disponibles

L'action `package` prend en charge plusieurs opérations, chacune avec ses propres paramètres :

1. `install`: [Installer des paquets](#installer-des-paquets)
2. `remove`: [Supprimer des paquets](#supprimer-des-paquets)
3. `update`: [Mettre à jour des paquets](#mettre-à-jour-des-paquets)
4. `check`: [Vérifier des paquets](#vérifier-des-paquets)
5. `run`: [Exécuter un paquet](#exécuter-un-paquet)

## Paramètres communs

| Paramètre   | Type   | Obligatoire | Description                                                                       |
|-------------|--------|-------------|-----------------------------------------------------------------------------------|
| `type`      | string | Oui         | Doit être `"package"`                                                             |
| `operation` | string | Oui         | L'opération à effectuer (`"install"`, `"remove"`, `"update"`, `"check"`, `"run"`) |

## Détails des opérations

### Vérifier des paquets

L'opération `check` permet de vérifier si certains paquets sont installés et si leurs versions correspondent aux
critères spécifiés.

#### Paramètres spécifiques

| Paramètre   | Type   | Obligatoire | Description                                       |
|-------------|--------|-------------|---------------------------------------------------|
| `operation` | string | Oui         | Doit être `"check"`                               |
| `packages`  | array  | Oui         | Tableau d'objets décrivant les paquets à vérifier |

Chaque objet dans le tableau `packages` doit avoir les propriétés suivantes :

| Propriété    | Type   | Obligatoire | Description                              |
|--------------|--------|-------------|------------------------------------------|
| `package`    | string | Oui         | Nom du paquet à vérifier                 |
| `minVersion` | string | Non         | Version minimale requise (format semver) |
| `maxVersion` | string | Non         | Version maximale requise (format semver) |

#### Valeur de retour

Cette opération retourne un objet avec les propriétés suivantes :

| Propriété       | Type    | Toujours retourné                                   | Description                                                                            |
|-----------------|---------|-----------------------------------------------------|----------------------------------------------------------------------------------------|
| `check`         | boolean | Oui                                                 | Indique si le paquet est installé et passe les conditions `minVersion` et `maxVersion` |
| `installed`     | boolean | Oui                                                 | Indique si le paquet est installé ou non                                               |
| `version`       | string  | Uniquement si installé                              | Indique la version actuelle du paquet                                                  |
| `hasMinVersion` | boolean | Uniquement si installé et `minVersion` est spécifié | Indique si le paquet passe la condition `minVersion`                                   |
| `hasMaxVersion` | boolean | Uniquement si installé et `maxVersion` est spécifié | Indique si le paquet passe la condition `maxVersion`                                   |

#### Exemple

```yaml
- name: "Vérifier les versions de React et TypeScript"
  action:
    type: "package"
    operation: "check"
    packages:
      - package: "react"
        minVersion: "17.0.0"
        maxVersion: "18.0.0"
      - package: "typescript"
        minVersion: "4.0.0"
  variable: "PACKAGES_CHECK_RESULT"
```

### Installer des paquets

L'opération `install` permet d'installer un ou plusieurs paquets.

#### Paramètres spécifiques

| Paramètre   | Type    | Obligatoire | Valeur par défaut | Description                                                        |
|-------------|---------|-------------|-------------------|--------------------------------------------------------------------|
| `operation` | string  | Oui         | -                 | Doit être `"install"`                                              |
| `packages`  | array   | Oui         | -                 | Tableau des paquets à installer                                    |
| `dev`       | boolean | Non         | `false`           | Si `true`, installe les paquets comme dépendances de développement |

#### Valeur de retour

Cette opération retourne un objet avec les propriétés suivantes :

| Propriété | Type   | Toujours retourné | Description                                                    |
|-----------|--------|-------------------|----------------------------------------------------------------|
| `code`    | number | Oui               | Code retour de la commande (0 = succès, autre valeur = erreur) |
| `output`  | string | Oui               | La sortie de la commande dans la console                       |

#### Exemple

```yaml
- name: "Installer React et React DOM"
  action:
    type: "package"
    operation: "install"
    packages:
      - "react@19"
      - "react-dom"
```

#### Exemple avec dépendances de développement

```yaml
- name: "Installer ESLint et Prettier"
  action:
    type: "package"
    operation: "install"
    packages:
      - "eslint"
      - "prettier"
      - "eslint-config-prettier"
    dev: true
```

### Supprimer des paquets

L'opération `remove` permet de supprimer un ou plusieurs paquets.

#### Paramètres spécifiques

| Paramètre   | Type   | Obligatoire | Description                     |
|-------------|--------|-------------|---------------------------------|
| `operation` | string | Oui         | Doit être `"remove"`            |
| `packages`  | array  | Oui         | Tableau des paquets à supprimer |

#### Valeur de retour

Cette opération retourne un objet avec les propriétés suivantes :

| Propriété | Type   | Toujours retourné | Description                                                    |
|-----------|--------|-------------------|----------------------------------------------------------------|
| `code`    | number | Oui               | Code retour de la commande (0 = succès, autre valeur = erreur) |
| `output`  | string | Oui               | La sortie de la commande dans la console                       |

#### Exemple

```yaml
- name: "Supprimer Lodash"
  action:
    type: "package"
    operation: "remove"
    packages:
      - "lodash"
```

### Exécuter un paquet

L'opération `run` permet d'exécuter un paquet.

#### Paramètres spécifiques

| Paramètre   | Type   | Obligatoire | Description                |
|-------------|--------|-------------|----------------------------|
| `operation` | string | Oui         | Doit être `"run"`          |
| `package`   | string | Oui         | Nom du paquet à exécuter   |
| `options`   | string | Non         | Options à passer au paquet |

#### Valeur de retour

Cette opération retourne un objet avec les propriétés suivantes :

| Propriété | Type   | Toujours retourné | Description                                                    |
|-----------|--------|-------------------|----------------------------------------------------------------|
| `code`    | number | Oui               | Code retour de la commande (0 = succès, autre valeur = erreur) |
| `output`  | string | Oui               | La sortie de la commande dans la console                       |

#### Exemple

```yaml
- name: "Créer un projet React"
  action:
    type: "package"
    operation: "run"
    package: "create-react-app"
    options: "{PROJECT_NAME}"
```

### Mettre à jour des paquets

L'opération `update` permet de mettre à jour un ou plusieurs paquets.

#### Paramètres spécifiques

| Paramètre   | Type   | Obligatoire | Description                         |
|-------------|--------|-------------|-------------------------------------|
| `operation` | string | Oui         | Doit être `"update"`                |
| `packages`  | array  | Oui         | Tableau des paquets à mettre à jour |

#### Valeur de retour

Cette opération retourne un objet avec les propriétés suivantes :

| Propriété | Type   | Toujours retourné | Description                                                    |
|-----------|--------|-------------------|----------------------------------------------------------------|
| `code`    | number | Oui               | Code retour de la commande (0 = succès, autre valeur = erreur) |
| `output`  | string | Oui               | La sortie de la commande dans la console                       |

#### Exemple

```yaml
- name: "Mettre à jour React et React DOM"
  action:
    type: "package"
    operation: "update"
    packages:
      - "react"
      - "react-dom"
```

### Utilisation avec des variables

Vous pouvez utiliser des variables dans les noms de paquets et les options en utilisant la syntaxe `{VARIABLE_NAME}` :

```yaml
- name: "Sélectionner des paquets"
  action:
    type: "prompt"
    promptType: "checkbox"
    message: "Quels paquets souhaitez-vous installer ?"
    choices:
      react: "React"
      vue: "Vue.js"
      angular: "Angular"
    defaultValues:
      - react
  variable: "SELECTED_PACKAGES"

- name: "Installer React"
  condition: '"react" in SELECTED_PACKAGES'
  action:
    type: "package"
    operation: "install"
    packages:
      - "react"
      - "react-dom"
```

### Gestion des erreurs

Vous pouvez gérer les erreurs qui peuvent survenir lors des opérations sur les paquets en utilisant les attributs
`onSuccess` et `onFailure` :

```yaml
- name: "Installer TypeScript"
  action:
    type: "package"
    operation: "install"
    packages:
      - "typescript"
    dev: true
  onSuccess:
    - action:
        type: "message"
        content: "TypeScript installé avec succès."
        style: "success"
  onFailure:
    - action:
        type: "message"
        content: "Échec de l'installation de TypeScript. Vérifiez votre connexion internet."
        style: "error"
```

### Détection du gestionnaire de paquets

Codx détecte automatiquement le gestionnaire de paquets à utiliser (npm, yarn, pnpm, bun) en fonction du système. Vous
pouvez également spécifier explicitement le gestionnaire de paquets à utiliser en
utilisant l'option --pm lors de l'exécution de la recette :

```shell
bunx codx run ./chemin/vers/la/recette.yml --pm yarn
```

### Bonnes pratiques

- **Versions spécifiques** : Spécifiez des versions précises pour les paquets critiques pour éviter les problèmes de
  compatibilité.
- **Dépendances de développement** : Utilisez `dev: true` pour les paquets qui ne sont nécessaires que pendant le
  développement.
- **Vérification préalable** : Utilisez l'opération `check` pour vérifier si les paquets sont déjà installés avant de
  les installer.
- **Gestion des erreurs** : Utilisez toujours `onSuccess` et `onFailure` pour gérer les cas où les opérations échouent.
- **Groupement** : Groupez les installations de paquets liés dans une seule action pour améliorer les performances.

### Cas d'utilisation courants

#### Installation d'un framework frontend

```yaml
- name: "Installer React et ses dépendances"
  action:
    type: "package"
    operation: "install"
    packages:
      - "react"
      - "react-dom"
      - "react-scripts"
```

#### Configuration d'un environnement de développement

```yaml
- name: "Installer les outils de développement"
  action:
    type: "package"
    operation: "install"
    packages:
      - "eslint"
      - "prettier"
      - "typescript"
      - "jest"
    dev: true
```

#### Création d'un nouveau projet

```yaml
- name: "Créer un projet React"
  action:
    type: "package"
    operation: "run"
    package: "create-react-app"
    options: "{PROJECT_NAME}"
  onSuccess:
    - action:
        type: "message"
        content: "Projet React créé avec succès !"
        style: "success"
```

[↑ Liste des actions](../actions.md)

[← Message](message.md) ─ [Prompt →](prompt.md)
