# sketch-lint-ruleset-core

The core sketch-lint ruleset.

## Rules

- [`artboards-grid`](./src/artboards-grid)
- [`artboards-layout`](./src/artboards-layout)
- [`borders-no-disabled`](./src/borders-no-disabled)
- [`debug-all-options`](./src/debug-all-options)
- [`debug-throws-error`](./src/debug-throws-error)
- [`groups-max-layers`](./src/groups-max-layers)
- [`groups-no-empty`](./src/groups-no-empty)
- [`groups-no-redundant`](./src/groups-no-redundant)
- [`images-no-outsized`](./src/images-no-outsized)
- [`layer-names-pattern-allowed`](./src/layer-names-pattern-allowed)
- [`layer-names-pattern-disallowed`](./src/layer-names-pattern-disallowed)
- [`layers-no-hidden`](./src/layers-no-hidden)
- [`layers-subpixel-positioning`](./src/layers-subpixel-positioning)
- [`styles-no-duplicate`](./src/styles-no-duplicate)
- [`styles-no-unused`](./src/styles-no-unused)
- [`symbols-no-unused`](./src/symbols-no-unused)

## Scripts

| Script               | Description                                                     |
| -------------------- | --------------------------------------------------------------- |
| yarn build           | Builds Sketch and Node bundles to `dist`                        |
| yarn test            | Runs the Jest tests                                             |
| yarn format-check    | Checks the formatting with prettier                             |
| yarn package-tarball | Creates an installable tarball from the current module contents |
