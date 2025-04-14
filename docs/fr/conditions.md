# Conditions dans Codx

Cette page explique comment utiliser les conditions dans les recettes Codx pour exécuter des étapes de manière
conditionnelle.

## Introduction aux conditions

Les conditions dans Codx permettent d'exécuter des étapes de manière conditionnelle en fonction de variables définies
précédemment dans la recette. Elles sont évaluées comme vrai ou faux.

Chaque étape d'une recette peut inclure un attribut `condition` qui détermine si l'étape sera exécutée ou non.

## Syntaxe des conditions

Les conditions sont écrites sous forme de chaînes de caractères contenant des expressions qui sont évaluées à l'aide de
la bibliothèque [filtrex](https://github.com/cshaa/filtrex), qui permet d'évaluer des expressions de manière sécurisée.

Exemples de syntaxe de conditions :

```yaml
condition: 'PROJECT_TYPE == "react"'
condition: '"eslint" in SELECTED_TOOLS'
condition: 'INSTALL_TAILWIND == true'
condition: 'not PACKAGE_JSON_EXISTS'
```

## Utilisation des variables dans les conditions

Les conditions peuvent utiliser toutes les variables définies dans la recette. Ces variables peuvent être définies par
des actions précédentes, notamment les actions de type `prompt`.

Exemples d'utilisation de variables :

```yaml
- name: "Sélectionner des outils"
  action:
    type: "prompt"
    promptType: "checkbox"
    message: "Outils à installer :"
    choices:
      eslint: "ESLint"
      prettier: "Prettier"
      typescript: "TypeScript"
  variable: "SELECTED_TOOLS"

- name: "Installation d'ESLint"
  condition: '"eslint" in SELECTED_TOOLS'
  action:
    type: "package"
    operation: "install"
    packages:
      - "eslint"
      - "eslint-plugin-react"
    dev: true
```

Dans cet exemple, l'étape "Installation d'ESLint" ne sera exécutée que si l'utilisateur a sélectionné "ESLint" dans la
liste des outils.

## Opérateurs et expressions

Vous pouvez utiliser différents opérateurs et expressions dans vos conditions :

### Opérateurs de comparaison

- `==` : égalité
- `!=` : inégalité
- `>`, `>=`, `<`, `<=` : comparaisons numériques

### Opérateurs logiques

- `&&` : ET logique
- `||` : OU logique
- `not` : NON logique

### Opérateurs d'appartenance

- `in` : vérifie si une valeur est présente dans un tableau

### Fonction de vérification de type

- `instanceOf(object, "class")` : vérifie si une valeur est une instance d'un type spécifique, particulièrement utile
  pour la vérification des types d'erreurs

Exemples :

```yaml
condition: 'instanceOf($ERROR, "FileNotFoundCodxError")'
condition: 'instanceOf($ERROR, "HttpErrorCodxError")'
```

### Exemples d'expressions complexes

```yaml
condition: 'PROJECT_TYPE == "react" && INSTALL_TYPESCRIPT == true'
condition: 'PORT_NUMBER > 3000 || PORT_NUMBER < 1000'
condition: 'not (FRAMEWORK == "angular") && "eslint" in SELECTED_TOOLS'
```

### Documentation exhaustive

Pour plus d'informations sur les expressions possibles, consultez directement la documentation
de [filtrex](https://github.com/cshaa/filtrex).

## Conditions dans les messages

Vous pouvez également utiliser des conditions dans les messages pour afficher du texte de manière conditionnelle. La
syntaxe utilise des balises de template :

```yaml
- action:
    type: "message"
    content: |
      🎉 Installation terminée avec succès !

      Votre projet est configuré avec :
      - React
      {{if INSTALL_TAILWIND}}- Tailwind CSS{{/if}}
      {{if "eslint" in SELECTED_TOOLS}}- ESLint{{/if}}
    style: "success"
```

Dans cet exemple, les lignes "- Tailwind CSS" et "- ESLint" ne seront affichées que si les conditions correspondantes
sont remplies.

## Bonnes pratiques

- Utilisez des conditions pour éviter d'exécuter des étapes inutiles
- Assurez-vous que les variables utilisées dans les conditions sont définies avant d'être utilisées
- Testez vos conditions avec différentes valeurs pour vous assurer qu'elles fonctionnent comme prévu
- Pour les conditions complexes, envisagez de les diviser en plusieurs étapes avec des conditions plus simples

## Exemples complets

Voici un exemple complet d'utilisation de conditions dans une recette :

```yaml
description: "Configuration d'un projet avec des outils optionnels"
author: "Auteur"

steps:
  - name: "Choisir un framework"
    action:
      type: "prompt"
      promptType: "select"
      message: "Framework à utiliser :"
      choices:
        angular: "Angular"
        react: "React"
        vue: "Vue.js"
      defaultValue: "react"
    variable: "FRAMEWORK"

  - name: "Installer Tailwind CSS ?"
    action:
      type: "prompt"
      promptType: "confirm"
      message: "Voulez-vous installer Tailwind CSS ?"
      defaultValue: true
    variable: "INSTALL_TAILWIND"

  - name: "Installation de Tailwind CSS"
    condition: 'INSTALL_TAILWIND == true && FRAMEWORK == "angular"'
    action:
      type: "package"
      operation: "install"
      packages:
        - "tailwindcss"
        - "postcss"
        - "autoprefixer"
      dev: true
    onSuccess:
      - action:
          type: "message"
          content: "Tailwind CSS installé avec succès !"
          style: "success"
```

Dans cet exemple, Tailwind CSS ne sera installé que si l'utilisateur a choisi de l'installer et a sélectionné Angular
comme framework.

[← Variables et interpolation](variables-et-interpolation.md) | [Gestion des erreurs →](errors.md)
