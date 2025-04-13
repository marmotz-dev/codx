# Prompt Action

The `prompt` action allows you to request information from the user during the execution of a recipe. This action is
essential for creating interactive recipes that can adapt to the specific needs of the user.

## Types of Prompts

The `prompt` action supports several types of prompts, each suited to a different type of information:

1. `checkbox`: [Checkbox prompt](#checkbox-prompt), for selecting one or more options
2. `confirm`: [Confirmation prompt](#confirmation-prompt), for answering yes or no
3. `number`: [Number prompt](#number-prompt), for entering numbers
4. `select`: [Selection prompt](#selection-prompt), for choosing one option among several
5. `text`: [Text prompt](#text-prompt), for entering free text

## Common Parameters

| Parameter    | Type   | Required | Description                                                                  |
|--------------|--------|----------|------------------------------------------------------------------------------|
| `type`       | string | Yes      | Must be `"prompt"`                                                           |
| `promptType` | string | Yes      | Type of prompt (`"text"`, `"number"`, `"select"`, `"checkbox"`, `"confirm"`) |
| `message`    | string | Yes      | The message to display to the user                                           |

## Prompt Details

### Checkbox Prompt

The checkbox prompt allows the user to select multiple options.

#### Specific Parameters

| Parameter       | Type   | Required | Default Value | Description                                  |
|-----------------|--------|----------|---------------|----------------------------------------------|
| `promptType`    | string | Yes      | -             | Must be `"checkbox"`                         |
| `choices`       | object | Yes      | -             | Object with available choices (key-value)    |
| `defaultValues` | array  | No       | -             | Array of keys of options selected by default |

#### Return Value

This prompt returns an object with the following properties:

| Property  | Type  | Always returned | Description                                 |
|-----------|-------|-----------------|---------------------------------------------|
| `answers` | array | Yes             | List of `choices` keys selected by the user |

#### Example

```yaml
- name: "Select tools"
  action:
    type: "prompt"
    promptType: "checkbox"
    message: "Tools to install:"
    choices:
      eslint: "ESLint"
      prettier: "Prettier"
      typescript: "TypeScript"
    defaultValues:
      - eslint
      - prettier
  variable: "SELECTED_TOOLS"
```

This produces the following prompt:

```shell
### Select tools
? Tools to install: (Press <space> to select, <a> to toggle all, <i> to invert selection, and <enter> to proceed)
❯◉ ESLint
 ◉ Prettier
 ◯ TypeScript
```

Then, once answered:

```shell
### Select tools
? Tools to install: ESLint, Prettier
```

### Confirmation Prompt

The confirmation prompt allows the user to answer yes or no.

#### Specific Parameters

| Parameter      | Type    | Required | Default Value | Description                                |
|----------------|---------|----------|---------------|--------------------------------------------|
| `promptType`   | string  | Yes      | -             | Must be `"confirm"`                        |
| `defaultValue` | boolean | No       | `false`       | Default value (true for Yes, false for No) |

#### Return Value

This prompt returns an object with the following properties:

| Property | Type    | Always returned | Description                                                         |
|----------|---------|-----------------|---------------------------------------------------------------------|
| `answer` | boolean | Yes             | Boolean indicating whether the user confirmed (true) or not (false) |

#### Example

```yaml
- name: "Confirm TypeScript installation"
  action:
    type: "prompt"
    promptType: "confirm"
    message: "Install TypeScript?"
    defaultValue: true
  variable: "INSTALL_TYPESCRIPT"
```

This produces the following prompt:

```shell
### Confirm TypeScript installation
? Install TypeScript? (Y/n) 
```

Then, once answered:

```shell
### Confirm TypeScript installation
? Install TypeScript? Yes
```

### Number Prompt

The number prompt allows the user to enter a number.

#### Specific Parameters

| Parameter      | Type             | Required | Default Value | Description                        |
|----------------|------------------|----------|---------------|------------------------------------|
| `promptType`   | string           | Yes      | -             | Must be `"number"`                 |
| `defaultValue` | number or string | No       | -             | Default value proposed to the user |

#### Return Value

This prompt returns an object with the following properties:

| Property | Type   | Always returned | Description                |
|----------|--------|-----------------|----------------------------|
| `answer` | number | Yes             | Number entered by the user |

#### Example

```yaml
- name: "Set server port"
  action:
    type: "prompt"
    promptType: "number"
    message: "Server port:"
    defaultValue: 3000
  variable: "SERVER_PORT"
```

This produces the following prompt:

```shell
### Set server port
? Server port: (3000) 
```

Then, once answered:

```shell
### Set server port
? Server port: 3001 
```

### Selection Prompt

The selection prompt allows the user to choose one option among several.

#### Specific Parameters

| Parameter      | Type   | Required | Default Value | Description                               |
|----------------|--------|----------|---------------|-------------------------------------------|
| `promptType`   | string | Yes      | -             | Must be `"select"`                        |
| `choices`      | object | Yes      | -             | Object with available choices (key-value) |
| `defaultValue` | string | No       | -             | Key of the option selected by default     |

#### Return Value

This prompt returns an object with the following properties:

| Property | Type   | Always returned | Description                        |
|----------|--------|-----------------|------------------------------------|
| `answer` | string | Yes             | `choices` key selected by the user |

#### Example

```yaml
- name: "Choose a framework"
  action:
    type: "prompt"
    promptType: "select"
    message: "Framework to use:"
    choices:
      react: "React"
      vue: "Vue.js"
      angular: "Angular"
    defaultValue: "react"
  variable: "FRAMEWORK"
```

This produces the following prompt:

```shell
### Choose a framework
? Framework to use: (Use arrow keys)
❯ React 
  Vue.js 
  Angular 
```

Then, once answered:

```shell
### Choose a framework
? Framework to use: Angular
```

### Text Prompt

The text prompt allows the user to enter free text.

#### Specific Parameters

| Parameter      | Type   | Required | Default Value | Description                        |
|----------------|--------|----------|---------------|------------------------------------|
| `promptType`   | string | Yes      | -             | Must be `"text"`                   |
| `defaultValue` | string | No       | -             | Default value proposed to the user |

#### Return Value

This prompt returns an object with the following properties:

| Property | Type   | Always returned | Description              |
|----------|--------|-----------------|--------------------------|
| `answer` | string | Yes             | Text entered by the user |

#### Example

```yaml
- name: "Enter project name"
  action:
    type: "prompt"
    promptType: "text"
    message: "Project name:"
    defaultValue: "my-project"
  variable: "PROJECT_NAME"
```

This produces the following prompt:

```shell
### Enter project name
? Project name: (my-project)
```

Then, once answered:

```shell
### Enter project name
? Project name: foobar
```

### Possible Errors

This action can throw the following errors:
 
| Error Type                | Description                                     |
|---------------------------|-------------------------------------------------|
| `MissingMessageCodxError` | Thrown when the `message` parameter is missing. |

### Using Results

The results of prompts are stored in variables that can be used in subsequent steps of the recipe.

#### Types of Results

- **Text prompt**: String
- **Number prompt**: Number
- **Selection prompt**: String (the key of the selected option)
- **Checkbox prompt**: Array of strings (the keys of the selected options)
- **Confirmation prompt**: Boolean (true or false)

#### Example of Using Results

```yaml
- name: "Select tools"
  action:
    type: "prompt"
    promptType: "checkbox"
    message: "Tools to install:"
    choices:
      eslint: "ESLint"
      prettier: "Prettier"
      typescript: "TypeScript"
  variable: "SELECTED_TOOLS"

- name: "Install ESLint"
  condition: '"eslint" in SELECTED_TOOLS'
  action:
    type: "package"
    operation: "install"
    packages:
      - "eslint"
    dev: true
```

### Best Practices

- Use clear and concise messages to guide the user
- Provide relevant default values to speed up the process
- Use the most appropriate prompt type for each type of information
- Limit the number of prompts to avoid overwhelming the user
- Group related prompts at the beginning of the recipe when possible
- Use conditions to avoid asking for unnecessary information

[↑ List of Actions](../actions.md)

[← Package](package.md)
