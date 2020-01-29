import { resolve } from 'path'
import {
  invokeRule,
  createDummyConfig,
  LintViolation,
} from '@sketch-hq/sketch-lint-core'

import { ruleModule } from '..'
import { ruleSet } from '../..'

const { name } = ruleModule

const testRule = async (fixture: string): Promise<LintViolation[]> =>
  await invokeRule(
    resolve(__dirname, fixture),
    createDummyConfig({
      rules: {
        [name]: {
          active: true,
        },
      },
    }),
    ruleSet,
    ruleModule,
  )

test('No violations for symbol usage', async (): Promise<void> => {
  expect.assertions(1)
  const violations = await testRule('./used-symbol.sketch')
  expect(violations.map(violation => violation.message)).toMatchInlineSnapshot(
    `Array []`,
  )
})

test('Finds violations for unused shared styles', async (): Promise<void> => {
  expect.assertions(1)
  const violations = await testRule('./unused-symbol.sketch')
  expect(violations.map(violation => violation.message)).toMatchInlineSnapshot(`
    Array [
      "Unexpected unused symbol",
    ]
  `)
})
