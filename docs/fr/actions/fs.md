# Référence des Actions liées au système de fichier

Ce document détaille toutes les actions disponibles, liées au système de fichier, qui peuvent être utilisées dans les
recettes Codx.

## Copie de fichiers et répertoires (copy)

Copie des fichiers ou répertoires du répertoire de recette vers le répertoire de votre projet.

Si besoin, cela créé des répertoires.

### Paramètres

Tableau d'objets avec, pour chaque objet :

* from : Chemin source (relatif au répertoire de recette)
* to : Chemin de destination (relatif au répertoire du projet)

Exemple :

```yaml
recipe:
  - fs.copy:
      - from: root
        to: .
      - from: test.json
        to: config/.test.json
      - from: back-config
        to: back/config
```

copie:

* le contenu du répertoire `/recipe/root` dans `/project/` ;
* le fichier `/recipe/test.json` vers `/project/config/.test.json`, renomme le fichier `test.json` en `.test.json` et,
  si besoin, crée le répertoire `/project/config/` ;
* le répertoire `/recipe/back-config` et son contenu vers `/project/back/config`, renomme le répertoire `back-config` en
  `config` et, si besoin, crée le répertoire `/project/back/`.

## Suppression de fichiers et répertoires (copy)

Supprime des fichiers ou répertoires dans le répertoire de votre projet.

Si c'est un répertoire, cela supprime récursivement tous les fichiers et répertoires qu'il contient.

### Paramètres

Un chemin à supprimer ou une liste de chemin à supprimer.

Exemple :

```yaml
recipe:
  - fs.delete: test.json
  - fs.delete:
      - front/config.json
      - back/config
```

supprime:

* le fichier `/project/test.json` ;
* le fichier `/project/front/config.json` ;
* le répertoire `/project/back/config` et son contenu (fichiers et répertoires).

## Création de répertoire (mkdir)

Créé un ou plusieurs répertoires dans le répertoire de votre projet.

### Paramètres

Un chemin à créer ou une liste de chemin à créer.

Exemple :

```yaml
recipe:
  - fs.mkdir: test
  - fs.mkdir:
      - front/config
      - back/config
```

créé:

* le répertoire `/project/test/` ;
* le répertoire `/project/front/config` ;
* le répertoire `/project/back/config`. 
