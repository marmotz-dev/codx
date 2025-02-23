# Codx

Codx est un outil en ligne de commande qui automatise l'installation et la configuration des bibliothèques et outils
tiers dans vos
projets. Au lieu de suivre manuellement des étapes complexes de documentation, vous pouvez utiliser des recettes Codx
pour automatiser le processus.

## Table des matières

1. [Pour commencer](#pour-commencer)
2. [Installation](#installation)
3. [Utilisation](#utilisation)
4. [Référence des actions](actions.md)
5. [Écrire des recettes](writing-recipes.md)

## Pour commencer

Codx vous permet de :

- Installer des dépendances avec des versions spécifiques
- Créer des fichiers de configuration
- Et plus encore...

## Installation

Vous pouvez installer Codx globalement en utilisant le gestionnaire de paquets de votre choix :

* avec npm : `npm install -g codx`
* avec yarn : `yarn global add codx`
* avec pnpm : `pnpm add -g codx`
* avec bun : `bun add -g codx`

Vous pouvez également lancer Codx sans installation :

* avec npm : `npx codx`
* avec yarn : `yarn dlx codx`
* avec pnpm : `pnpm dlx codx`
* avec bun : `bunx codx`

## Utilisation

Pour exécuter une recette : `codx recipe <nom-de-la-recette>`
Ou si vous avez un fichier de recette local : `codx recipe chemin/vers/recette.yml`