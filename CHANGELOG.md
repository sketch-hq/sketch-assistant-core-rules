# @sketch-hq/sketch-assistant-core-rules

## 3.1.0-next.2

### Patch Changes

- 840fcc8: Do not emit types into the built package

## 3.1.0-next.1

### Minor Changes

- 6437842: Add the rule groups-no-similar

### Patch Changes

- 860c90e: Make package public.
- 860c90e: Rework rule copy.

## 3.1.0-next.0

### Minor Changes

- b1499a1: Adds 3 new rules: layer-styles-prefer-library, text-styles-prefer-library and
  symbols-prefer-library

### Patch Changes

- 90fdfbd: Update type and utils deps

## 3.0.2

### Patch Changes

- 95b8bba: Add human readable Assistant title and description to package.json

## 3.0.1

### Patch Changes

- 75b8335: Do not check styles in combined shapes
- 6b8373d: Handle layer positions with more than two decimal places in `layers-subpixel-positioning`

## 3.0.0

### Major Changes

- 2598a13: Add rule 'images-no-undersized'

### Minor Changes

- 1beecd1: Add rule `exported-layers-normal-blend-mode`
- f76561c: Add new rule `artboards-max-ungrouped-layers`

## 2.0.0

### Major Changes

- d592d7d: Remove old layer name pattern rules, and replace with seven new rules that target
  specific layer types

### Minor Changes

- a707bd3: Added rules `layer-styles-no-dirty` and `text-styles-no-dirty`
- 146e432: Adds the new rule "layers-no-loose" that does not allow layers to be outside Artboards.
- 74c69aa: Added the rules `shadows-no-disabled`, `fills-no-disabled` and
  `inner-shadows-no-disabled`

### Patch Changes

- 5d8563d: Fix a bug where shared styles used via symbol overrides where causing false negatives in
  the `shared-styles-no-used` rule

## 1.1.0

### Minor Changes

- 5d34daa: New rule "result-messages-include"

### Patch Changes

- e84ec89: Use Assistant Types package

## 1.0.3

### Patch Changes

- ebb6b1c: Rework dependency structure

## 1.0.2

### Patch Changes

- 9f4908e: Add sketch-assistant-utils as standard dependency

## 1.0.1

### Patch Changes

- 5bd42ac: move source to src folder

## 1.0.0

### Major Changes

- 6ea7fdb: Initial release as a Sketch Assistant
