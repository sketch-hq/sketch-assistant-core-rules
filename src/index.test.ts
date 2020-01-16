import {
  invokeRuleSet,
  createDummyConfig,
  createLintOperationContext,
  LintOperationContext,
  fromFile,
  getImageMetadata,
  LintViolation,
  RuleSet,
  isRuleActive,
} from '@sketch-hq/sketch-lint-core'
import { resolve } from 'path'
import { ruleSet } from './'

test('Exercise all rules', async (): Promise<void> => {
  expect.assertions(4)
  // Setup
  const config = createDummyConfig({
    rules: {
      'artboards-grid': {
        active: true,
        grids: [{ gridBlockSize: 5, thickLinesEvery: 10 }],
      },
      'artboards-layout': {
        active: true,
        layouts: [
          {
            columnWidth: 10,
            drawHorizontal: true,
            drawHorizontalLines: true,
            drawVertical: true,
            gutterHeight: 10,
            gutterWidth: 10,
            guttersOutside: true,
            horizontalOffset: 0,
            numberOfColumns: 10,
            rowHeightMultiplication: 5,
            totalWidth: 200,
          },
        ],
      },
      'borders-no-disabled': {
        active: true,
      },
      'groups-max-layers': {
        active: true,
        maxLayers: 10,
      },
      'groups-no-empty': {
        active: true,
      },
      'groups-no-redundant': {
        active: true,
      },
      'images-no-outsized': {
        active: true,
        maxRatio: 2,
      },
      'layer-names-pattern-allowed': {
        active: true,
        patterns: [
          '^Test fixture$',
          '^Disallowed$',
          '^artboards-.*',
          '^borders-.*',
          '^groups-.*',
          '^images-.*',
          '^layer-names-.*',
          '^layers-.*',
          '^styles-*',
          '^symbols-*',
        ],
      },
      'layer-names-pattern-disallowed': {
        active: true,
        patterns: ['^Disallowed$'],
      },
      'layers-no-hidden': {
        active: true,
      },
      'layers-subpixel-positioning': {
        active: true,
        scaleFactors: ['@1x', '@2x'],
      },
      'styles-no-duplicate': {
        active: true,
      },
      'styles-no-unused': {
        active: true,
      },
      'symbols-no-unused': {
        active: true,
      },
    },
  })
  const file = await fromFile(resolve(__dirname, '../fixtures/all.sketch'))
  const violations: LintViolation[] = []
  const context: LintOperationContext = createLintOperationContext(
    file,
    config,
    violations,
    { cancelled: false },
    getImageMetadata,
  )
  // Filter out rules in the ruleSet that aren't active in the config
  const filteredRuleSet: RuleSet = {
    ...ruleSet,
    rules: ruleSet.rules.filter(ruleModule =>
      isRuleActive(config, ruleSet, ruleModule),
    ),
  }
  // Expect no rule errors
  await expect(
    invokeRuleSet(filteredRuleSet, context),
  ).resolves.toMatchInlineSnapshot(`Array []`)
  // Expect only one violation from each rule
  expect(violations.length).toBe(filteredRuleSet.rules.length)
  // Check violation content
  expect(
    violations.map(violation => [violation.message, violation.ruleModule.name]),
  ).toMatchInlineSnapshot(`
    Array [
      Array [
        "Expected 10 or less layers, found 11",
        "groups-max-layers",
      ],
      Array [
        "Unexpected x2 oversized image",
        "images-no-outsized",
      ],
      Array [
        "Unexpected hidden layer",
        "layers-no-hidden",
      ],
      Array [
        "Unexpected unused symbol",
        "symbols-no-unused",
      ],
      Array [
        "Unexpected layer name \\"Not allowed\\"",
        "layer-names-pattern-allowed",
      ],
      Array [
        "Unexpected layer name \\"Test Fixture\\"",
        "layer-names-pattern-allowed",
      ],
      Array [
        "Unexpected layer name 'Disallowed'",
        "layer-names-pattern-disallowed",
      ],
      Array [
        "Unexpected duplicate style",
        "styles-no-duplicate",
      ],
      Array [
        "Unexpected artboard grid settings",
        "artboards-grid",
      ],
      Array [
        "Unexpected disabled border",
        "borders-no-disabled",
      ],
      Array [
        "Unexpected empty group",
        "groups-no-empty",
      ],
      Array [
        "Unexpected artboard layout settings",
        "artboards-layout",
      ],
      Array [
        "Unexpected subpixel positioning",
        "layers-subpixel-positioning",
      ],
      Array [
        "Unexpected unused shared style",
        "styles-no-unused",
      ],
    ]
  `)
  expect(true).toBe(true)
})
