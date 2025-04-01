# Actions dans Codx

Ce document présente un aperçu des différentes actions dans Codx. Pour une documentation détaillée de chaque
action, veuillez consulter les liens correspondants.

## Types d'actions

Codx propose plusieurs types d'actions pour automatiser différentes tâches :

1. [ChangeDir](actions/changeDir.md) - Changer de répertoire de travail
2. [Command](actions/command.md) - Exécuter des commandes shell
3. [FileSystem](actions/fileSystem.md) - Manipuler des fichiers et des répertoires
4. [Message](actions/message.md) - Afficher des messages à l'utilisateur
5. [Package](actions/package.md) - Gérer des paquets et des dépendances
6. [Prompt](actions/prompt.md) - Demander des informations à l'utilisateur

Chaque action a un type spécifique et des paramètres associés. Vous trouverez ci-dessous un bref aperçu de chaque type
d'action.

## ChangeDir

L'action `changeDir` permet de changer le répertoire de travail courant pendant l'exécution d'une recette. Cette action
est utile lorsque vous devez exécuter des commandes dans un répertoire spécifique.

Vous pouvez spécifier des chemins absolus ou relatifs, et utiliser des variables pour construire dynamiquement le
chemin.

Pour plus de détails, consultez la [documentation complète de l'action ChangeDir](actions/changeDir.md).

## Command

L'action `command` permet d'exécuter des commandes shell dans le terminal. Cette action est fondamentale pour
automatiser des tâches comme l'installation de dépendances, la compilation de code, ou toute autre opération nécessitant
l'utilisation du terminal.

Vous pouvez exécuter n'importe quelle commande shell valide, y compris celles utilisant des variables définies
précédemment dans votre recette.

Pour plus de détails, consultez la [documentation complète de l'action Command](actions/command.md).

## FileSystem

L'action `fileSystem` permet de manipuler des fichiers et des répertoires. Cette action est essentielle pour créer,
modifier, supprimer, copier ou déplacer des fichiers et des répertoires dans votre projet.

Plusieurs opérations sont disponibles :

- **create** : Créer un fichier avec un contenu spécifique
- **delete** : Supprimer un fichier ou un répertoire
- **exists** : Vérifier si un fichier ou un répertoire existe
- **mkdir** : Créer un répertoire
- **copy** : Copier un fichier ou un répertoire
- **move** : Déplacer un fichier ou un répertoire

Ces opérations vous permettent d'automatiser la gestion des fichiers et des répertoires dans vos recettes.

Pour plus de détails, consultez la [documentation complète de l'action FileSystem](actions/fs.md).

## Message

L'action `message` permet d'afficher des messages à l'utilisateur pendant l'exécution d'une recette. Cette action est
utile pour fournir des informations, des instructions ou des retours sur l'état d'avancement de la recette.

Différents styles de messages sont disponibles : `header`, `info`, `success`, `warning`, `error`, et `default`.

Pour plus de détails, consultez la [documentation complète de l'action Message](actions/message.md).

## Package

L'action `package` permet de gérer des paquets et des dépendances dans votre projet. Cette action est particulièrement
utile pour automatiser l'installation, la suppression, la mise à jour et la vérification des dépendances de votre
projet.

Plusieurs opérations sont disponibles :

- **install** : Installer des paquets
- **remove** : Supprimer des paquets
- **update** : Mettre à jour des paquets
- **check** : Vérifier la présence et la version des paquets
- **run** : Exécuter un paquet

Ces opérations vous permettent d'automatiser la gestion des dépendances dans vos recettes, ce qui est particulièrement
utile pour configurer rapidement un environnement de développement.

Pour plus de détails, consultez la [documentation complète de l'action Package](actions/package.md).

## Prompt

L'action `prompt` permet de demander des informations à l'utilisateur pendant l'exécution d'une recette. Cette action
est essentielle pour rendre vos recettes interactives et personnalisables.

Plusieurs types de prompts sont disponibles :

- **text** : Pour saisir du texte
- **number** : Pour saisir des valeurs numériques
- **select** : Pour choisir une option parmi plusieurs
- **checkbox** : Pour sélectionner plusieurs options
- **confirm** : Pour répondre par oui ou non

Les valeurs saisies par l'utilisateur peuvent être stockées dans des variables pour être utilisées ultérieurement dans
la recette.

Pour plus de détails, consultez la [documentation complète de l'action Prompt](actions/prompt.md).

[← Variables et interpolation](variables-et-interpolation.md) ─ [Conditions →](conditions.md)
