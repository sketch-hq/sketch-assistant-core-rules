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
        [name]: { active: true },
      },
    }),
    ruleSet,
    ruleModule,
  )

test('No violations for enabled borders', async (): Promise<void> => {
  expect.assertions(1)
  const violations = await testRule('./enabled-border.sketch')
  expect(violations.map(violation => violation.message)).toMatchInlineSnapshot(
    `Array []`,
  )
})

test('Finds violations for disabled borders', async (): Promise<void> => {
  expect.assertions(1)
  const violations = await testRule('./disabled-border.sketch')
  expect(violations.map(violation => violation.message)).toMatchInlineSnapshot(`
    Array [
      "Unexpected disabled border on layer style",
    ]
  `)
})
