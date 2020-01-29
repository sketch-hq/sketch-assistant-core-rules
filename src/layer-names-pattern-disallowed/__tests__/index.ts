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

test('No violations when no layer names are blacklisted', async (): Promise<
  void
> => {
  expect.assertions(1)
  const violations = await testRule('./layer-names.sketch', [])
  expect(violations.map(violation => violation.message)).toMatchInlineSnapshot(
    `Array []`,
  )
})

test('Finds violations for blacklisted layer names', async (): Promise<
  void
> => {
  expect.assertions(1)
  const violations = await testRule('./layer-names.sketch', ['Artboard'])
  expect(violations.map(violation => violation.message)).toMatchInlineSnapshot(`
    Array [
      "Unexpected disallowed layer name \\"Artboard\\"",
    ]
  `)
})
