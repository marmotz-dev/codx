# Action Command

L'action `command` permet d'exécuter des commandes shell pendant l'exécution d'une recette. Cette action est utile pour
exécuter des commandes système, des scripts ou des outils en ligne de commande.

## Paramètres

| Paramètre | Type   | Obligatoire | Description                  |
|-----------|--------|-------------|------------------------------|
| `type`    | string | Oui         | Doit être `"command"`        |
| `command` | string | Oui         | La commande shell à exécuter |

## Valeur de retour

Cette action retourne un objet avec les propriétés suivantes :

| Propriété | Type   | Toujours retourné | Description                                                    |
|-----------|--------|-------------------|----------------------------------------------------------------|
| `code`    | number | Oui               | Code retour de la commande (0 = succès, autre valeur = erreur) |
| `output`  | string | Oui               | La sortie de la commande dans la console                       |

## Exemples

### Commande simple

```yaml
- action:
    type: "command"
    command: "echo 'Hello, world!'"
```

### Initialisation d'un dépôt Git

```yaml
- action:
    type: "command"
    command: "git init"
```

### Exécution d'un script

```yaml
- action:
    type: "command"
    command: "bash ./scripts/setup.sh"
```

## Utilisation avec des variables

Vous pouvez inclure des variables dans la commande en utilisant la syntaxe `{VARIABLE_NAME}` :

```yaml
- name: "Saisir le nom du projet"
  action:
    type: "prompt"
    promptType: "text"
    message: "Nom du projet :"
    defaultValue: "mon-projet"
  variable: "PROJECT_NAME"

- action:
    type: "command"
    command: "mkdir -p {PROJECT_NAME}/src"
```

## Gestion des erreurs

Si la commande échoue (code de sortie non nul), l'action échouera également. Vous pouvez gérer ces erreurs en utilisant
les attributs `onSuccess` et `onFailure` :

```yaml
- name: "Vérifier la présence de Node.js"
  action:
    type: "command"
    command: "node --version"
  onSuccess:
    - action:
        type: "message"
        content: "Node.js est installé."
        style: "success"
  onFailure:
    - action:
        type: "message"
        content: "Node.js n'est pas installé. Installation en cours..."
        style: "warning"
    - action:
        type: "command"
        command: "curl -fsSL https://nodejs.org/install.sh | bash"
```

## Bonnes pratiques

- **Portabilité** : Tenez compte des différences entre les systèmes d'exploitation. Certaines commandes peuvent ne pas
  fonctionner de la même manière sur tous les systèmes.
- **Gestion des erreurs** : Utilisez toujours `onSuccess` et `onFailure` pour gérer les cas où la commande échoue.
- **Verbosité** : Ajoutez des messages pour informer l'utilisateur de ce qui se passe, surtout pour les commandes
  longues.

## Limitations

- L'action `command` exécute les commandes dans le shell par défaut du système.
- Les commandes interactives qui nécessitent une entrée utilisateur ne fonctionneront pas correctement.
- Les commandes qui modifient l'environnement shell (comme `cd`) n'affecteront pas les commandes suivantes. Utilisez
  plutôt l'action `changeDir` pour changer de répertoire.

## Alternatives

Pour certaines opérations courantes, il est préférable d'utiliser des actions spécialisées plutôt que l'action
`command` :

- Pour changer de répertoire : utilisez l'action `changeDir`
- Pour manipuler des fichiers : utilisez l'action `fileSystem`
- Pour gérer des paquets : utilisez l'action `package`

Ces actions spécialisées offrent une meilleure gestion des erreurs et une meilleure portabilité entre les systèmes
d'exploitation.

[↑ Liste des actions](../actions.md)

[← ChangeDir](changeDir.md) ─ [Fail →](fail.md)
