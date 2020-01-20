# sketch-lint-ruleset-core

## Usage

This ruleset is always available in the Sketch app and the upcoming Node CLI. It doesn't need to be explicitly referenced as a dependency in a lint configuration.

These rules may be referenced in a lint configuration just via their bare rule name, without a ruleset package name prefix. As oppossed to 3rd party rules, which always need to be fully qualified with their package name.

Example configuration activating the `layers-no-hidden` rule:

```json
{
  "sketchLint": {
    "rules": {
      "layers-no-hidden": {
        "active": true
      }
    }
  }
}
```

## Rules

The full ruleset and available configuration options for each rule are documented here, in this repo.

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

## Development

The following section of the readme only relates to developing the ruleset, not using it to lint Sketch documents.

### Requirements

- Yarn >= 1.13
- Node 12.6.0

### Scripts

Interact with the tooling in this repo via the following scripts.

| Script               | Description                                                            |
| -------------------- | ---------------------------------------------------------------------- |
| yarn build           | Builds the ruleset to the `dist` folder ready for publishing           |
| yarn commitlint      | Lints the previous commit message against the conventional commit spec |
| yarn format-check    | Checks the formatting with prettier                                    |
| yarn i18n:extract    | Extracts strings from the JS source to PO files                        |
| yarn i18n:compile    | Compiles the PO translation files to JS                                |
| yarn package-tarball | Creates an installable tarball from the current module contents        |
| yarn release         | Cuts a new release                                                     |
| yarn test            | Runs the Jest tests                                                    |
| yarn type-check      | Typecheck the TypeScript                                               |

## Technical overview

### Making changes

- Ensure a strict 1:1 relationship between a PR and any one feature or fix
- PRs should contain only one commit, and are squash merged
- Commit message format must follow the [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) spec, those that don't will cause a build failure. After doing `yarn install` in the repo root a Git hook will be installed that helps with writing the message

### TypeScript

The ruleset is written in TypeScript, this is so we can take advantage of the type safety offered by the `@sketch-hq/sketch-lint-core` package. The types included with `@sketch-hq/sketch-lint-core` fully define rulesets and rule functions.

Types from `@sketch-hq/sketch-file-format-ts` are included too. These provide type definitions for Sketch file JSON. Since rule functions act on Sketch file JSON having full type safety for these data objects has obvious advantage.

Using TypeScript for Sketch lint rulesets is recommended, but not required.

### Build process

There are two build products, which cater for the ruleset running in two different JS environments (Sketch and Node).

#### Sketch (JavaScriptCore)

- Transformed using Babel [[config here](./babel.sketch.config.js)]. We target Safari 10 during the transformation since this most closely matches the JavaScriptCore environment provided by Sketch
- Packaged into a single file using Webpack [[config here](./webpack.config.js)], since JavaScriptCore doesn't have a module loader

#### Node

- Transformed using Babel [[config here](./babel.config.js)]
- Published as CommonJS modules for consumption by Node

### Release process

1. Create a new branch
2. Run `yarn release` to cut a new release on that branch. The script will
   - Determine the next semver automatically based on the commit types since the last version
   - Update `version` in package.json
   - Update `CHANGELOG.md`
   - Creates a tag for version
3. Open a PR into `master`
4. Once merged run the following commands on up-to-date `master`, assuming you have the required credentials
   - `git push --follow-tags`
   - `npm publish`

### Internationalization

This is handled by [LinguiJS](https://lingui.js.org).

#### Supported locales

- `en` (American English)
- `zh-Hans` (Chinese Simplified)

#### Active locale

In Sketch the active language is provided to the ruleset via the `LANG` global variable, so we use this value to initialize the LinguiJS runtime component.

#### Workflow

When ready to perform a round of translation, for example when there are new untranslated strings in the repo, perform the following workflow:

1. Run `yarn i18n:extract` which will update the PO files in `locale/` with the new strings used throughout the source code
2. Have the PO files translated. For now this only means translating the `zh-Han` file, the `en` master PO file will already be in the correct state
3. Commit updated PO file back to the repo. The new content will automatically be included in the next build
