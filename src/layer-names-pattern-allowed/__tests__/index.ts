import { resolve } from 'path'
import {
  invokeRule,
  createDummyConfig,
  LintViolation,
} from '@sketch-hq/sketch-lint-core'

import { ruleModule } from '..'
import { ruleSet } from '../..'

const { name } = ruleModule

const testRule = async (
  fixture: string,
  patterns: string[],
): Promise<LintViolation[]> =>
  await invokeRule(
    resolve(__dirname, fixture),
    createDummyConfig({
      rules: {
        [name]: {
          active: true,
          patterns,
        },
      },
    }),
    ruleSet,
    ruleModule,
  )

test('No violations when all layer names are whitelisted', async (): Promise<
  void
> => {
  expect.assertions(1)
  const violations = await testRule('./layer-names.sketch', [
    'Page 1',
    'Artboard',
    'Group',
    'Type something',
    'Oval',
    'Rectangle',
  ])
  expect(violations.map(violation => violation.message)).toMatchInlineSnapshot(
    `Array []`,
  )
})

test('Finds violations when all layer names are not whitelisted', async (): Promise<
  void
> => {
  expect.assertions(1)
  const violations = await testRule('./layer-names.sketch', [])
  expect(violations.map(violation => violation.message)).toMatchInlineSnapshot(`
    Array [
      "Unexpected layer name \\"Page 1\\", does not match one of the allowable patterns",
      "Unexpected layer name \\"Group\\", does not match one of the allowable patterns",
      "Unexpected layer name \\"Rectangle\\", does not match one of the allowable patterns",
      "Unexpected layer name \\"Oval\\", does not match one of the allowable patterns",
      "Unexpected layer name \\"Type something\\", does not match one of the allowable patterns",
      "Unexpected layer name \\"Artboard\\", does not match one of the allowable patterns",
    ]
  `)
})
