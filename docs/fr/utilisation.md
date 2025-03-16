# Installation et utilisation de Codx

Ce guide vous explique comment installer et utiliser Codx pour automatiser l'installation et la configuration de
bibliothèques et d'outils dans vos projets.

## Installation

Vous pouvez installer Codx globalement en utilisant votre gestionnaire de paquets préféré :

* avec npm : `npm install -g codx`
* avec yarn : `yarn global add codx`
* avec pnpm : `pnpm add -g codx`
* avec bun : `bun add -g codx`

Vous pouvez également lancer Codx sans installation :

* avec npm : `npx codx`
* avec yarn : `yarn dlx codx`
* avec pnpm : `pnpm dlx codx`
* avec bun : `bunx codx`

## Utilisation de base

### Exécuter une recette

Pour exécuter une recette, utilisez la commande suivante :

```bash
codx run <nom-de-la-recette>
```

Si vous avez un fichier de recette local, vous pouvez l'exécuter avec :

```bash
codx run chemin/vers/recette.yml
```

#### Options

* `--pm <package-manager>` : force le package manager à utilisateur (valeurs possibles : npm, pnpm, yarn, bun). Par
  défaut, c'est le package manager servant pour lancer Codx qui sera utilisé.
* `-p, --project-dir <project-dir>` : défini le répertoire du projet. Par défaut, c'est le répertoire courant.
* `-v, --verbose` : affiche des messages de debug.

#### Exemples d'utilisation

Voici quelques exemples d'utilisation de Codx :

1. **Installer React avec Tailwind CSS et ESLint/Prettier** :
   ```bash
   codx recipe react
   ```

2. **Exécuter une recette personnalisée** :
   ```bash
   codx recipe ./mes-recettes/setup-projet.yml
   ```

### Rechercher des recettes

Pour rechercher des paquets npm liés à Codx, utilisez la commande suivante :

```bash
codx search <terme-de-recherche>
```

Cette commande recherche des recettes Codx. Les résultats affichent le nom du paquet, sa description, sa version, son
auteur et un lien vers la page du paquet.

#### Options

* `-v, --verbose` : affiche des messages de debug.

[← Accueil](index.md) ─ [Écriture de recettes →](ecriture-recettes.md)
