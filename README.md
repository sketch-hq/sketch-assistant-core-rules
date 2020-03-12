# sketch-assistant-core-rules

Official core rules Sketch Assistant.

> 💁‍♀️ This is a "rules only" Assistant, meaning it contains only rule implementations and no
> configuration. Adding this Assistant to Sketch won't do anything because rules need to be
> activated in configuration before they will report anything.
>
> Use this Assistant by extending from it in your own Assistant, and adding configuration and/or
> additional rule implementations.

## Usage

TODO: Link to documentation about creating Assistants, and extending from Assistants here.

## Related Assistants

TODO: Link to other official Assistants that extend this one.

## Available rules

This Assistant exports the following rules. Click the links to view their documentation,
configuration options and implementation.

- [`artboards-grid`](./src/artboards-grid)
- [`artboards-layout`](./src/artboards-layout)
- [`borders-no-disabled`](./src/borders-no-disabled)
- [`debug-all-options`](./src/debug-all-options)
- [`debug-i18n`](./src/debug-i18n)
- [`debug-throws-error`](./src/debug-throws-error)
- [`groups-max-layers`](./src/groups-max-layers)
- [`groups-no-empty`](./src/groups-no-empty)
- [`groups-no-redundant`](./src/groups-no-redundant)
- [`images-no-outsized`](./src/images-no-outsized)
- [`layer-names-pattern-allowed`](./src/layer-names-pattern-allowed)
- [`layer-names-pattern-disallowed`](./src/layer-names-pattern-disallowed)
- [`layer-styles-prefer-shared`](./src/layer-styles-prefer-shared)
- [`layers-no-hidden`](./src/layers-no-hidden)
- [`layers-subpixel-positioning`](./src/layers-subpixel-positioning)
- [`shared-styles-no-unused`](./src/shared-styles-no-unused)
- [`symbols-no-unused`](./src/symbols-no-unused)
- [`text-styles-prefer-shared`](./src/text-styles-prefer-shared)

## Development

The following section of the readme only relates to developing the Assistant, not using it in your
own projects.

### Requirements

- Yarn >= 1.13
- Node 12.6.0

### Scripts

Interact with the tooling in this repository via the following scripts.

| Script            | Description                                     |
| ----------------- | ----------------------------------------------- |
| yarn build        | Builds the Assistant to the `dist` folder       |
| yarn format-check | Checks the formatting with prettier             |
| yarn i18n:extract | Extracts strings from the JS source to PO files |
| yarn test         | Runs the Jest tests                             |
| yarn type-check   | Typecheck the TypeScript                        |

### Workflows

#### Conventional commits

Try and use the [conventional commits](https://www.conventionalcommits.org/) convention when writing
commit messages.

#### Working on rules

Use a TDD approach, and the existing rules as a guide.

Rule functions can run in Node against plain Sketch file JSON, so the Mac Sketch app isn't required
while actively developing rule logic.

When creating a new rule in this repository:

1. Copy and paste one of the existing rule folders in `src/` as a starting point.
1. Add the new rule to the Assistant definition in `src/index.ts`.
1. With Sketch, create some example `.sketch` files to use as test fixtures. At a minimum these should demonstrate
   two scenarios - one where you'd expect your rule to report violations, and one where it shouldn't report any
1. While developing your rule and its tests use Jest in watch mode: `yarn test --watch`.
1. If you've added new strings then follow the [internationalization](#internationalization) workflow too.
1. Add changeset for your rule, open a Pull Request and once merged [release](#releases) it

#### Releases

This repository uses [Atlassian Changesets](https://github.com/atlassian/changesets) to automate the
npm release process. Read the docs for more information, but the top-level summary is:

- A GitHub Action maintains a permanently open PR that when merged will publish the package to npm
  with the latest changes and an automatically determined semver.
- If the work you do in a PR should affect the next release, then you need to commit a "changeset"
  to the repository together with the rest of your code changes - do this by running
  `yarn changeset`. You'll be asked to provide a change type (major, minor or patch) and a message.

#### Internationalization

This Assistant requires internationalization since it's an official Sketch Assistant.

Translating your own Assistants is completely optional however.

Internationalization is handled by [LinguiJS](https://lingui.js.org), and follows their
[guides](https://lingui.js.org/tutorials/javascript.html) for handling plain JavaScript projects.

The following locales are currently supported in the Sketch Mac app and this project:

- `en` (American English)
- `zh-Hans` (Chinese Simplified)

When ready to perform a round of translation, for example when there are new untranslated strings in
the repository, perform the following workflow:

1. Run `yarn i18n:extract` which will update the `.po` files in `src/locale/` with the new strings
   used throughout the source code.
1. PR and merge these changes to `master`.
1. Translation thereafter happens via [CrowdIn](https://crowdin.com) automation.
