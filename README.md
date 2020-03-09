# sketch-assistant-core-rules

Official core rules Sketch Assistant.

> 💁‍♀️ This is a "rules only" Assistant, meaning it contains only rule implementations and no
> configuration. Adding this Assistant to Sketch won't do anything because rules need to be
> activated in configuration before they will report anything.
>
> Use this Assistant by extending from it in your own Assistant, and adding configuration and/or
> additional rule implementations.

## Usage

TODO: Link to documentation about creating assistants, and extending from assistants here.

## Related Assistants

TODO: Link to other official Assistants that extend this one

## Available rules

This Assistant exports the following rules. Click the links to view their documentation,
configuration options and implementation.

- [`artboards-grid`](./rules/artboards-grid)
- [`artboards-layout`](./rules/artboards-layout)
- [`borders-no-disabled`](./rules/borders-no-disabled)
- [`debug-all-options`](./rules/debug-all-options)
- [`debug-i18n`](./rules/debug-i18n)
- [`debug-throws-error`](./rules/debug-throws-error)
- [`groups-max-layers`](./rules/groups-max-layers)
- [`groups-no-empty`](./rules/groups-no-empty)
- [`groups-no-redundant`](./rules/groups-no-redundant)
- [`images-no-outsized`](./rules/images-no-outsized)
- [`layer-names-pattern-allowed`](./rules/layer-names-pattern-allowed)
- [`layer-names-pattern-disallowed`](./rules/layer-names-pattern-disallowed)
- [`layer-styles-prefer-shared`](./rules/layer-styles-prefer-shared)
- [`layers-no-hidden`](./rules/layers-no-hidden)
- [`layers-subpixel-positioning`](./rules/layers-subpixel-positioning)
- [`shared-styles-no-unused`](./rules/shared-styles-no-unused)
- [`symbols-no-unused`](./rules/symbols-no-unused)
- [`text-styles-prefer-shared`](./rules/text-styles-prefer-shared)

## Development

The following section of the readme only relates to developing the assistant, not using it in your
own projects

### Requirements

- Yarn >= 1.13
- Node 12.6.0

### Scripts

Interact with the tooling in this repo via the following scripts.

| Script            | Description                                     |
| ----------------- | ----------------------------------------------- |
| yarn build        | Builds the assistant to the `dist` folder       |
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

When creating a new rule in this repo:

1. Copy and paste one of the existing rule folders in `src/` as a starting point
1. Open up the Mac Sketch app and create some example Sketch files to use as test fixtures. These
   should demonsteate scenarios where you'd expect your rule to report violations
1. Start up Jest in watch mode `yarn test --watch`
1. Write some tests that fully exercise the rule logic. Invoke the rule against your Sketch file
   fixtures and assert that the rule reports the correct violations
1. Don't forget to add your rule to the Assistant definition in `src/index.ts`

#### Releases

This repo uses [Atlassian Changesets](https://github.com/atlassian/changesets) to automate the npm
release process. Read the docs for more information, but the top-level summary is:

- A GitHub Action maintains a permanently open PR that when merged will publish the package to npm
  with the latest changes and an automatically determined semver
- If the work you do in a PR should affect the next release, then you need to commit a "changeset"
  to the repo together with the rest of your code changes - do this by running `yarn changeset`.
  You'll be asked to provide a change type (major, minor or patch) and a message

#### Internationalization

This Assistant requires internationalization since it's an official Sketch Assistant.

Translating your own Assistants is completely optional however.

Internationalization is handled by [LinguiJS](https://lingui.js.org), and follows their
[guides](https://lingui.js.org/tutorials/javascript.html) for handling plain JavaScript projects.

The following locales are currently supported in the Sketch Mac app and this project:

- `en` (American English)
- `zh-Hans` (Chinese Simplified)

When ready to perform a round of translation, for example when there are new untranslated strings in
the repo, perform the following workflow:

1. Run `yarn i18n:extract` which will update the `.po` files in `src/locale/` with the new strings
   used throughout the source code
1. PR and merge these changes to `master`
1. Translation thereafter happens via CrowdIn automation
