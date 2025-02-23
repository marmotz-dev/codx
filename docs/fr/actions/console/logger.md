# Référence des Actions liées à la console : affichage de message(s)

Ce document détaille toutes les actions de console disponibles pour afficher du texte dans la console qui peuvent être
utilisées dans les recettes Codx.

## Message(s) de vérification (check/checkGroup/checkGroupEnd)

### check

Affichage un message de type check dans la console.

#### Paramètres

Message ou tableau de messages à afficher

Exemple, le code suivant :

```yaml
recipe:
  - console.check: Message 1
  - console.check:
      - Message 2
      - Message 3
```

produit :

<pre>
<span style="color: yellow">⚡</span> Message 1
<span style="color: yellow">⚡</span> Message 2
<span style="color: yellow">⚡</span> Message 3
</pre>

### checkGroup

Affichage un message de type check dans la console et ouvre un groupe.

#### Paramètres

Message à afficher

Exemple, le code suivant :

```yaml
recipe:
  - console.checkGroup: Message 1
  - console.check: Message 2
  - console.checkGroupEnd: Message 3
```

produit :

<pre>
<span style="color: yellow">⚡</span> Message 1
<span style="color: grey">├</span> <span style="color: yellow">⚡</span> Message 2
<span style="color: grey">└</span> <span style="color: yellow">⚡</span> Message 3
</pre>

### checkGroupEnd

Affichage un message de type check dans la console et ferme le groupe courant.

#### Paramètres

Message à afficher

Exemple, le code suivant :

```yaml
recipe:
  - console.checkGroup: Message 1
  - console.check: Message 2
  - console.checkGroupEnd: Message 3
```

produit :

<pre>
<span style="color: yellow">⚡</span> Message 1
<span style="color: grey">├</span> <span style="color: yellow">⚡</span> Message 2
<span style="color: grey">└</span> <span style="color: yellow">⚡</span> Message 3
</pre>

## Message(s) d'erreur (error/errorGroup/errorGroupEnd)

### error

Affichage un message de type error dans la console.

#### Paramètres

Message ou tableau de messages à afficher

Exemple, le code suivant :

```yaml
recipe:
  - console.error: Message 1
  - console.error:
      - Message 2
      - Message 3
```

produit :

<pre>
<span style="color: red">✗</span> Message 1
<span style="color: red">✗</span> Message 2
<span style="color: red">✗</span> Message 3
</pre>

### errorGroup

Affichage un message de type error dans la console et ouvre un groupe.

#### Paramètres

Message à afficher

Exemple, le code suivant :

```yaml
recipe:
  - console.errorGroup: Message 1
  - console.error: Message 2
  - console.errorGroupEnd: Message 3
```

produit :

<pre>
<span style="color: red">✗</span> Message 1
<span style="color: grey">├</span> <span style="color: red">✗</span> Message 2
<span style="color: grey">└</span> <span style="color: red">✗</span> Message 3
</pre>

### errorGroupEnd

Affichage un message de type error dans la console et ferme le groupe courant.

#### Paramètres

Message à afficher

Exemple, le code suivant :

```yaml
recipe:
  - console.errorGroup: Message 1
  - console.error: Message 2
  - console.errorGroupEnd: Message 3
```

produit :

<pre>
<span style="color: red">✗</span> Message 1
<span style="color: grey">├</span> <span style="color: red">✗</span> Message 2
<span style="color: grey">└</span> <span style="color: red">✗</span> Message 3
</pre>

## Message(s) d'information (info/infoGroup/infoGroupEnd)

### info

Affichage un message de type info dans la console.

#### Paramètres

Message ou tableau de messages à afficher

Exemple, le code suivant :

```yaml
recipe:
  - console.info: Message 1
  - console.info:
      - Message 2
      - Message 3
```

produit :

<pre>
<span style="color: blue">ℹ</span> Message 1
<span style="color: blue">ℹ</span> Message 2
<span style="color: blue">ℹ</span> Message 3
</pre>

### infoGroup

Affichage un message de type info dans la console et ouvre un groupe.

#### Paramètres

Message à afficher

Exemple, le code suivant :

```yaml
recipe:
  - console.infoGroup: Message 1
  - console.info: Message 2
  - console.infoGroupEnd: Message 3
```

produit :

<pre>
<span style="color: blue">ℹ</span> Message 1
<span style="color: grey">├</span> <span style="color: blue">ℹ</span> Message 2
<span style="color: grey">└</span> <span style="color: blue">ℹ</span> Message 3
</pre>

### infoGroupEnd

Affichage un message de type info dans la console et ferme le groupe courant.

#### Paramètres

Message à afficher

Exemple, le code suivant :

```yaml
recipe:
  - console.infoGroup: Message 1
  - console.info: Message 2
  - console.infoGroupEnd: Message 3
```

produit :

<pre>
<span style="color: blue">ℹ</span> Message 1
<span style="color: grey">├</span> <span style="color: blue">ℹ</span> Message 2
<span style="color: grey">└</span> <span style="color: blue">ℹ</span> Message 3
</pre>

## Message(s) de succès (success/successGroup/successGroupEnd)

### success

Affichage un message de type success dans la console.

#### Paramètres

Message ou tableau de messages à afficher

Exemple, le code suivant :

```yaml
recipe:
  - console.success: Message 1
  - console.success:
      - Message 2
      - Message 3
```

produit :

<pre>
<span style="color: green">✓</span> Message 1
<span style="color: green">✓</span> Message 2
<span style="color: green">✓</span> Message 3
</pre>

### successGroup

Affichage un message de type success dans la console et ouvre un groupe.

#### Paramètres

Message à afficher

Exemple, le code suivant :

```yaml
recipe:
  - console.successGroup: Message 1
  - console.success: Message 2
  - console.successGroupEnd: Message 3
```

produit :

<pre>
<span style="color: green">✓</span> Message 1
<span style="color: grey">├</span> <span style="color: green">✓</span> Message 2
<span style="color: grey">└</span> <span style="color: green">✓</span> Message 3
</pre>

### successGroupEnd

Affichage un message de type success dans la console et ferme le groupe courant.

#### Paramètres

Message à afficher

Exemple, le code suivant :

```yaml
recipe:
  - console.successGroup: Message 1
  - console.success: Message 2
  - console.successGroupEnd: Message 3
```

produit :

<pre>
<span style="color: green">✓</span> Message 1
<span style="color: grey">├</span> <span style="color: green">✓</span> Message 2
<span style="color: grey">└</span> <span style="color: green">✓</span> Message 3
</pre>