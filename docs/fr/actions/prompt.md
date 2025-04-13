# Action Prompt

L'action `prompt` permet de demander des informations à l'utilisateur pendant l'exécution d'une recette. Cette action
est essentielle pour créer des recettes interactives qui peuvent s'adapter aux besoins spécifiques de l'utilisateur.

## Types de prompts

L'action `prompt` prend en charge plusieurs types de prompts, chacun adapté à un type d'information différent :

1. `checkbox`: [Prompt à cases à cocher](#prompt-à-cases-à-cocher), pour sélectionner une ou plusieurs options
2. `confirm`: [Prompt de confirmation](#prompt-de-confirmation), pour répondre par oui ou non
3. `number`: [Prompt numérique](#prompt-numérique), pour saisir des nombres
4. `select`: [Prompt de sélection](#prompt-de-sélection), pour choisir une option parmi plusieurs
5. `text`: [Prompt de texte](#prompt-de-texte), pour saisir du texte libre

## Paramètres communs

| Paramètre    | Type   | Obligatoire | Description                                                                  |
|--------------|--------|-------------|------------------------------------------------------------------------------|
| `type`       | string | Oui         | Doit être `"prompt"`                                                         |
| `promptType` | string | Oui         | Type de prompt (`"text"`, `"number"`, `"select"`, `"checkbox"`, `"confirm"`) |
| `message`    | string | Oui         | Le message à afficher à l'utilisateur                                        |

## Détails des prompts

### Prompt à cases à cocher

Le prompt à cases à cocher permet à l'utilisateur de sélectionner plusieurs options.

#### Paramètres spécifiques

| Paramètre       | Type   | Obligatoire | Valeur par défaut | Description                                           |
|-----------------|--------|-------------|-------------------|-------------------------------------------------------|
| `promptType`    | string | Oui         | -                 | Doit être `"checkbox"`                                |
| `choices`       | object | Oui         | -                 | Objet avec les choix disponibles (clé-valeur)         |
| `defaultValues` | array  | Non         | -                 | Tableau des clés des options sélectionnées par défaut |

#### Valeur de retour

Ce prompt retourne un objet avec les propriétés suivantes :

| Propriété | Type  | Toujours retourné | Description                                                  |
|-----------|-------|-------------------|--------------------------------------------------------------|
| `answers` | array | Oui               | Liste des clefs de `choices` sélectionnées par l'utilisateur |

#### Exemple

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
    defaultValues:
      - eslint
      - prettier
  variable: "SELECTED_TOOLS"
```

Cela produit le prompt suivant :

```shell
### Sélectionner des outils
? Outils à installer : (Press <space> to select, <a> to toggle all, <i> to invert selection, and <enter> to proceed)
❯◉ ESLint
 ◉ Prettier
 ◯ TypeScript
```

Puis, une fois répondu :

```shell
### Sélectionner des outils
? Outils à installer : ESLint, Prettier
```

### Prompt de confirmation

Le prompt de confirmation permet à l'utilisateur de répondre par oui ou non.

#### Paramètres spécifiques

| Paramètre      | Type    | Obligatoire | Valeur par défaut | Description                                       |
|----------------|---------|-------------|-------------------|---------------------------------------------------|
| `promptType`   | string  | Oui         | -                 | Doit être `"confirm"`                             |
| `defaultValue` | boolean | Non         | `false`           | Valeur par défaut (true pour Oui, false pour Non) |

#### Valeur de retour

Ce prompt retourne un objet avec les propriétés suivantes :

| Propriété | Type    | Toujours retourné | Description                                                         |
|-----------|---------|-------------------|---------------------------------------------------------------------|
| `answer`  | boolean | Oui               | Booléen indiquant si l'utilisateur a confirmé (true) ou non (false) |

#### Exemple

```yaml
- name: "Confirmer l'installation de TypeScript"
  action:
    type: "prompt"
    promptType: "confirm"
    message: "Installer TypeScript ?"
    defaultValue: true
  variable: "INSTALL_TYPESCRIPT"
```

Cela produit le prompt suivant :

```shell
### Confirmer l'installation de TypeScript
? Installer TypeScript ? (Y/n) 
```

Puis, une fois répondu :

```shell
### Confirmer l'installation de TypeScript
? Installer TypeScript ? Yes
```

### Prompt numérique

Le prompt numérique permet à l'utilisateur de saisir un nombre.

#### Paramètres spécifiques

| Paramètre      | Type             | Obligatoire | Valeur par défaut | Description                                |
|----------------|------------------|-------------|-------------------|--------------------------------------------|
| `promptType`   | string           | Oui         | -                 | Doit être `"number"`                       |
| `defaultValue` | number ou string | Non         | -                 | Valeur par défaut proposée à l'utilisateur |

#### Valeur de retour

Ce prompt retourne un objet avec les propriétés suivantes :

| Propriété | Type   | Toujours retourné | Description                    |
|-----------|--------|-------------------|--------------------------------|
| `answer`  | number | Oui               | Nombre saisi par l'utilisateur |

#### Exemple

```yaml
- name: "Définir le port du serveur"
  action:
    type: "prompt"
    promptType: "number"
    message: "Port du serveur :"
    defaultValue: 3000
  variable: "SERVER_PORT"
```

Cela produit le prompt suivant :

```shell
### Définir le port du serveur
? Port du serveur : (3000) 
```

Puis, une fois répondu :

```shell
### Définir le port du serveur
? Port du serveur : 3001 
```

### Prompt de sélection

Le prompt de sélection permet à l'utilisateur de choisir une option parmi plusieurs.

#### Paramètres spécifiques

| Paramètre      | Type   | Obligatoire | Valeur par défaut | Description                                   |
|----------------|--------|-------------|-------------------|-----------------------------------------------|
| `promptType`   | string | Oui         | -                 | Doit être `"select"`                          |
| `choices`      | object | Oui         | -                 | Objet avec les choix disponibles (clé-valeur) |
| `defaultValue` | string | Non         | -                 | Clé de l'option sélectionnée par défaut       |

#### Valeur de retour

Ce prompt retourne un objet avec les propriétés suivantes :

| Propriété | Type   | Toujours retourné | Description                                      |
|-----------|--------|-------------------|--------------------------------------------------|
| `answer`  | string | Oui               | Clef de `choices` sélectionnée par l'utilisateur |

#### Exemple

```yaml
- name: "Choisir un framework"
  action:
    type: "prompt"
    promptType: "select"
    message: "Framework à utiliser :"
    choices:
      react: "React"
      vue: "Vue.js"
      angular: "Angular"
    defaultValue: "react"
  variable: "FRAMEWORK"
```

Cela produit le prompt suivant :

```shell
### Choisir un framework
? Framework à utiliser : (Use arrow keys)
❯ React 
  Vue.js 
  Angular 
```

Puis, une fois répondu :

```shell
### Choisir un framework
? Framework à utiliser : Angular
```

### Prompt de texte

Le prompt de texte permet à l'utilisateur de saisir du texte libre.

#### Paramètres spécifiques

| Paramètre      | Type   | Obligatoire | Valeur par défaut | Description                                |
|----------------|--------|-------------|-------------------|--------------------------------------------|
| `promptType`   | string | Oui         | -                 | Doit être `"text"`                         |
| `defaultValue` | string | Non         | -                 | Valeur par défaut proposée à l'utilisateur |

#### Valeur de retour

Ce prompt retourne un objet avec les propriétés suivantes :

| Propriété | Type   | Toujours retourné | Description                   |
|-----------|--------|-------------------|-------------------------------|
| `answer`  | string | Oui               | Texte saisi par l'utilisateur |

#### Exemple

```yaml
- name: "Saisir le nom du projet"
  action:
    type: "prompt"
    promptType: "text"
    message: "Nom du projet :"
    defaultValue: "mon-projet"
  variable: "PROJECT_NAME"
```

Cela produit le prompt suivant :

```shell
### Saisir le nom du projet
? Nom du projet : (mon-projet)
```

Puis, une fois répondu :

```shell
### Saisir le nom du projet
? Nom du projet : foobar
```

### Erreurs possibles

Cette action peut lancer les erreurs suivantes :
 
| Type d'erreur             | Description                                         |
|---------------------------|-----------------------------------------------------|
| `MissingMessageCodxError` | Lancée lorsque le paramètre `message` est manquant. |

### Utilisation des résultats

Les résultats des prompts sont stockés dans des variables qui peuvent être utilisées dans les étapes suivantes de la
recette.

#### Types de résultats

- **Prompt de texte** : Chaîne de caractères
- **Prompt numérique** : Nombre
- **Prompt de sélection** : Chaîne de caractères (la clé de l'option sélectionnée)
- **Prompt à cases à cocher** : Tableau de chaînes de caractères (les clés des options sélectionnées)
- **Prompt de confirmation** : Booléen (true ou false)

#### Exemple d'utilisation des résultats

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

- name: "Installer ESLint"
  condition: '"eslint" in SELECTED_TOOLS'
  action:
    type: "package"
    operation: "install"
    packages:
      - "eslint"
    dev: true
```

### Bonnes pratiques

- Utilisez des messages clairs et concis pour guider l'utilisateur
- Fournissez des valeurs par défaut pertinentes pour accélérer le processus
- Utilisez le type de prompt le plus approprié pour chaque type d'information
- Limitez le nombre de prompts pour ne pas surcharger l'utilisateur
- Regroupez les prompts liés au début de la recette quand c'est possible
- Utilisez des conditions pour éviter de demander des informations inutiles

[↑ Liste des actions](../actions.md)

[← Package](package.md)
