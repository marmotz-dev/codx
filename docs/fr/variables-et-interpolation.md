# Variables et interpolation dans Codx

Cette page explique comment utiliser les variables et l'interpolation dans les recettes Codx pour stocker et réutiliser
des valeurs.

## Introduction aux variables

Les variables dans Codx permettent de stocker des valeurs qui peuvent être réutilisées à différents endroits de votre
recette. Elles sont particulièrement utiles pour :

- Stocker les entrées utilisateur
- Réutiliser des valeurs dans plusieurs étapes
- Rendre vos recettes dynamiques et adaptables
- Prendre des décisions conditionnelles

## Définition des variables

Les variables sont définies à l'aide de l'attribut `variable` dans une étape. La valeur de retour de l'action est alors
stockée dans la variable spécifiée.

Exemple de définition d'une variable :

```yaml
- name: "Saisir le nom du projet"
  action:
    type: "prompt"
    promptType: "text"
    message: "Nom du projet :"
    defaultValue: "mon-projet"
  variable: "PROJECT_NAME"
```

Dans cet exemple, la réponse de l'utilisateur au prompt est stockée dans la variable `PROJECT_NAME`.

## Types de variables

Les variables peuvent contenir différents types de valeurs, selon l'action qui les définit :

* une chaîne de caractères dans la plupart des actions,
* un nombre, par exemple pour l'action prompt.number,
* un tableau de chaines de caractères, par exemple pour l'action prompt.checkbox,
* un booléen, par exemple pour l'action fileSystem.exists.

## Interpolation dans les chaînes de caractères

L'interpolation permet d'insérer la valeur d'une variable dans une chaîne de caractères. Dans Codx, l'interpolation
utilise la syntaxe `{VARIABLE_NAME}`.

Exemple d'interpolation :

```yaml
- name: "Créer le répertoire du projet"
  action:
    type: "fileSystem"
    operation: "mkdir"
    path: "{PROJECT_NAME}"
```

Dans cet exemple, `{PROJECT_NAME}` sera remplacé par la valeur de la variable `PROJECT_NAME`.

L'interpolation fonctionne dans la plupart des champs de type chaîne de caractères dans les recettes, notamment :

- Les chemins de fichiers et de répertoires
- Les messages affichés à l'utilisateur
- Les commandes shell
- Les contenus de fichiers

### Exemples d'interpolation dans différents contextes

#### Dans les chemins de fichiers

```yaml
- name: "Créer un fichier de configuration"
  action:
    type: "fileSystem"
    operation: "create"
    path: "{PROJECT_NAME}/config.json"
    content: "{ \"name\": \"{PROJECT_NAME}\" }"
```

#### Dans les commandes shell

```yaml
- name: "Initialiser le projet"
  action:
    type: "command"
    command: "npm init -y && npm pkg set name={PROJECT_NAME}"
```

#### Dans les messages

```yaml
- name: "Afficher un message de confirmation"
  action:
    type: "message"
    content: "Le projet {PROJECT_NAME} a été créé avec succès sur le port {SERVER_PORT}."
    style: "success"
```

## Utilisation des variables dans les conditions

Les variables peuvent être utilisées dans les conditions pour exécuter des étapes de manière conditionnelle. Dans ce
contexte, les variables sont utilisées directement par leur nom, sans accolades.

Exemples d'utilisation de variables dans les conditions :

```yaml
condition: 'PROJECT_TYPE == "react"'
condition: '"eslint" in SELECTED_TOOLS'
condition: 'SERVER_PORT > 3000'
condition: 'INSTALL_TYPESCRIPT == true'
```

Pour plus d'informations sur les conditions, consultez la [documentation des conditions](conditions.md).

## Variables prédéfinies

Codx fournit certaines variables prédéfinies qui peuvent être utilisées dans vos recettes :

| Variable                      | Description                                                                                                                                           |
|-------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|
| `$CWD`                        | Le chemin absolu du répertoire d'exécution de Codx                                                                                                    |
| `$RECIPE_DIRECTORY`           | Le chemin absolu du répertoire de la recette                                                                                                          |
| `$PROJECT_DIRECTORY`          | Le chemin absolu du répertoire courant du projet                                                                                                      |
| `$RELATIVE_PROJECT_DIRECTORY` | Le chemin relatif au chemin d'exécution de Codx du répertoire courant du projet                                                                       |
| `$PACKAGE_MANAGER`            | Le nom du package manager utilisé                                                                                                                     |
| `$PACKAGE_COMMANDS`           | Les commandes liés au package manager courant (Objet contenant les propriétés `install`, `installDev`, `remove`, `update`, `execute`, `globalOption`) |
| true                          | Vaut `true`                                                                                                                                           |
| false                         | Vaut `false`                                                                                                                                          |

## Bonnes pratiques

- Utilisez des noms de variables explicites.
- Les variables commençant par `$` sont des variables internes non modifiables. De plus, vous ne pouvez pas créer de
  variables commençant par `$`.
- Définissez toutes les variables nécessaires au début de la recette quand c'est possible.
- Utilisez l'interpolation pour rendre vos recettes plus dynamiques et réutilisables.
- Vérifiez que les variables sont définies avant de les utiliser.
- Utilisez des conditions pour gérer les cas où une variable pourrait ne pas être définie.

## Exemples complets

Voici un exemple complet d'utilisation de variables et d'interpolation dans une recette :

```yaml
description: "Configuration d'un projet web"
author: "Auteur"

steps:
  - name: "Saisir le nom du projet"
    action:
      type: "prompt"
      promptType: "text"
      message: "Nom du projet :"
      defaultValue: "mon-projet-web"
    variable: "PROJECT_NAME"

  - name: "Définir le port du serveur"
    action:
      type: "prompt"
      promptType: "number"
      message: "Port du serveur :"
      defaultValue: 3000
    variable: "SERVER_PORT"

  - name: "Choisir un framework"
    action:
      type: "prompt"
      promptType: "select"
      message: "Framework à utiliser :"
      choices:
        angular: "Angular"
        react: "React"
        vue: "Vue.js"
      defaultValue: "angular"
    variable: "FRAMEWORK"

  - name: "Créer le répertoire du projet"
    action:
      type: "fileSystem"
      operation: "mkdir"
      path: "{PROJECT_NAME}"

  - name: "Créer le fichier package.json"
    action:
      type: "fileSystem"
      operation: "create"
      path: "{PROJECT_NAME}/package.json"
      content: |
        {
          "name": "{PROJECT_NAME}",
          "version": "1.0.0",
          "description": "Projet {FRAMEWORK}",
          "scripts": {
            "start": "serve -p {SERVER_PORT}"
          }
        }

  - name: "Installer les dépendances React"
    condition: 'FRAMEWORK == "react"'
    action:
      type: "package"
      operation: "install"
      packages:
        - "react"
        - "react-dom"
      workingDirectory: "{PROJECT_NAME}"

  - name: "Afficher un message de confirmation"
    action:
      type: "message"
      content: |
        🎉 Projet {PROJECT_NAME} créé avec succès !

        Framework: {FRAMEWORK}
        Port du serveur: {SERVER_PORT}

        Pour démarrer le projet :
        cd {PROJECT_NAME}
        npm start
      style: "success"
```

[← Écriture de recettes](ecriture-recettes.md) ─ [Actions →](actions.md)