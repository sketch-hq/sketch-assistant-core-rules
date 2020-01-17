# layer-names-pattern-disallowed

Layers with names that match any of the regex patterns defined in the rule's options will raise lint violations.

> This rule enables you to disallow a limited list of layer names patterns. If instead you want to blanket disallow all layers names in the document except a list that you allow then the [`layer-names-pattern-allowed`](../layer-names-pattern-allowed) rule is more appropriate.

## Rationale

A team may wish to forbid certain specific layer names according to company or team standards. For example, the default layer names that Sketch uses for copy and pasted layer names could be disallowed.

## Options

### `patterns: string[]`

Array of forbidden layer name patterns expressed as JavaScript compatible regex.

## Example configuration

```js
{
  "active": true,
  "patterns": [
    "^.* Copy( \d*)?$" // Disallows copy pasted layer names like "Rectangle Copy 2"
  ]
}
```
