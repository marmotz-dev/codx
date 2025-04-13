# Action Message

L'action `message` permet d'afficher des messages à l'utilisateur pendant l'exécution d'une recette. Cette action est
utile pour fournir des informations, des instructions ou des retours sur l'état d'avancement de la recette.

## Paramètres

| Paramètre | Type   | Obligatoire | Valeur par défaut | Description                      |
|-----------|--------|-------------|-------------------|----------------------------------|
| `type`    | string | Oui         | -                 | Doit être `"message"`            |
| `content` | string | Oui         | -                 | Le contenu du message à afficher |
| `style`   | string | Non         | `"default"`       | Le style du message              |

### Styles disponibles

- `"default"` : Style par défaut
- `"header"` : Style pour les titres ou en-têtes
- `"info"` : Style pour les informations générales
- `"success"` : Style pour les messages de succès
- `"warning"` : Style pour les avertissements
- `"error"` : Style pour les erreurs

## Valeur de retour

Cette action retourne un objet avec les propriétés suivantes :

| Propriété | Type   | Toujours retourné | Description                   |
|-----------|--------|-------------------|-------------------------------|
| `message` | string | Oui               | Message affiché               |
| `style`   | string | Oui               | Style utilisé pour le message |

#### Erreurs possibles

Cette action peut lancer les erreurs suivantes :

| Type d'erreur             | Description                                         |
|---------------------------|-----------------------------------------------------|
| `MissingContentCodxError` | Lancée lorsque le paramètre `content` est manquant. |

## Exemples

### Message par défaut

```yaml
- action:
    type: "message"
    content: "Installation en cours..."
```

Cela produit le message suivant :

```shell
Installation en cours...
```

### Message avec titre

```yaml
- action:
    type: "message"
    content: "Installation du projet"
    style: "header"
```

Cela produit le message suivant :

```shell
# Installation du projet
```

### Message d'information

```yaml
- action:
    type: "message"
    content: "Installation en cours..."
    style: "info"
```

Cela produit le message suivant :

```shell
ℹ Installation en cours...
```

### Message de succès

```yaml
- action:
    type: "message"
    content: "Installation terminée avec succès !"
    style: "success"
```

Cela produit le message suivant :

```shell
✓ Installation terminée avec succès !
```

### Message de warning

```yaml
- action:
    type: "message"
    content: "Fichier de configuration manquant. Création d'un nouveau fichier."
    style: "warning"
```

Cela produit le message suivant :

```shell
⚠ Fichier de configuration manquant. Création d'un nouveau fichier.
```

### Message d'erreur

```yaml
- action:
    type: "message"
    content: "Erreur lors de l'installation. Veuillez vérifier votre connexion internet."
    style: "error"
```

Cela produit le message suivant :

```shell
✗ Erreur lors de l'installation. Veuillez vérifier votre connexion internet.
```

## Utilisation avec des variables

Vous pouvez inclure des variables dans le contenu du message en utilisant la syntaxe `{VARIABLE_NAME}` :

```yaml
- name: "Saisir le nom du projet"
  action:
    type: "prompt"
    promptType: "text"
    message: "Nom du projet :"
    defaultValue: "mon-projet"
  variable: "PROJECT_NAME"

- action:
    type: "message"
    content: "Création du projet {PROJECT_NAME} en cours..."
    style: "info"
```

## Utilisation avec des conditions

Vous pouvez utiliser des conditions dans le contenu du message avec la syntaxe de template :

```yaml
- action:
    type: "message"
    content: |
      Installation terminée !

      Votre projet inclut :
      - React
      {{if INSTALL_TAILWIND}}
      - Tailwind CSS
      {{/if}}
      {{if INSTALL_TYPESCRIPT}}
      - TypeScript
      {{/if}}
    style: "success"
```

## Bonnes pratiques

- Utilisez des messages avec le style `"header"` pour indiquer le début d'une nouvelle section ou étape importante
- Utilisez des messages avec le style `"info"` pour fournir des informations supplémentaires ou des instructions
- Utilisez des messages avec le style `"success"` pour confirmer qu'une opération s'est terminée avec succès
- Utilisez des messages avec le style `"warning"` pour avertir l'utilisateur de situations potentiellement
  problématiques
- Utilisez des messages avec le style `"error"` pour signaler des problèmes qui nécessitent l'attention de l'utilisateur

[↑ Liste des actions](../actions.md)

[← FileSystem](fileSystem.md) ─ [Package →](package.md)
