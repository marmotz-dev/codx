# Gestion des erreurs dans Codx

Cette page explique comment les erreurs sont gérées dans Codx et comment utiliser les classes d'erreur nommées dans vos
recettes.

## Introduction à la gestion des erreurs

Codx utilise un système de classes d'erreur nommées pour faciliter l'identification et la gestion de types d'erreurs
spécifiques dans vos recettes. Chaque classe d'erreur étend la classe de base `CodxError` et possède un nom spécifique
qui indique le type d'erreur.

Référez-vous à la documentation de chaque action pour connaitre les erreurs qu'elle retourne.

## Utilisation des types d'erreur dans les conditions

Vous pouvez utiliser la fonction `instanceOf` pour vérifier si une erreur est d'un type spécifique dans les conditions
de votre recette. Cela est particulièrement utile dans les blocs `onFailure` pour gérer différemment des types d'erreurs
spécifiques.

Exemple :

```yaml
steps:
  - name: "Installer un package"
    action:
      type: "package"
      operation: "install"
      packages:
        - "some-package"
    onFailure:
      - name: "Gérer le gestionnaire de packages non trouvé"
        condition: 'instanceOf($ERROR, "PackageManagerNotFoundCodxError")'
        action:
          type: "message"
          content: "Gestionnaire de packages non trouvé. Veuillez installer npm ou yarn."
          style: "error"

      - name: "Gérer les autres erreurs"
        condition: 'not instanceOf($ERROR, "PackageManagerNotFoundCodxError")'
        action:
          type: "message"
          content: "Une erreur s'est produite : {{error.message}}"
          style: "error"
```

Dans cet exemple, si l'installation du package échoue parce que le gestionnaire de packages n'est pas trouvé, un message
d'erreur spécifique est affiché. Pour tous les autres types d'erreurs, un message d'erreur générique est affiché avec le
message d'erreur.

## Bonnes pratiques

- Utilisez des types d'erreur spécifiques dans vos blocs `onFailure` pour gérer différemment les différents types
  d'erreurs
- Utilisez la fonction `instanceOf` pour vérifier les types d'erreur spécifiques
- Fournissez des messages d'erreur clairs pour aider les utilisateurs à comprendre ce qui s'est mal passé
- Gérez toujours les erreurs dans vos recettes pour offrir une meilleure expérience utilisateur

[← Conditions](conditions.md)