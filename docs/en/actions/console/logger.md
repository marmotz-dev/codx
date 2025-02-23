# Console Actions Reference: Displaying Messages

This document details all available console actions for displaying text in the console, which can be used in Codx
recipes.

## Verification Message(s) (check/checkGroup/checkGroupEnd)

### check

Displays a check-type message in the console.

#### Parameters

A message or an array of messages to display.

Example, the following code:

```yaml
recipe:
  - console.check: Message 1
  - console.check:
      - Message 2
      - Message 3
```

produces:

<pre>
<span style="color: yellow">⚡</span> Message 1
<span style="color: yellow">⚡</span> Message 2
<span style="color: yellow">⚡</span> Message 3
</pre>

### checkGroup

Displays a check-type message in the console and opens a group.

#### Parameters

Message to display.

Example, the following code:

```yaml
recipe:
  - console.checkGroup: Message 1
  - console.check: Message 2
  - console.checkGroupEnd: Message 3
```

produces:

<pre>
<span style="color: yellow">⚡</span> Message 1
<span style="color: grey">├</span> <span style="color: yellow">⚡</span> Message 2
<span style="color: grey">└</span> <span style="color: yellow">⚡</span> Message 3
</pre>

### checkGroupEnd

Displays a check-type message in the console and closes the current group.

#### Parameters

Message to display.

Example, the following code:

```yaml
recipe:
  - console.checkGroup: Message 1
  - console.check: Message 2
  - console.checkGroupEnd: Message 3
```

produces:

<pre>
<span style="color: yellow">⚡</span> Message 1
<span style="color: grey">├</span> <span style="color: yellow">⚡</span> Message 2
<span style="color: grey">└</span> <span style="color: yellow">⚡</span> Message 3
</pre>

## Error Message(s) (error/errorGroup/errorGroupEnd)

### error

Displays an error-type message in the console.

#### Parameters

A message or an array of messages to display.

Example, the following code:

```yaml
recipe:
  - console.error: Message 1
  - console.error:
      - Message 2
      - Message 3
```

produces:

<pre>
<span style="color: red">✗</span> Message 1
<span style="color: red">✗</span> Message 2
<span style="color: red">✗</span> Message 3
</pre>

### errorGroup

Displays an error-type message in the console and opens a group.

#### Parameters

Message to display.

Example, the following code:

```yaml
recipe:
  - console.errorGroup: Message 1
  - console.error: Message 2
  - console.errorGroupEnd: Message 3
```

produces:

<pre>
<span style="color: red">✗</span> Message 1
<span style="color: grey">├</span> <span style="color: red">✗</span> Message 2
<span style="color: grey">└</span> <span style="color: red">✗</span> Message 3
</pre>

### errorGroupEnd

Displays an error-type message in the console and closes the current group.

#### Parameters

Message to display.

Example, the following code:

```yaml
recipe:
  - console.errorGroup: Message 1
  - console.error: Message 2
  - console.errorGroupEnd: Message 3
```

produces:

<pre>
<span style="color: red">✗</span> Message 1
<span style="color: grey">├</span> <span style="color: red">✗</span> Message 2
<span style="color: grey">└</span> <span style="color: red">✗</span> Message 3
</pre>

## Information Message(s) (info/infoGroup/infoGroupEnd)

### info

Displays an info-type message in the console.

#### Parameters

A message or an array of messages to display.

Example, the following code:

```yaml
recipe:
  - console.info: Message 1
  - console.info:
      - Message 2
      - Message 3
```

produces:

<pre>
<span style="color: blue">ℹ</span> Message 1
<span style="color: blue">ℹ</span> Message 2
<span style="color: blue">ℹ</span> Message 3
</pre>

### infoGroup

Displays an info-type message in the console and opens a group.

#### Parameters

Message to display.

Example, the following code:

```yaml
recipe:
  - console.infoGroup: Message 1
  - console.info: Message 2
  - console.infoGroupEnd: Message 3
```

produces:

<pre>
<span style="color: blue">ℹ</span> Message 1
<span style="color: grey">├</span> <span style="color: blue">ℹ</span> Message 2
<span style="color: grey">└</span> <span style="color: blue">ℹ</span> Message 3
</pre>

### infoGroupEnd

Displays an info-type message in the console and closes the current group.

#### Parameters

Message to display.

## Success Message(s) (success/successGroup/successGroupEnd)

### success

Displays a success-type message in the console.

#### Parameters

A message or an array of messages to display.

Example, the following code:

```yaml
recipe:
  - console.success: Message 1
  - console.success:
      - Message 2
      - Message 3
```

produces:

<pre>
<span style="color: green">✓</span> Message 1
<span style="color: green">✓</span> Message 2
<span style="color: green">✓</span> Message 3
</pre>

