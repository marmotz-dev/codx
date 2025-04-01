# Action ChangeDir

L'action `changeDir` permet de changer le répertoire du projet courant pendant l'exécution d'une recette. Cette action
est utile lorsque vous devez exécuter des commandes ou effectuer des opérations dans un répertoire spécifique.

Le changement de répertoire est permanent, contrairement à la configuration `workingDirectory` qui ne concerne que
l'action courante.

## Paramètres

| Paramètre | Type   | Obligatoire | Description                                 |
|-----------|--------|-------------|---------------------------------------------|
| `type`    | string | Oui         | Doit être `"changeDir"`                     |
| `path`    | string | Oui         | Le chemin du répertoire vers lequel changer |

## Valeur de retour

Cette action ne retourne aucune valeur puisque le répertoire courant du projet est toujours accessible via les
variables suivantes:

* `$PROJECT_DIRECTORY` : chemin absolu du répertoire courant du projet
* `$RELATIVE_PROJECT_DIRECTORY` : chemin relatif au chemin d'exécution de Codx du répertoire courant du projet

## Exemples

### Changer vers un répertoire spécifique

```yaml
- action:
    type: "changeDir"
    path: "mon-projet"
```

### Changer vers un répertoire parent

```yaml
- action:
    type: "changeDir"
    path: ".."
```

### Changer vers un chemin absolu

```yaml
- action:
    type: "changeDir"
    path: "/home/utilisateur/projets/mon-projet"
```

## Utilisation avec des variables

Vous pouvez utiliser des variables dans le chemin en utilisant la syntaxe `{VARIABLE_NAME}` :

```yaml
- name: "Saisir le nom du projet"
  action:
    type: "prompt"
    promptType: "text"
    message: "Nom du projet :"
    defaultValue: "mon-projet"
  variable: "PROJECT_NAME"

- action:
    type: "changeDir"
    path: "{PROJECT_NAME}"
```

## Gestion des erreurs

Si le répertoire spécifié n'existe pas ou n'est pas accessible, l'action échouera. Vous pouvez gérer ces erreurs en
utilisant les attributs `onSuccess` et `onFailure` :

```yaml
- name: "Changer vers le répertoire du projet"
  action:
    type: "changeDir"
    path: "{PROJECT_NAME}"
  onSuccess:
    - action:
        type: "message"
        content: "Répertoire changé avec succès."
        style: "success"
  onFailure:
    - action:
        type: "message"
        content: "Le répertoire n'existe pas. Création en cours..."
        style: "warning"
    - action:
        type: "fileSystem"
        operation: "mkdir"
        path: "{PROJECT_NAME}"
    - action:
        type: "changeDir"
        path: "{PROJECT_NAME}"
```

## Bonnes pratiques

- **Vérification préalable** : Vérifiez que le répertoire existe avant d'essayer d'y accéder, ou utilisez `onFailure`
  pour gérer le cas où il n'existe pas.
- **Chemins relatifs** : Utilisez des chemins relatifs plutôt que des chemins absolus pour une meilleure portabilité.
- **Retour au répertoire initial** : Si vous changez de répertoire pour une opération temporaire, n'oubliez pas de
  revenir au répertoire initial après.

## Cas d'utilisation courants

### Création d'un projet et navigation vers son répertoire

```yaml
- name: "Créer un projet React"
  action:
    type: "package"
    operation: "run"
    package: "create-react-app"
    options: "{PROJECT_NAME}"

- name: "Naviguer vers le répertoire du projet"
  action:
    type: "changeDir"
    path: "{PROJECT_NAME}"
```

### Exécution de commandes dans un répertoire spécifique

Dans ce cas, il vaut mieux utiliser l'option de configuration `workingDirectory` :

```yaml
- name: "Installer les dépendances"
  action:
    type: "command"
    command: "npm install"
  workingDirectory: "front"
```

[↑ Liste des actions](../actions.md)

[Command →](command.md)
