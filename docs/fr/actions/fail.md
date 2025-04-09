# Action Fail

L'action `fail` permet de lever intentionnellement une erreur pendant l'exécution d'une recette. Cette action est utile pour arrêter l'exécution d'une recette lorsqu'une condition spécifique n'est pas remplie.

## Paramètres

| Paramètre | Type   | Obligatoire | Description                                                                                |
|-----------|--------|-------------|--------------------------------------------------------------------------------------------|
| `type`    | string | Oui         | Doit être `"fail"`                                                                         |
| `message` | string | Non         | Le message d'erreur à afficher. Par défaut : "Explicit failure triggered by fail action"   |

## Valeur de retour

Cette action ne retourne pas de valeur car elle lève toujours une erreur.

## Exemples

### Échec simple

```yaml
- action:
    type: "fail"
    message: "Opération annulée par l'utilisateur"
```

### Échec conditionnel

```yaml
- name: "Vérifier si la version de Node.js est compatible"
  action:
    type: "command"
    command: "node --version"
  variable: "NODE_VERSION"
  onSuccess:
    - name: "Échouer si la version de Node.js est trop ancienne"
      condition: 'NODE_VERSION.output.trim().substring(1) < "14.0.0"'
      action:
        type: "fail"
        message: "La version de Node.js doit être 14.0.0 ou supérieure"
```

## Utilisation avec onFailure

L'action `fail` est particulièrement utile en combinaison avec les blocs `onFailure` pour implémenter une gestion d'erreur personnalisée :

```yaml
- name: "Valider la configuration"
  action:
    type: "fail"
    message: "La validation de la configuration a échoué"
  condition: 'CONFIG_VALID !== true'
  onFailure:
    - action:
        type: "message"
        content: "La configuration est invalide. Utilisation de la configuration par défaut à la place."
        style: "warning"
    - action:
        type: "command"
        command: "cp default-config.json config.json"
```

## Bonnes pratiques

- **Messages d'erreur clairs** : Fournissez des messages d'erreur descriptifs qui expliquent pourquoi l'échec s'est produit.
- **Échecs conditionnels** : Utilisez l'attribut `condition` pour rendre les échecs conditionnels en fonction de critères spécifiques.
- **Récupération d'erreur** : Fournissez toujours un bloc `onFailure` lorsque vous souhaitez récupérer de l'erreur et continuer l'exécution.

## Alternatives

Pour certains scénarios, vous pourriez envisager ces alternatives :

- Pour afficher un avertissement sans arrêter l'exécution : utilisez l'action `message` avec `style: "warning"`
- Pour valider des conditions sans échouer : utilisez l'attribut `condition` sur les étapes

[↑ Liste des actions](../actions.md)

[← Command](command.md) ─ [FileSystem →](fileSystem.md)