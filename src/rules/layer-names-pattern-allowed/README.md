# layer-names-pattern-allowed

Layers with names that do not match at least one of the regex patterns defined in the rule's options
will raise violations.

> This rule requires you to define ahead of time the complete set of allowable layer names
> throughout the document. If instead you just want to forbid specific layer name patterns while
> allowing all others then the [`layer-names-pattern-disallowed`](../layer-names-pattern-disallowed)
> rule is more appropriate.

## Rationale

When highly precise layer naming is required, for example when a Sketch document's contents are
automatically exported to production assets, then a team may want to enforce a limited set of valid
layer names.

## Options

### `patterns: string[]`

Array of allowable layer name patterns expressed as JavaScript compatible regex.

## Example configuration

```js
{
  "active": true,
  "patterns": [
    "^[A-Z][a-zA-Z0-9]+$" // Enforces pascal case layer names
  ]
}
```
